import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Building2, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { staticStoreId } from "@/utils/storeId";

export default function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
  bankDetails,
}) {
  const [copiedField, setCopiedField] = useState(null);

  const { data: stripeConfig, isLoading: isStripeConfigLoading } = useQuery({
    queryKey: ["stripe-client-config", staticStoreId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.NEXT_PUBLIC_API_URL}/payments/stripe/public/client/${staticStoreId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Stripe config");
      }
      return response.json();
    },
  });

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isStripeEnabled =
    !isStripeConfigLoading &&
    stripeConfig?.data?.charges_enabled &&
    stripeConfig?.data?.payouts_enabled;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="text-muted-foreground h-5 w-5" />
          <CardTitle>Payment Method</CardTitle>
        </div>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          {/* Cash on Delivery */}
          <div className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-4 transition-colors">
            <RadioGroupItem value="COD" id="cod" />
            <Label htmlFor="cod" className="flex-1 cursor-pointer">
              <div className="font-medium">Cash on Delivery</div>
              <div className="text-muted-foreground text-sm">
                Pay when you receive your order
              </div>
            </Label>
          </div>

          {/* Online Payment */}
          {isStripeEnabled && (
            <div className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-4 transition-colors">
              <RadioGroupItem value="Online" id="online" />
              <Label htmlFor="online" className="flex-1 cursor-pointer">
                <div className="font-medium">Online Payment</div>
                <div className="text-muted-foreground text-sm">
                  Pay securely online with card or UPI
                </div>
              </Label>
            </div>
          )}

          {/* Bank Transfer */}
          {bankDetails?.isActive && (
            <div className="space-y-3">
              <div className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-4 transition-colors">
                <RadioGroupItem value="Bank" id="bank" />
                <Label htmlFor="bank" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Building2 className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Transfer directly to our bank account
                  </div>
                </Label>
              </div>

              {/* Bank Details - Show when Bank Transfer is selected */}
              {paymentMethod === "Bank" && (
                <Alert className="border-info/20 bg-info/10">
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">
                        Transfer funds to the following account:
                      </p>

                      <div className="bg-background space-y-2 rounded-md p-3 text-sm">
                        {/* Bank Name */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-muted-foreground font-medium">
                              Bank Name:
                            </span>
                            <p className="text-foreground">
                              {bankDetails.bankName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(bankDetails.bankName, "Bank Name")
                            }
                            className="h-8"
                          >
                            {copiedField === "Bank Name" ? (
                              <CheckCircle2 className="text-success h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Account Name */}
                        <div className="flex items-center justify-between border-t pt-2">
                          <div>
                            <span className="text-muted-foreground font-medium">
                              Account Name:
                            </span>
                            <p className="text-foreground">
                              {bankDetails.accountName}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                bankDetails.accountName,
                                "Account Name",
                              )
                            }
                            className="h-8"
                          >
                            {copiedField === "Account Name" ? (
                              <CheckCircle2 className="text-success h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Account Number */}
                        <div className="flex items-center justify-between border-t pt-2">
                          <div>
                            <span className="text-muted-foreground font-medium">
                              Account Number:
                            </span>
                            <p className="text-foreground font-mono">
                              {bankDetails.accountNumber}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                bankDetails.accountNumber,
                                "Account Number",
                              )
                            }
                            className="h-8"
                          >
                            {copiedField === "Account Number" ? (
                              <CheckCircle2 className="text-success h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Routing Number */}
                        {bankDetails.routingNumber && (
                          <div className="flex items-center justify-between border-t pt-2">
                            <div>
                              <span className="text-muted-foreground font-medium">
                                Routing Number:
                              </span>
                              <p className="text-foreground font-mono">
                                {bankDetails.routingNumber}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  bankDetails.routingNumber,
                                  "Routing Number",
                                )
                              }
                              className="h-8"
                            >
                              {copiedField === "Routing Number" ? (
                                <CheckCircle2 className="text-success h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}

                        {/* SWIFT Code */}
                        {bankDetails.swiftCode && (
                          <div className="flex items-center justify-between border-t pt-2">
                            <div>
                              <span className="text-muted-foreground font-medium">
                                SWIFT Code:
                              </span>
                              <p className="text-foreground font-mono">
                                {bankDetails.swiftCode}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  bankDetails.swiftCode,
                                  "SWIFT Code",
                                )
                              }
                              className="h-8"
                            >
                              {copiedField === "SWIFT Code" ? (
                                <CheckCircle2 className="text-success h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground text-xs">
                        💡 <strong>Note:</strong> Please use your order number
                        as the payment reference. Your order will be processed
                        once we confirm receipt of payment.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
