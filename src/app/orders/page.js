"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/useAuth";

export default function Orders() {
  const { customer } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: ordersList } = useQuery({
    queryKey: ["orders", customer?.data?.customerId],
    queryFn: async () => {
      const response = await fetch(
        `https://ecomback.bfinit.com/orders/customerorders/${customer?.data?.customerId}`,
        {
          headers: {
            Authorization: `Bearer ${customer?.token}`,
            customerid: customer?.data?.customerId,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      return response.json();
    },
    enabled: !!customer?.data?.customerId && !!customer?.token,
  });

  const orders = ordersList?.data || [];

  const getStatusColor = (status) => {
    const colors = {
      PLACED: "bg-info text-info-foreground",
      PENDING: "bg-warning text-warning-foreground",
      DELIVERED: "bg-success text-success-foreground",
      CANCELLED: "bg-destructive text-destructive-foreground",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const formatPrice = (price) => {
    return parseFloat(price.$numberDecimal || price).toFixed(2);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-card border-border rounded-lg border p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedOrder(order)}
                  className="text-xs"
                >
                  Details
                </Button>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {order.products.length} item(s)
                </p>
                <p className="text-muted-foreground text-xs">
                  Payment: {order.payment.method}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {order.currencyCode}{" "}
                  {formatPrice(order.pricingSummary.grandTotal)}
                </p>
                <Badge
                  variant="outline"
                  className={getStatusColor(order.deliveryStatus)}
                >
                  {order.deliveryStatus}
                </Badge>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-muted-foreground py-12 text-center">
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="custom-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">
                  Order Information
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium">
                      #{selectedOrder._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Status:</span>
                    <Badge
                      className={getStatusColor(selectedOrder.orderStatus)}
                    >
                      {selectedOrder.orderStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Status:
                    </span>
                    <Badge
                      className={getStatusColor(selectedOrder.deliveryStatus)}
                    >
                      {selectedOrder.deliveryStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Products */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Products</h3>
                <div className="space-y-3">
                  {selectedOrder.products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-muted/50 space-y-2 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {product.productName}
                          </p>
                          {product.variant && (
                            <p className="text-muted-foreground text-xs">
                              Variant: {product.variant}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-semibold">
                          {selectedOrder.currencyCode}{" "}
                          {formatPrice(product.lineTotal)}
                        </p>
                      </div>
                      <div className="text-muted-foreground flex justify-between text-xs">
                        <span>Qty: {product.quantity}</span>
                        <span>
                          Unit Price: {selectedOrder.currencyCode}{" "}
                          {formatPrice(product.unitPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Pricing Summary */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">Pricing Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>
                      {selectedOrder.currencyCode}{" "}
                      {formatPrice(selectedOrder.pricingSummary.subTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span>
                      {selectedOrder.currencyCode}{" "}
                      {formatPrice(
                        selectedOrder.pricingSummary.shippingCharges,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>
                      {selectedOrder.currencyCode}{" "}
                      {formatPrice(selectedOrder.pricingSummary.taxTotal)}
                    </span>
                  </div>
                  {parseFloat(
                    selectedOrder.pricingSummary.discountTotal.$numberDecimal,
                  ) > 0 && (
                    <div className="text-success flex justify-between">
                      <span>Discount:</span>
                      <span>
                        -{selectedOrder.currencyCode}{" "}
                        {formatPrice(
                          selectedOrder.pricingSummary.discountTotal,
                        )}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Grand Total:</span>
                    <span>
                      {selectedOrder.currencyCode}{" "}
                      {formatPrice(selectedOrder.pricingSummary.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Info */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">
                  Payment Information
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Method:
                    </span>
                    <span className="font-medium">
                      {selectedOrder.payment.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Status:
                    </span>
                    <Badge
                      className={getStatusColor(selectedOrder.payment.status)}
                    >
                      {selectedOrder.payment.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipping Details */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">Shipping Address</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p className="text-foreground font-medium">
                    {selectedOrder.shippingDetails.name}
                  </p>
                  <p>{selectedOrder.shippingDetails.addressLine1}</p>
                  {selectedOrder.shippingDetails.addressLine2 && (
                    <p>{selectedOrder.shippingDetails.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingDetails.city},{" "}
                    {selectedOrder.shippingDetails.state}{" "}
                    {selectedOrder.shippingDetails.zipCode}
                  </p>
                  <p>{selectedOrder.shippingDetails.country}</p>
                  <p className="pt-2">
                    <span className="text-foreground font-medium">Phone:</span>{" "}
                    {selectedOrder.shippingDetails.phone}
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Email:</span>{" "}
                    {selectedOrder.shippingDetails.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
