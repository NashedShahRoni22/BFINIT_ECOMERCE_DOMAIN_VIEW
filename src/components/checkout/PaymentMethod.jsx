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

export default function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
  bankDetails, // Pass bank details from parent
}) {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-neutral-600" />
          <CardTitle>Payment Method</CardTitle>
        </div>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          {/* Cash on Delivery */}
          <div className="flex items-center space-x-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50">
            <RadioGroupItem value="COD" id="cod" />
            <Label htmlFor="cod" className="flex-1 cursor-pointer">
              <div className="font-medium">Cash on Delivery</div>
              <div className="text-sm text-neutral-500">
                Pay when you receive your order
              </div>
            </Label>
          </div>

          {/* Online Payment */}
          <div className="flex items-center space-x-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50">
            <RadioGroupItem value="Online" id="online" />
            <Label htmlFor="online" className="flex-1 cursor-pointer">
              <div className="font-medium">Online Payment</div>
              <div className="text-sm text-neutral-500">
                Pay securely online with card or UPI
              </div>
            </Label>
          </div>

          {/* Bank Transfer */}
          {bankDetails?.isActive && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50">
                <RadioGroupItem value="Bank" id="bank" />
                <Label htmlFor="bank" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-neutral-600" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <div className="text-sm text-neutral-500">
                    Transfer directly to our bank account
                  </div>
                </Label>
              </div>

              {/* Bank Details - Show when Bank Transfer is selected */}
              {paymentMethod === "Bank" && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-neutral-900">
                        Transfer funds to the following account:
                      </p>

                      <div className="space-y-2 rounded-md bg-white p-3 text-sm">
                        {/* Bank Name */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-neutral-600">
                              Bank Name:
                            </span>
                            <p className="text-neutral-900">
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
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Account Name */}
                        <div className="flex items-center justify-between border-t pt-2">
                          <div>
                            <span className="font-medium text-neutral-600">
                              Account Name:
                            </span>
                            <p className="text-neutral-900">
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
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Account Number */}
                        <div className="flex items-center justify-between border-t pt-2">
                          <div>
                            <span className="font-medium text-neutral-600">
                              Account Number:
                            </span>
                            <p className="font-mono text-neutral-900">
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
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        {/* Routing Number */}
                        {bankDetails.routingNumber && (
                          <div className="flex items-center justify-between border-t pt-2">
                            <div>
                              <span className="font-medium text-neutral-600">
                                Routing Number:
                              </span>
                              <p className="font-mono text-neutral-900">
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
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
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
                              <span className="font-medium text-neutral-600">
                                SWIFT Code:
                              </span>
                              <p className="font-mono text-neutral-900">
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
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-neutral-600">
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
