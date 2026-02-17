import CurrencySwitchWarningModal from "@/components/modals/CurrencySwitchWarningModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCart from "@/hooks/useCart";
import useCountry from "@/hooks/useCountry";
import { getDefaultCountry } from "@/utils/currencyHelpers";
import { Globe } from "lucide-react";
import { useMemo, useState } from "react";

export default function FooterCountrySwitcher({ data, handleCountryChange }) {
  const { selectedCountry } = useCountry();
  const { cartItems, clearCart } = useCart();
  const defaultCountry = getDefaultCountry(data);

  const countries = useMemo(() => data?.countries || [], [data?.countries]);

  const [isOpen, setIsOpen] = useState(false);
  const [pendingCountry, setPendingCountry] = useState(null);

  const handleSwitchCurrency = (country) => {
    const currentId = selectedCountry?._id || defaultCountry?._id;
    if (country._id === currentId) return;

    if (cartItems?.length > 0) {
      setPendingCountry(country);
      setIsOpen(true);
      return;
    }

    handleCountryChange(country);
  };

  const handleConfirm = () => {
    handleCountryChange(pendingCountry);
    setPendingCountry(null);
    setIsOpen(false);
    clearCart();
  };

  const handleCancel = () => {
    setPendingCountry(null);
    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors outline-none">
          <Globe className="h-4 w-4" />
          <span className="font-medium">
            {selectedCountry?.country_name || defaultCountry?.country_name}
          </span>
          <span className="text-xs">
            ({selectedCountry?.currency_code || defaultCountry?.currency_code})
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {countries.map((country) => (
            <DropdownMenuItem
              key={country._id}
              onClick={() => handleSwitchCurrency(country)}
              className="flex cursor-pointer items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {country.country_name}
                </span>
                <span className="text-muted-foreground text-xs">
                  {country.currency_name} ({country.currency_symbol})
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <CurrencySwitchWarningModal
        isOpen={isOpen}
        pendingRegion={
          pendingCountry
            ? {
                name: pendingCountry.country_name,
                currency: pendingCountry.currency_code,
                currencyLabel: `${pendingCountry.currency_name} (${pendingCountry.currency_symbol})`,
              }
            : null
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
