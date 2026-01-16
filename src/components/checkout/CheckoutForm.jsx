import ShippingInfo from "./ShippingInfo";
import PaymentMethod from "./PaymentMethod";

export default function CheckoutForm({
  formData,
  errors,
  handleInputChange,
  paymentMethod,
  setPaymentMethod,
  countries,
  isCountriesLoading,
  onCountryChange,
  bankDetails,
}) {
  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Shipping Information */}
      <ShippingInfo
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
        onCountryChange={onCountryChange}
        isCountriesLoading={isCountriesLoading}
        countries={countries}
      />

      {/* Payment Method */}
      <PaymentMethod
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        bankDetails={bankDetails}
      />
    </div>
  );
}
