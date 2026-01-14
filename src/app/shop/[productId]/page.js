"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useCart from "@/hooks/useCart";
import useGetStorePreference from "@/hooks/useGetStorePreference";
import { formatPrice } from "@/utils/formatPrice";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId;
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [currentVariantData, setCurrentVariantData] = useState(null);

  const { data: storePreference } = useGetStorePreference();

  // Fetch product data with Tanstack Query
  const { data, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await fetch(
        `https://ecomback.bfinit.com/product/?productId=${productId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!productId,
  });

  const currencySymbol = storePreference?.data?.currencySymbol;

  const product = data?.data;

  // Initialize selected image when product loads
  useEffect(() => {
    if (product?.thumbnailImage) {
      setSelectedImage(product.thumbnailImage);
    }
  }, [product]);

  // Initialize default variant selections
  useEffect(() => {
    if (product?.variants?.enabled && product?.variants?.attributes) {
      const defaultSelections = {};
      product.variants.attributes.forEach((attr) => {
        if (attr.required && attr.value?.length > 0) {
          defaultSelections[attr.name] = attr.value[0].name;
        }
      });
      setSelectedVariants(defaultSelections);
    }
  }, [product]);

  // Update current variant data based on selections
  useEffect(() => {
    if (!product?.variants?.enabled) return;

    const selectedAttribute = Object.values(selectedVariants)[0];
    if (selectedAttribute) {
      const attr = product.variants.attributes.find((a) =>
        a.value.some((v) => v.name === selectedAttribute),
      );
      const variantValue = attr?.value.find(
        (v) => v.name === selectedAttribute,
      );
      setCurrentVariantData(variantValue);
    }
  }, [selectedVariants, product]);

  const handleVariantChange = (attributeName, valueName) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [attributeName]: valueName,
    }));

    // Update image if variant has one
    const attr = product.variants.attributes.find(
      (a) => a.name === attributeName,
    );
    const value = attr?.value.find((v) => v.name === valueName);
    if (value?.image?.[0]) {
      setSelectedImage(value.image[0]);
    }
  };

  const canAddToCart = () => {
    if (!product?.variants?.enabled) return true;

    const requiredAttributes = product.variants.attributes.filter(
      (attr) => attr.required,
    );
    return requiredAttributes.every((attr) => selectedVariants[attr.name]);
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) {
      alert("Please select all required options");
      return;
    }

    // Get the selected variant data if variants are enabled
    const selectedVariant = product.variants?.enabled
      ? currentVariantData
      : null;

    // Get the attribute name (first selected variant's attribute name)
    const attributeName = product.variants?.enabled
      ? Object.keys(selectedVariants)[0]
      : null;

    // Call addToCart with correct parameters
    addToCart(product, quantity, selectedVariant, attributeName);
  };

  const getCurrentPrice = () => {
    if (
      product?.variants?.enabled &&
      !product.variants.useDefaultPricing &&
      currentVariantData
    ) {
      return formatPrice(
        currentVariantData.price.$numberDecimal,
        currencySymbol,
      );
    }
    return formatPrice(product?.productPrice || 0, currencySymbol);
  };

  const getDiscountPrice = () => {
    if (
      product?.variants?.enabled &&
      !product.variants.useDefaultPricing &&
      currentVariantData
    ) {
      const discount = parseFloat(
        currentVariantData.discountPrice.$numberDecimal,
      );
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
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
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
            {/* Main Image */}
            <div className="border-border bg-card relative aspect-square overflow-hidden rounded-lg border">
              <img
                src={`https://ecomback.bfinit.com${selectedImage}`}
                alt={product.productName}
                className="h-full w-full object-cover"
              />
              {/* Badges */}
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

            {/* Thumbnail Gallery */}
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
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold">{product.productName}</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-warning text-warning"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            </div>

            {/* Short Description */}
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
                    ${getDiscountPrice().toFixed(2)}
                  </span>
                )}
              </div>
              {product.tax && (
                <p className="text-muted-foreground text-sm">Tax included</p>
              )}
            </div>

            <Separator />

            {/* Variants */}
            {product.variants?.enabled && (
              <div className="space-y-4">
                {product.variants.attributes.map((attribute) => (
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
                            {!product.variants.useDefaultPricing &&
                              parseFloat(option.price.$numberDecimal) > 0 && (
                                <span className="text-muted-foreground text-xs">
                                  +$
                                  {parseFloat(
                                    option.price.$numberDecimal,
                                  ).toFixed(2)}
                                </span>
                              )}
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
              <div className="flex items-center gap-4">
                <div className="border-border flex items-center rounded-md border">
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
            </div>

            {/* Action Buttons */}
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
