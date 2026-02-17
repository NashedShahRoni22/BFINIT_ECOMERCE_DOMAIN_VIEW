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
  const price = product?.pricing?.productPrice || product?.price;
  const newFormattedVariants = product?.pricing?.variants?.attributes;

  const getVariantPrice = (variant) => {
    if (
      newFormattedVariants?.length > 0 &&
      product?.pricing?.variants?.useDefaultPricing &&
      variant?.price
    ) {
      const price = parseFloat(variant.price.$numberDecimal || variant.price);
      const discount = variant.discountPrice
        ? parseFloat(
            variant.discountPrice.$numberDecimal || variant.discountPrice,
          )
        : 0;
      return discount > 0 ? discount : price;
    }

    // FIX: product.variants was accessed without optional chaining, crashing when undefined
    if (!product?.variants?.useDefaultPricing && variant?.price) {
      const price = parseFloat(variant.price.$numberDecimal || variant.price);
      const discount = variant.discountPrice
        ? parseFloat(
            variant.discountPrice.$numberDecimal || variant.discountPrice,
          )
        : 0;
      return discount > 0 ? discount : price;
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
              <p className="text-muted-foreground text-sm">
                {formatPrice(price, currencySymbol)}
              </p>
            </div>
          </div>

          {/* Variant Selection */}
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
                  {attribute.value?.map((variant) => {
                    const variantPrice = getVariantPrice(variant);
                    const isOutOfStock = false;

                    return (
                      <div
                        key={variant.sku}
                        className={`border-border flex items-center justify-between rounded-lg border p-3 ${
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

                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(variantPrice)}
                          </p>
                          {/* TODO: fix this status after stock track feature */}
                          {/* {isOutOfStock ? (
                          <p className="text-destructive text-xs">
                            Out of stock
                          </p>
                        ) : (
                          <p className="text-muted-foreground text-xs">
                            {variant.stock} in stock
                          </p>
                        )} */}
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}

          {/* New formated variant selection modal */}
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
                  {attribute.value?.map((variant) => {
                    const variantPrice = getVariantPrice(variant);
                    const isOutOfStock = false;

                    return (
                      <div
                        key={variant.sku}
                        className={`border-border flex items-center justify-between rounded-lg border p-3 ${
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

                        {variantPrice > 0 && (
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatPrice(variantPrice, currencySymbol)}
                            </p>
                          </div>
                        )}
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
                // disabled={selectedVariant && quantity >= selectedVariant.stock} // TODO: stock track logic will be here too
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
