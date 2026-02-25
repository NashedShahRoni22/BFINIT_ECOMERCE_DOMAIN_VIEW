"use client";

import { CartContext } from "@/context/CartContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cartItems]);

  /**
   * Generate unique cart item ID
   * Product + Variant combination = unique cart item
   */
  const generateCartItemId = (productId, selectedVariant) => {
    if (selectedVariant) {
      return `${productId}-${selectedVariant._id}`;
    }
    return productId;
  };

  const addToCart = (
    product,
    quantity = 1,
    selectedVariant = null,
    attributeName = null,
  ) => {
    const cartItemId = generateCartItemId(
      product._id || product.productId,
      selectedVariant,
    );

    // Check if item already exists BEFORE setState
    const existingItem = cartItems.find((item) => item.id === cartItemId);

    if (existingItem) {
      toast.success("Item is already in cart");
      return;
    }

    setCartItems((prev) => {
      // ---------------------------------------------------------------
      // Normalise variant config — handles two product shapes:
      //   ProductDetails API  → product.pricing is an ARRAY  → pricing[0].variants
      //   VariantSelectorModal → product.pricing is an OBJECT → pricing.variants
      // ---------------------------------------------------------------
      const variantConfig =
        product?.pricing?.[0]?.variants || // ProductDetails (array)
        product?.pricing?.variants || // VariantSelectorModal (object)
        product?.variants || // legacy shape
        null;

      const hasVariants =
        variantConfig?.enabled === true && selectedVariant !== null;

      const useDefaultPricing = variantConfig?.useDefaultPricing ?? true;

      // ---------------------------------------------------------------
      // Resolve product-level fallback price — again handles both shapes
      // ---------------------------------------------------------------
      const productFallbackPrice = parseFloat(
        product?.pricing?.[0]?.productPrice || // ProductDetails
          product?.pricing?.productPrice || // VariantSelectorModal
          product?.productPrice?.$numberDecimal || // legacy
          product?.productPrice ||
          0,
      );

      const productFallbackCompareAt = parseFloat(
        product?.pricing?.[0]?.discountPrice ||
          product?.pricing?.discountPrice ||
          product?.productDiscount?.$numberDecimal ||
          product?.productDiscount ||
          0,
      );

      // ---------------------------------------------------------------
      // Resolve actual price
      // ---------------------------------------------------------------
      let actualPrice, compareAtPrice;

      if (hasVariants) {
        if (useDefaultPricing) {
          // All variants share the product-level price
          actualPrice = productFallbackPrice;
          compareAtPrice =
            productFallbackCompareAt > 0 ? productFallbackCompareAt : null;
        } else {
          // Each variant has its own price; fall back to product price if 0
          const variantPrice = parseFloat(
            selectedVariant?.price?.$numberDecimal || 0,
          );
          const variantCompareAt = parseFloat(
            selectedVariant?.discountPrice?.$numberDecimal || 0,
          );

          actualPrice = variantPrice > 0 ? variantPrice : productFallbackPrice;
          compareAtPrice = variantCompareAt > 0 ? variantCompareAt : null;
        }
      } else {
        // Non-variant product
        actualPrice = productFallbackPrice;
        compareAtPrice =
          productFallbackCompareAt > 0 ? productFallbackCompareAt : null;
      }

      // ---------------------------------------------------------------
      // Determine thumbnail
      // ---------------------------------------------------------------
      const thumbnail =
        hasVariants && selectedVariant.image?.length > 0
          ? selectedVariant.image[0]
          : product?.thumbnailImage;

      // ---------------------------------------------------------------
      // Build cart item
      // ---------------------------------------------------------------
      const cartItem = {
        id: cartItemId,
        productId: product._id || product.productId,
        productName: product.productName,
        thumbnailImage: thumbnail,

        // Pricing
        actualPrice,
        compareAtPrice,

        // Backwards-compatible aliases
        unitPrice: actualPrice,
        discountPrice: actualPrice,

        // Quantity
        quantity,

        // Variant info (for checkout)
        hasVariants,
        variant: hasVariants
          ? {
              attributeId: selectedVariant._id,
              name: attributeName,
              value: {
                id: selectedVariant._id,
                name: selectedVariant.name,
                value: selectedVariant.name,
              },
            }
          : null,

        // Raw variant data (for display)
        selectedVariant: selectedVariant || null,

        // Timestamps
        addedAt: new Date().toISOString(),
      };

      return [...prev, cartItem];
    });

    toast.success("Added to cart successfully");
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== cartItemId);
      return updated;
    });

    toast.success("Removed from cart");
  };

  /**
   * Update item quantity
   */
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item,
      ),
    );
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast.success("Cart cleared");
  };

  /**
   * Get price for a cart item (respects variant pricing)
   */
  const getItemPrice = (item) => {
    return item.discountPrice || item.unitPrice;
  };

  /**
   * Calculate totals
   */
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0,
  );

  const totalSavings = cartItems.reduce((sum, item) => {
    const originalPrice = item.unitPrice;
    const currentPrice = item.discountPrice || item.unitPrice;

    if (currentPrice < originalPrice) {
      return sum + (originalPrice - currentPrice) * item.quantity;
    }
    return sum;
  }, 0);

  /**
   * Transform cart to COD checkout format
   */
  const getCODCheckoutData = () => {
    return cartItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      hasVariants: item.hasVariants || false,
      variant: item.variant || null,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountPrice: item.discountPrice,
      taxAmount: 0,
      lineTotal: parseFloat((getItemPrice(item) * item.quantity).toFixed(2)),
    }));
  };

  /**
   * Transform cart to Stripe checkout format
   */
  const getStripeCheckoutData = () => {
    return cartItems.map((item) => ({
      productId: item.productId,
      productName: item.hasVariants
        ? `${item.productName} - ${item.variant.value.name}`
        : item.productName,
      quantity: item.quantity,
      price: item.discountPrice,
    }));
  };

  /**
   * Check if product+variant is in cart
   */
  const isInCart = (productId, variantId = null) => {
    const cartItemId = variantId ? `${productId}-${variantId}` : productId;
    return cartItems.some((item) => item.id === cartItemId);
  };

  /**
   * Get quantity of specific product+variant in cart
   */
  const getItemQuantity = (productId, variantId = null) => {
    const cartItemId = variantId ? `${productId}-${variantId}` : productId;
    const item = cartItems.find((item) => item.id === cartItemId);
    return item ? item.quantity : 0;
  };

  const value = {
    // State
    cartItems,
    isLoading,
    isEmpty: cartItems.length === 0,

    // Totals
    totalItems,
    totalCartItems: totalItems, // Alias for compatibility
    subtotal,
    totalSavings,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Helpers
    getItemPrice,
    isInCart,
    getItemQuantity,

    // Checkout transformations
    getCODCheckoutData,
    getStripeCheckoutData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
