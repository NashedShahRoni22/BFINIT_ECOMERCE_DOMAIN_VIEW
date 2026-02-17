"use client";
import ProductCard from "@/components/cards/products/ProductCard";
import useCountry from "@/hooks/useCountry";
import useStoreId from "@/hooks/useStoreId";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const gridColsMap = {
  2: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
};

const fetchManualProducts = async (idsQuery, productsToShow, countryName) => {
  const response = await fetch(
    `https://ecomback.bfinit.com/product/store/batches?ids=${idsQuery}&limit=${productsToShow || 8}&countryName=${countryName}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function ProductGrid({ content }) {
  const { storeId } = useStoreId();
  const { selectedCountry, isLoading } = useCountry();

  const countryName = selectedCountry?.country_name;

  const fetchAllProducts = async () => {
    const response = await fetch(
      `https://ecomback.bfinit.com/product/store?storeId=${storeId}&countryName=${countryName}`,
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const isManualProduct = content?.productSource?.type === "manual";
  const manualProductIds = isManualProduct ? content?.productSource?.value : [];
  const hasManualProducts = manualProductIds && manualProductIds.length > 0;
  const idsQuery = hasManualProducts ? manualProductIds.join(",") : "";

  // TODO: need to fix product object structure as same as allProducts
  const { data: manualProducts } = useQuery({
    queryFn: () =>
      fetchManualProducts(idsQuery, content?.productsToShowm, countryName),
    queryKey: ["manual-products", idsQuery, countryName],
    enabled:
      !!idsQuery &&
      !!content?.productsToShow &&
      !!countryName &&
      hasManualProducts &&
      !isLoading,
  });

  const { data: allProducts } = useQuery({
    queryFn: fetchAllProducts,
    queryKey: ["products", "list", storeId, countryName],
    enabled: !!storeId && !isManualProduct && !!countryName && !isLoading,
  });

  const mainProducts = isManualProduct
    ? manualProducts?.data || []
    : allProducts?.data || [];

  if (!mainProducts?.length > 0) {
    return null;
  }

  return (
    <div className="bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {content?.showTitle && (
          <h2 className="mb-10 text-center text-4xl font-bold">
            {content.title}
          </h2>
        )}
        <div
          className={cn(
            "mx-auto grid max-w-7xl gap-6",
            gridColsMap[content?.columns],
          )}
        >
          {mainProducts
            ?.slice(0, parseInt(content?.productsToShow))
            ?.map((product) => (
              <ProductCard key={product?._id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
}
