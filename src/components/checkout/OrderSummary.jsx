import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrderSummary({
  subtotal,
  isProcessing,
  handlePlaceOrder,
  cartItems,
}) {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-neutral-600" />
            <CardTitle>Order Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-neutral-100">
                  {item.thumbnailImage ? (
                    <img
                      src={`https://ecomback.bfinit.com${item.thumbnailImage}`}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ShoppingBag className="h-6 w-6 text-neutral-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {item.productName}
                  </p>
                  {item.hasVariants && item.variant && (
                    <p className="text-xs text-neutral-500">
                      {item.variant.value.name}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-medium text-neutral-900">
                    €{(item.discountPrice * item.quantity).toFixed(2)}
                  </p>
                  {item.unitPrice > item.discountPrice && (
                    <p className="text-xs text-neutral-500 line-through">
                      €{(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Pricing Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>€{subtotal}</span>
            </div>
            {/* <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span>€{shippingCharges.toFixed(2)}</span>
                  </div> */}
            {/* {discountTotal > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-€{discountTotal.toFixed(2)}</span>
                    </div>
                  )} */}
            {/* {taxTotal > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>Tax</span>
                      <span>€{taxTotal.toFixed(2)}</span>
                    </div>
                  )} */}
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>

          <Button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Place Order</>
            )}
          </Button>

          <p className="text-center text-xs text-neutral-500">
            By placing your order, you agree to our terms and conditions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
