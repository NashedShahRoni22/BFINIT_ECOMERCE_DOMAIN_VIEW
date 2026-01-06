"use client";
import { useState, useMemo } from "react";
import { Grid3x3, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { storeId } from "@/utils/contstants";
import ProductCard from "@/components/cards/products/ProductCard";

const gridLayoutMap = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

const fetchAllProducts = async (currentPage, productsPerPage) => {
  const response = await fetch(
    `https://ecomback.bfinit.com/product/store?storeId=${storeId}&page=${currentPage}&limit=${productsPerPage}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function Shop() {
  const [currentPage, setCurrentPage] = useState(1);
  const [gridLayout, setGridLayout] = useState(4);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const productsPerPage = 20;

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryFn: () => fetchAllProducts(currentPage, productsPerPage),
    queryKey: ["shop-products", storeId, currentPage],
    enabled: !!storeId,
  });

  const products = productsData?.data?.length > 0 ? productsData.data : [];
  const totalPages = productsData?.totalPages || 1;

  // Extract unique values for filters
  const { categories, brands } = useMemo(() => {
    const cats = [
      ...new Set(products.map((p) => p.productCategory).filter(Boolean)),
    ];
    const brds = [
      ...new Set(
        products
          .map((p) => p.productBrand)
          .filter((b) => b && b !== "Undefined"),
      ),
    ];
    const tgs = [...new Set(products.flatMap((p) => p.tags || []))];
    return { categories: cats, brands: brds, tags: tgs };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.productCategory),
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) =>
        selectedBrands.includes(p.productBrand),
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        p.tags?.some((tag) => selectedTags.includes(tag)),
      );
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const price = p.productPrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.productPrice - b.productPrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.productPrice - a.productPrice);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return filtered;
  }, [
    products,
    selectedCategories,
    selectedBrands,
    selectedTags,
    priceRange,
    sortBy,
  ]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedTags([]);
    setPriceRange([0, 10000]);
    setSortBy("default");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedTags.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000;

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="bg-muted/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
            Shop All Products
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
            Discover our complete collection of quality products curated just
            for you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside
            className={cn(
              "hidden w-64 flex-shrink-0 lg:block",
              showFilters && "block",
            )}
          >
            <div className="bg-card border-border sticky top-4 rounded-lg border p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-primary text-xs hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-medium">Categories</h4>
                  <div className="custom-scrollbar max-h-48 space-y-2 overflow-y-auto">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex cursor-pointer items-center"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="border-border mr-2 rounded"
                        />
                        <span className="text-muted-foreground text-sm">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-medium">Brands</h4>
                  <div className="custom-scrollbar max-h-48 space-y-2 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex cursor-pointer items-center"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="border-border mr-2 rounded"
                        />
                        <span className="text-muted-foreground text-sm">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-medium">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="bg-card border-border mb-6 rounded-lg border p-4">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                {/* Results Count */}
                <div className="text-muted-foreground text-sm">
                  Showing{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
                  products
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-secondary text-secondary-foreground flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-background border-border rounded-md border px-4 py-2 text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>

                  {/* Grid Layout */}
                  <div className="bg-muted hidden items-center gap-1 rounded-md p-1 sm:flex">
                    {[2, 3, 4, 5].map((cols) => (
                      <button
                        key={cols}
                        onClick={() => setGridLayout(cols)}
                        className={cn(
                          "rounded p-2 transition-colors",
                          gridLayout === cols
                            ? "bg-background shadow-sm"
                            : "text-muted-foreground hover:",
                        )}
                      >
                        {cols === 2 && <Grid3x3 className="h-4 w-4" />}
                        {cols === 3 && <LayoutGrid className="h-4 w-4" />}
                        {cols === 4 && <Grid3x3 className="h-4 w-4" />}
                        {cols === 5 && <List className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Active filters:
                </span>
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                  >
                    {cat}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {selectedBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                  >
                    {brand}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                  >
                    {tag}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className={cn("grid gap-6", gridLayoutMap[gridLayout])}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted mb-4 aspect-square rounded-lg"></div>
                    <div className="bg-muted mb-2 h-4 w-3/4 rounded"></div>
                    <div className="bg-muted h-4 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className={cn("grid gap-6", gridLayoutMap[gridLayout])}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.productId || product._id}
                    product={product}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="py-16 text-center">
                <div className="bg-muted mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
                  <SlidersHorizontal className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-primary text-primary-foreground rounded-md px-6 py-2 text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="border-border hover:bg-accent rounded-md border px-6 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "h-10 w-10 rounded-md border text-sm font-medium transition-colors",
                            currentPage === pageNum
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:bg-accent",
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span key={pageNum} className="text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="border-border hover:bg-accent rounded-md border px-6 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm lg:hidden">
          <div className="bg-card border-border fixed inset-y-0 left-0 w-full max-w-sm overflow-y-auto border-r p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="hover:bg-accent rounded-md p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Same filter content as desktop sidebar */}
            {/* ... (repeat filter sections here) ... */}
          </div>
        </div>
      )}
    </div>
  );
}
