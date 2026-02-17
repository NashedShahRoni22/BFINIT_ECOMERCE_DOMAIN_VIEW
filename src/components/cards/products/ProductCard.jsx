"use client";
import { useState } from "react";
import { ShoppingCart, Eye, Star, Settings2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatPrice";
import { getDiscountPercent } from "@/utils/products";
import useCart from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import useGetStorePreference from "@/hooks/useGetStorePreference";
import VariantSelectorModal from "@/components/modals/VariantSelectorModal";
import useCountry from "@/hooks/useCountry";

export default function ProductCard({ product }) {
  const {
    productId,
    productName,
    productPrice,
    productDiscount,
    thumbnailImage,
    productShortDescription,
    rating = 0,
    featured,
    new_arrival,
    best_seller,
    hot_deal,
    flash_sale,
    limited_stock,
    variants,
    pricing,
  } = product || {};

  const { selectedCountry } = useCountry();
  const { data: storePreference } = useGetStorePreference();

  const currencySymbol =
    selectedCountry?.currency_symbol || storePreference?.data?.currencySymbol;

  const { addToCart } = useCart();

  const [showVariantModal, setShowVariantModal] = useState(false);

  const originalPrice = productPrice?.$numberDecimal
    ? productPrice?.$numberDecimal
    : productPrice || pricing?.productPrice;

  const originalDiscount = productDiscount?.$numberDecimal
    ? productDiscount?.$numberDecimal
    : productDiscount || pricing?.discountPrice;

  const hasVariants =
    (pricing?.variants?.enabled && pricing?.variants?.attributes?.length > 0) ||
    (variants?.enabled && variants?.attributes?.length > 0);

  const hasRequiredVariants =
    (hasVariants &&
      pricing?.variants?.attributes.some((attr) => attr.required === true)) ||
    (hasVariants &&
      variants?.attributes.some((attr) => attr.required === true));

  const discountPercent = getDiscountPercent(originalPrice, originalDiscount);

  const badge = flash_sale
    ? {
        text: "Flash Sale",
        color: "bg-destructive text-destructive-foreground",
      }
    : hot_deal
      ? { text: "Hot Deal", color: "bg-warning text-warning-foreground" }
      : limited_stock
        ? {
            text: "Limited",
            color: "bg-destructive text-destructive-foreground",
          }
        : new_arrival
          ? { text: "New", color: "bg-info text-info-foreground" }
          : best_seller
            ? {
                text: "Bestseller",
                color: "bg-success text-success-foreground",
              }
            : featured
              ? {
                  text: "Featured",
                  color: "bg-primary text-primary-foreground",
                }
              : null;

  const handleAddToCart = () => {
    if (hasRequiredVariants) {
      setShowVariantModal(true);
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <>
      <div className="group bg-card border-border hover:border-primary/50 relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300">
        {/* Image Container */}
        <div className="bg-muted relative aspect-square overflow-hidden">
          {thumbnailImage ? (
            <Link href={`/shop/${productId}`} className="h-full w-full">
              <Image
                src={`https://ecomback.bfinit.com${thumbnailImage}`}
                alt={productName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </Link>
          ) : (
            <div className="bg-muted flex aspect-square w-full items-center justify-center rounded-lg">
              <ImageIcon
                className="text-muted-foreground/20 h-20 w-20"
                strokeWidth={0.5}
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground/25 -rotate-12 text-4xl font-medium">
                  DEMO
                </span>
              </div>
            </div>
          )}

          {/* Badges */}
          {badge && (
            <div
              className={`absolute top-3 left-3 rounded-md px-2.5 py-1 text-xs font-semibold ${badge.color}`}
            >
              {badge.text}
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="bg-destructive text-destructive-foreground absolute top-3 right-3 rounded-md px-2.5 py-1 text-xs font-semibold">
              -{discountPercent}%
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="bg-background/95 hover:bg-primary hover:text-primary-foreground h-9 w-9 rounded-full backdrop-blur-sm"
            >
              <Link href={`/shop/${productId}`}>
                <Eye />
              </Link>
            </Button>
            {/* <Button
              size="icon"
              variant="secondary"
              className="bg-background/95 hover:bg-primary hover:text-primary-foreground h-9 w-9 rounded-full backdrop-blur-sm"
            >
              <Heart className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Rating */}
          {rating > 0 && (
            <div className="mb-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(rating)
                      ? "fill-warning text-warning"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
              <span className="text-muted-foreground ml-1 text-xs">
                ({rating})
              </span>
            </div>
          )}

          {/* Product Name */}
          <Link
            href={`/shop/${productId}`}
            className="group-hover:text-primary mb-2 line-clamp-2 text-sm leading-snug font-semibold transition-colors"
          >
            {productName}
          </Link>

          {/* Description */}
          {productShortDescription && (
            <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
              {productShortDescription}
            </p>
          )}

          {/* Price & Add to Cart */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  {formatPrice(originalPrice, currencySymbol)}
                </span>
                {originalDiscount > 0 && (
                  <span className="text-muted-foreground text-xs line-through">
                    {formatPrice(originalDiscount, currencySymbol)}
                  </span>
                )}
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="hover:bg-primary/90 h-9 gap-1.5 px-3 text-xs font-medium"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>
      </div>

      <VariantSelectorModal
        open={showVariantModal}
        onClose={setShowVariantModal}
        product={product}
      />
    </>
  );
}
