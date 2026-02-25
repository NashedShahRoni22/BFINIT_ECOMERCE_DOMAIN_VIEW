"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/utils/formatPrice";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import useCart from "@/hooks/useCart";
import useGetStorePreference from "@/hooks/useGetStorePreference";
import useCountry from "@/hooks/useCountry";

export default function VariantSelectorModal({ open, onClose, product }) {
  const { data: storePreference } = useGetStorePreference();
  const { addToCart } = useCart();
  const { selectedCountry } = useCountry();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const currencySymbol =
    selectedCountry?.currency_symbol || storePreference?.data?.currencySymbol;

  const newFormattedVariants = product?.pricing?.variants?.attributes;

  // ✅ FIXED: useDefaultPricing=true → always return product price, never read variant.price
  //           useDefaultPricing=false → use variant price, fallback to product price if 0
  const getVariantPrice = (variant) => {
    if (product?.pricing?.variants?.useDefaultPricing) {
      return product?.pricing?.productPrice || product?.productPrice;
    }

    if (variant?.price) {
      const price = parseFloat(
        variant?.price?.$numberDecimal || variant?.price || 0,
      );
      const discount = variant?.discountPrice
        ? parseFloat(
            variant?.discountPrice?.$numberDecimal || variant?.discountPrice,
          )
        : 0;
      const resolved = discount > 0 ? discount : price;
      return resolved > 0
        ? resolved
        : product?.pricing?.productPrice || product?.productPrice;
    }

    return product?.pricing?.productPrice || product?.productPrice;
  };

  const getAttributeName = (variant) => {
    const attributes =
      newFormattedVariants || product?.variants?.attributes || [];
    const attribute = attributes.find((attr) =>
      attr.value.some((v) => v._id === variant._id),
    );
    return attribute?.name || null;
  };

  const handleClose = () => {
    setSelectedVariant(null);
    setQuantity(1);
    onClose();
  };

  const handleAddToCart = () => {
    const attributeName = selectedVariant
      ? getAttributeName(selectedVariant)
      : null;
    addToCart(product, quantity, selectedVariant, attributeName);
    handleClose();
  };

  // ✅ CHANGED: Dynamic — shows base price until a variant is selected,
  //             then updates to reflect the selected variant's price.
  const displayPrice = selectedVariant
    ? getVariantPrice(selectedVariant)
    : product?.pricing?.productPrice || product?.price;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Options</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-3">
            <img
              src={`https://ecomback.bfinit.com${product.thumbnailImage}`}
              alt={product.productName}
              className="h-20 w-20 rounded-md object-cover"
            />
            <div>
              <h3 className="font-semibold">{product.productName}</h3>
              {/* ✅ CHANGED: Uses displayPrice instead of static price */}
              <p className="text-muted-foreground text-sm">
                {formatPrice(displayPrice, currencySymbol)}
              </p>
            </div>
          </div>

          {/* Variant Selection — old format */}
          {!newFormattedVariants?.length > 0 &&
            product.variants?.attributes?.map((attribute, attrIndex) => (
              <div key={attrIndex} className="space-y-3">
                <Label className="text-base">
                  {attribute.name}
                  {attribute.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>

                <RadioGroup
                  value={selectedVariant?.sku || ""}
                  onValueChange={(sku) => {
                    const variant = attribute.value.find((v) => v.sku === sku);
                    setSelectedVariant(variant);
                  }}
                >
                  {/* ✅ CHANGED: Removed per-row price — price shown in header instead */}
                  {attribute.value?.map((variant) => {
                    const isOutOfStock = false;
                    return (
                      <div
                        key={variant.sku}
                        className={`border-border flex items-center rounded-lg border p-3 ${
                          isOutOfStock ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={variant.sku}
                            id={variant.sku}
                            disabled={isOutOfStock}
                          />
                          <Label
                            htmlFor={variant.sku}
                            className={`cursor-pointer ${
                              isOutOfStock ? "cursor-not-allowed" : ""
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {variant.name}
                              </span>
                              {variant.image?.length > 0 && (
                                <span className="text-muted-foreground text-xs">
                                  Has image
                                </span>
                              )}
                            </div>
                          </Label>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}

          {/* Variant Selection — new format */}
          {newFormattedVariants?.length > 0 &&
            newFormattedVariants?.map((attribute, attrIndex) => (
              <div key={attrIndex} className="space-y-3">
                <Label className="text-base">
                  {attribute.name}
                  {attribute.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>

                <RadioGroup
                  value={selectedVariant?.sku || ""}
                  onValueChange={(sku) => {
                    const variant = attribute.value.find((v) => v.sku === sku);
                    setSelectedVariant(variant);
                  }}
                >
                  {/* ✅ CHANGED: Removed per-row price — price shown in header instead */}
                  {attribute.value?.map((variant) => {
                    const isOutOfStock = false;
                    return (
                      <div
                        key={variant.sku}
                        className={`border-border flex items-center rounded-lg border p-3 ${
                          isOutOfStock ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={variant.sku}
                            id={variant.sku}
                            disabled={isOutOfStock}
                          />
                          <Label
                            htmlFor={variant.sku}
                            className={`cursor-pointer ${
                              isOutOfStock ? "cursor-not-allowed" : ""
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {variant.name}
                              </span>
                              {variant.image?.length > 0 && (
                                <span className="text-muted-foreground text-xs">
                                  Has image
                                </span>
                              )}
                            </div>
                          </Label>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[3ch] text-center font-semibold">
                {quantity}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const maxStock = selectedVariant?.stock || 999;
                  setQuantity(Math.min(maxStock, quantity + 1));
                }}
                // disabled={selectedVariant && quantity >= selectedVariant.stock} // TODO: stock track
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
