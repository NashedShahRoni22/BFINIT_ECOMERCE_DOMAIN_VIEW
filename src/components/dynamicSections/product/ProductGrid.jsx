"use client";
import ProductCard from "@/components/cards/products/ProductCard";
import { cn } from "@/lib/utils";
import { staticStoreId } from "@/utils/storeId";
import { useQuery } from "@tanstack/react-query";

const gridColsMap = {
  2: "grid-cols-2",
  4: "grid-cols-4",
  6: "grid-cols-6",
};

const fetchManualProducts = async (idsQuery, productsToShow) => {
  const response = await fetch(
    `https://ecomback.bfinit.com/product/store/batches?ids=${idsQuery}&limit=${productsToShow || 8}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchAllProducts = async () => {
  const response = await fetch(
    `https://ecomback.bfinit.com/product/store?storeId=${staticStoreId}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function ProductGrid({ content }) {
  const isManualProduct = content?.productSource?.type === "manual";
  const manualProductIds = isManualProduct ? content?.productSource?.value : [];
  const hasManualProducts = manualProductIds && manualProductIds.length > 0;
  const idsQuery = hasManualProducts ? manualProductIds.join(",") : "";

  // TODO: need to fix product object structure as same as allProducts
  const { data: manualProducts } = useQuery({
    queryFn: () => fetchManualProducts(idsQuery, content?.productsToShow),
    queryKey: ["manual-products", idsQuery],
    enabled: !!idsQuery && !!content?.productsToShow && hasManualProducts,
  });

  const { data: allProducts } = useQuery({
    queryFn: fetchAllProducts,
    queryKey: ["products", "list", staticStoreId],
    enabled: !!staticStoreId && !isManualProduct,
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
