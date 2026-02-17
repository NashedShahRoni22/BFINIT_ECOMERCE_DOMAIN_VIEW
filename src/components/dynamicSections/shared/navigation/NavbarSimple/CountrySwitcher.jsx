import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCountry from "@/hooks/useCountry";
import { getDefaultCountry } from "@/utils/currencyHelpers";
import { useMemo, useState } from "react";
import useCart from "@/hooks/useCart";
import CurrencySwitchWarningModal from "@/components/modals/CurrencySwitchWarningModal";

export default function CountrySwitcher({ handleCountryChange, data }) {
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
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hidden h-9 items-center gap-1.5 px-2.5 text-xs lg:flex"
          >
            <Globe size={14} />
            <span className="font-medium">
              {selectedCountry?.currency_code || defaultCountry?.currency_code}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
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
