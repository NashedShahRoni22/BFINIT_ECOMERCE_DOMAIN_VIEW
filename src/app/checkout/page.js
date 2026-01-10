"use client";
import { useState, useEffect } from "react";
import useCart from "@/hooks/useCart";
import toast from "react-hot-toast";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { staticStoreId } from "@/utils/storeId";

export default function CheckoutPage({ storeId }) {
  const router = useRouter();
  const { customer } = useAuth();

  const { cartItems, subtotal, clearCart } = useCart();

  const [countries, setCountries] = useState([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currencyCode, setCurrencyCode] = useState("EUR");
  const [countryData, setCountryData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isStripePending, setIsStripePending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryPhoneCode: "+91",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsCountriesLoading(true);
        const response = await fetch(
          "https://ecomback.bfinit.com/api/countries",
        );
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries");
      } finally {
        setIsCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch country data when selected country changes
  useEffect(() => {
    if (!selectedCountry) return;

    const fetchCountryData = async () => {
      try {
        const response = await fetch(
          `https://ecomback.bfinit.com/api/countries/${selectedCountry}`,
        );
        if (!response.ok) throw new Error("Failed to fetch country data");
        const data = await response.json();
        setCountryData(data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountryData();
  }, [selectedCountry]);

  // Update phone code and currency when country data is loaded
  useEffect(() => {
    if (countryData) {
      setFormData((prev) => ({
        ...prev,
        countryPhoneCode: countryData.phone_code || "+91",
      }));
      setCurrencyCode(countryData.currency_code || "EUR");
    }
  }, [countryData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    let requestBody;

    if (paymentMethod === "COD") {
      setIsPending(true);
      requestBody = {
        products: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          hasVariants: item.hasVariants,
          variant: item.variant,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountPrice: item.discountPrice,
          taxAmount: 0,
          lineTotal: parseFloat(
            (item.discountPrice * item.quantity).toFixed(2),
          ),
        })),
        pricingSummary: {
          subTotal: parseFloat(subtotal.toFixed(2)),
          shippingCharges: 0,
          taxTotal: 0,
          discountTotal: 0,
          grandTotal: parseFloat(subtotal.toFixed(2)),
        },
        currencyCode: currencyCode,
        payment: {
          method: "COD",
        },
        shippingDetails: formData,
      };

      try {
        const response = await fetch(
          `https://ecomback.bfinit.com/v2/store/global/orders/create/cod`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${customer?.token}`,
              customerid: customer?.data?.customerId,
              storeid: staticStoreId,
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) throw new Error("Failed to create COD order");

        toast.success("Order created successfully");
        clearCart();
        router.push("/shop");
      } catch (error) {
        console.error("COD order error:", error);
        toast.error("Failed to create order");
      } finally {
        setIsPending(false);
      }
    } else {
      setIsStripePending(true);
      requestBody = {
        products: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.hasVariants
            ? `${item.productName} - ${item.variant.value.name}`
            : item.productName,
          quantity: item.quantity,
          price: item.discountPrice,
        })),
        currency_code: currencyCode,
        totalAmount: parseFloat(subtotal.toFixed(2)),
        paymentMethod: "Online",
        shippingDetails: formData,
      };

      try {
        const response = await fetch(
          `https://ecomback.bfinit.com/v2/store/global/orders/create/online`,
          {
            method: "POST",
            headers: {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${customer?.token}`,
                customerid: customer?.data?.customerId,
                storeid: staticStoreId,
              },
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) throw new Error("Failed to create online order");

        const data = await response.json();
        toast.success("Order created successfully");
        console.log(data);
        clearCart();
        router.push("/shop");
      } catch (error) {
        console.error("Stripe order error:", error);
        toast.error("Failed to create order");
      } finally {
        setIsStripePending(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
          <p className="mt-2 text-neutral-600">Complete your order</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <CheckoutForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            countries={countries}
            isCountriesLoading={isCountriesLoading}
            countryData={countryData}
            onCountryChange={handleCountryChange}
          />

          <OrderSummary
            subtotal={subtotal}
            isProcessing={isPending || isStripePending}
            handlePlaceOrder={handlePlaceOrder}
            cartItems={cartItems}
          />
        </div>
      </div>
    </div>
  );
}
