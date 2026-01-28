import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import useStoreId from "@/hooks/useStoreId";
import Link from "next/link";
import Image from "next/image";
import useDebounce from "@/hooks/useDebounce";
import useGetQuery from "@/hooks/api/useGetQuery";
import useGetStorePreference from "@/hooks/useGetStorePreference";

export default function SearchOverlay({ setSearchOpen }) {
  const { storeId } = useStoreId();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: searchedProductsData, isLoading } = useGetQuery({
    endpoint: `/product/store?storeId=${storeId}&page=1&limit=6&search=${debouncedSearch}`,
    queryKey: ["search-products", storeId, debouncedSearch],
    enabled: !!storeId && !!debouncedSearch && debouncedSearch.length >= 2,
  });

  const { data: storePreference } = useGetStorePreference();
  const currencySymbol = storePreference?.data?.currencySymbol || "$";

  const products = searchedProductsData?.data || [];
  const total = searchedProductsData?.total || 0;
  const hasMore = total > 6;

  return (
    <div className="bg-background fixed inset-0 z-50">
      <div className="mx-auto flex h-full max-w-3xl flex-col px-4 py-6">
        {/* Search Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
              size={20}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search products..."
              autoFocus
              className="h-12 pl-11 text-base"
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => setSearchOpen(false)}
            className="h-12 px-4"
          >
            Cancel
          </Button>
        </div>

        {/* Search Results */}
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          {/* Initial State */}
          {!debouncedSearch && (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <div className="text-center">
                <Search className="mx-auto mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">Start typing to search products...</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && debouncedSearch && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex animate-pulse gap-4">
                  <div className="bg-muted h-20 w-20 shrink-0 rounded-md" />
                  <div className="flex-1">
                    <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
                    <div className="bg-muted h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && debouncedSearch && products.length > 0 && (
            <div className="space-y-3">
              <div className="text-muted-foreground mb-4 text-sm">
                Found{" "}
                <span className="text-foreground font-medium">{total}</span>{" "}
                {total === 1 ? "product" : "products"}
              </div>

              {products.map((product) => (
                <Link
                  key={product.productId}
                  href={`/shop/${product.productId}`}
                  onClick={() => setSearchOpen(false)}
                  className="hover:bg-accent flex gap-4 rounded-lg p-3 transition-colors"
                >
                  <Image
                    src={`https://ecomback.bfinit.com${product.thumbnailImage}`}
                    alt={product.productName}
                    width={80}
                    height={80}
                    className="bg-muted shrink-0 rounded-md object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h4 className="mb-1 truncate text-sm font-medium">
                      {product.productName}
                    </h4>
                    <p className="text-primary text-sm font-semibold">
                      {currencySymbol}
                      {product.productPrice.toFixed(2)}
                    </p>
                    {product.productCategory && (
                      <p className="text-muted-foreground truncate text-xs">
                        {product.productCategory}
                      </p>
                    )}
                  </div>
                </Link>
              ))}

              {/* View All Results Button */}
              {hasMore && (
                <>
                  <Separator className="my-4" />
                  <Link
                    href={`/shop?search=${encodeURIComponent(debouncedSearch)}`}
                    onClick={() => setSearchOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      View All {total} Results
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* No Results */}
          {!isLoading &&
            debouncedSearch &&
            debouncedSearch.length >= 2 &&
            products.length === 0 && (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                <div className="text-center">
                  <Search className="mx-auto mb-3 h-12 w-12 opacity-20" />
                  <p className="text-foreground mb-1 text-sm font-medium">
                    No products found
                  </p>
                  <p className="text-sm">
                    Try searching with different keywords
                  </p>
                </div>
              </div>
            )}

          {/* Minimum Character Warning */}
          {debouncedSearch && debouncedSearch.length < 2 && (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <p className="text-sm">Type at least 2 characters to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
