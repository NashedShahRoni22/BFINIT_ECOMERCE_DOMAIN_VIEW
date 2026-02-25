"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useCart from "@/hooks/useCart";
import useGetStorePreference from "@/hooks/useGetStorePreference";
import { formatPrice } from "@/utils/formatPrice";
import useCountry from "@/hooks/useCountry";
import useStoreId from "@/hooks/useStoreId";
import useGetQuery from "@/hooks/api/useGetQuery";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const { selectedCountry, isLoading: countryLoading } = useCountry();
  const { addToCart } = useCart();
  const { data: storePreference } = useGetStorePreference();
  const { storeId } = useStoreId();

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [currentVariantData, setCurrentVariantData] = useState(null);

  const productId = params.productId;
  const countryName = selectedCountry?.country_name;
  const currencySymbol =
    selectedCountry?.currency_symbol || storePreference?.data?.currencySymbol;

  const { data, isLoading } = useGetQuery({
    endpoint: `/product/individualCountryProduct/?productId=${productId}&countryName=${countryName}&storeId=${storeId}`,
    queryKey: ["product", productId, countryName, storeId],
    enabled: !!productId && !!countryName && !!storeId && !countryLoading,
  });

  const product = data?.data;

  // Single source of truth — always pricing[0].variants
  const productVariants = product?.pricing?.[0]?.variants;

  // Initialize selected image when product loads
  useEffect(() => {
    if (product?.thumbnailImage) {
      setSelectedImage(product.thumbnailImage);
    }
  }, [product]);

  // Initialize default variant selections
  useEffect(() => {
    if (productVariants?.enabled && productVariants?.attributes) {
      const defaultSelections = {};
      productVariants.attributes.forEach((attr) => {
        if (attr.required && attr.value?.length > 0) {
          defaultSelections[attr.name] = attr.value[0].name;
        }
      });
      setSelectedVariants(defaultSelections);
    }
  }, [product]);

  // Sync currentVariantData whenever selectedVariants changes
  useEffect(() => {
    if (!productVariants?.enabled) return;

    const selectedAttributeValue = Object.values(selectedVariants)[0];
    if (selectedAttributeValue) {
      const attr = productVariants.attributes.find((a) =>
        a.value.some((v) => v.name === selectedAttributeValue),
      );
      const variantValue = attr?.value.find(
        (v) => v.name === selectedAttributeValue,
      );
      setCurrentVariantData(variantValue ?? null);
    }
  }, [selectedVariants, product]);

  const handleVariantChange = (attributeName, valueName) => {
    setSelectedVariants((prev) => ({ ...prev, [attributeName]: valueName }));

    // Update image if variant has one
    const attr = productVariants?.attributes?.find(
      (a) => a.name === attributeName,
    );
    const value = attr?.value.find((v) => v.name === valueName);
    if (value?.image?.[0]) {
      setSelectedImage(value.image[0]);
    }
  };

  const canAddToCart = () => {
    if (!productVariants?.enabled) return true;
    const requiredAttributes = productVariants.attributes.filter(
      (attr) => attr.required,
    );
    return requiredAttributes.every((attr) => selectedVariants[attr.name]);
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) {
      alert("Please select all required options");
      return;
    }

    if (productVariants?.enabled) {
      const attributeName = Object.keys(selectedVariants)[0] ?? null;
      addToCart(product, quantity, currentVariantData, attributeName);
    } else {
      addToCart(product, quantity, null, null);
    }
  };

  // Returns the numeric price for the current state (variant or product level)
  const getVariantPrice = (variant) => {
    if (!productVariants?.useDefaultPricing && variant?.price) {
      const variantPrice = parseFloat(
        variant.price?.$numberDecimal || variant.price || 0,
      );
      const variantDiscount = parseFloat(
        variant.discountPrice?.$numberDecimal || variant.discountPrice || 0,
      );
      if (variantPrice > 0) {
        return variantDiscount > 0 ? variantDiscount : variantPrice;
      }
    }
    // Fallback to product-level price
    return (
      product?.pricing?.[0]?.productPrice ||
      product?.productPrice?.$numberDecimal ||
      product?.productPrice ||
      0
    );
  };

  const getCurrentPrice = () => {
    if (productVariants?.enabled && currentVariantData) {
      return formatPrice(getVariantPrice(currentVariantData), currencySymbol);
    }
    if (product?.pricing?.length > 0) {
      return formatPrice(product.pricing[0].productPrice, currencySymbol);
    }
    return formatPrice(product?.productPrice || 0, currencySymbol);
  };

  const getDiscountPrice = () => {
    if (
      productVariants?.enabled &&
      !productVariants?.useDefaultPricing &&
      currentVariantData
    ) {
      const discount = parseFloat(
        currentVariantData.discountPrice?.$numberDecimal || 0,
      );
      return discount > 0 ? discount : null;
    }
    if (product?.pricing?.length > 0) {
      const discount = parseFloat(product.pricing[0].discountPrice);
      return discount > 0 ? discount : null;
    }
    const discount = parseFloat(product?.productDiscount?.$numberDecimal || 0);
    return discount > 0 ? discount : null;
  };

  const calculateSavings = () => {
    const discountPrice = getDiscountPrice();
    const currentPrice = getCurrentPrice();
    if (discountPrice && discountPrice > currentPrice) {
      return (((discountPrice - currentPrice) / discountPrice) * 100).toFixed(
        0,
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <Button onClick={() => router.push("/")} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [
    product.thumbnailImage,
    ...(product.productImage || []),
  ].filter(Boolean);

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="border-border bg-card relative aspect-square overflow-hidden rounded-lg border">
              <img
                src={`https://ecomback.bfinit.com${selectedImage}`}
                alt={product.productName}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.best_seller && (
                  <Badge className="bg-warning text-warning-foreground">
                    Bestseller
                  </Badge>
                )}
                {product.new_arrival && (
                  <Badge className="bg-info text-info-foreground">
                    New Arrival
                  </Badge>
                )}
                {product.hot_deal && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    Hot Deal
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="bg-success text-success-foreground">
                    Featured
                  </Badge>
                )}
                {calculateSavings() && (
                  <Badge className="bg-primary text-primary-foreground">
                    Save {calculateSavings()}%
                  </Badge>
                )}
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                      selectedImage === img
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={`https://ecomback.bfinit.com${img}`}
                      alt={`${product.productName} ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.productName}</h1>

            {product.productShortDescription && (
              <p className="text-muted-foreground">
                {product.productShortDescription}
              </p>
            )}

            <Separator />

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">{getCurrentPrice()}</span>
                {getDiscountPrice() && (
                  <span className="text-muted-foreground text-xl line-through">
                    {formatPrice(getDiscountPrice(), currencySymbol)}
                  </span>
                )}
              </div>
              {product.tax && (
                <p className="text-muted-foreground text-sm">Tax included</p>
              )}
            </div>

            <Separator />

            {/* Variants — single block, always from pricing[0].variants */}
            {productVariants?.enabled && productVariants?.attributes && (
              <div className="space-y-4">
                {productVariants.attributes.map((attribute) => (
                  <div key={attribute._id} className="space-y-2">
                    <Label className="text-base font-semibold">
                      {attribute.name}
                      {attribute.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </Label>
                    <RadioGroup
                      value={selectedVariants[attribute.name] || ""}
                      onValueChange={(value) =>
                        handleVariantChange(attribute.name, value)
                      }
                      className="flex flex-wrap gap-2"
                    >
                      {attribute.value.map((option) => (
                        <div key={option._id}>
                          <RadioGroupItem
                            value={option.name}
                            id={option._id}
                            className="peer sr-only"
                            disabled={!option.status}
                          />
                          <Label
                            htmlFor={option._id}
                            className={`border-border hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex cursor-pointer items-center gap-2 rounded-md border-2 px-4 py-2 ${
                              !option.status
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            {option.image?.[0] && (
                              <img
                                src={`https://ecomback.bfinit.com${option.image[0]}`}
                                alt={option.name}
                                className="h-6 w-6 rounded object-cover"
                              />
                            )}
                            <span>{option.name}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Quantity</Label>
              <div className="border-border flex w-fit items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-12 text-center text-base font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-border bg-card rounded-lg border p-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{product.productCategory}</span>
                </div>
                {product.productSubCategory && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subcategory:</span>
                    <span className="font-medium">
                      {product.productSubCategory}
                    </span>
                  </div>
                )}
                {product.productBrand && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand:</span>
                    <span className="font-medium">{product.productBrand}</span>
                  </div>
                )}
                {product.tags?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.tags[0].split(",").map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.productDescription && (
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">Product Description</h2>
            <div
              id="content-display"
              className="prose prose-sm border-border bg-card max-w-none rounded-lg border p-6"
              dangerouslySetInnerHTML={{ __html: product.productDescription }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
