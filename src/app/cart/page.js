"use client";
import { useContext } from "react";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Cart() {
  const { customer } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalSavings,
    getItemPrice,
  } = useContext(CartContext);

  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <div className="bg-background min-h-[60vh]">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-muted rounded-full p-8">
                <ShoppingBag className="text-muted-foreground h-16 w-16" />
              </div>
            </div>
            <h2 className="mb-3 text-3xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added anything to your cart yet
            </p>
            <Link
              href="/shop"
              className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-2 rounded-md px-8 py-3 text-sm font-medium transition-colors"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = subtotal;

  const handleCheckout = () => {
    if (customer?.token) {
      return router.push("/checkout");
    }

    router.push("/login");
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold lg:text-4xl">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => {
              const itemPrice = getItemPrice(item);
              const itemTotal = itemPrice * item.quantity;
              const hasDiscount = item.unitPrice > item.discountPrice;
              const discountPercentage = hasDiscount
                ? Math.round(
                    ((item.unitPrice - item.discountPrice) / item.unitPrice) *
                      100,
                  )
                : 0;

              return (
                <div
                  key={item.id}
                  className="bg-card relative rounded-lg border p-4 transition-shadow hover:shadow-md lg:p-6"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="bg-muted relative h-24 w-24 shrink-0 overflow-hidden rounded-md lg:h-32 lg:w-32">
                      <Image
                        src={`https://ecomback.bfinit.com${item.thumbnailImage}`}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                      {hasDiscount && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-destructive text-destructive-foreground rounded px-2 py-0.5 text-xs font-semibold">
                            -{discountPercentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/shop/${item.productId}`}
                              className="text-card-foreground hover: text-base font-semibold transition-colors lg:text-lg"
                            >
                              {item.productName}
                            </Link>
                            {item.hasVariants && item.variant && (
                              <p className="text-muted-foreground mt-1 text-sm">
                                {item.variant.name}: {item.variant.value.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:bg-muted hover: rounded-md p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-lg font-bold">
                            ${itemPrice.toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-muted-foreground text-sm line-through">
                              ${item.unitPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls and Total */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="bg-background hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="bg-background hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-muted-foreground text-xs">
                            Subtotal
                          </p>
                          <p className="text-lg font-bold">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-muted-foreground hover: text-sm underline transition-colors"
            >
              Clear all items
            </button>
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Summary Card */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-card-foreground mb-6 text-xl font-bold">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Savings */}
                  {totalSavings > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-success flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        You Save
                      </span>
                      <span className="text-success font-semibold">
                        -${totalSavings.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t"></div>

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="bg-foreground text-background hover:bg-foreground/90 mt-6 flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {/* Continue Shopping */}
                <Link
                  href="/shop"
                  className="hover:bg-muted mt-3 flex w-full items-center justify-center rounded-md border px-6 py-3.5 text-sm font-semibold transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
