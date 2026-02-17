"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useMemo } from "react";
import { Globe } from "lucide-react";
import useCountry from "@/hooks/useCountry";
import useStoreId from "@/hooks/useStoreId";
import useGetStorePreference from "@/hooks/useGetStorePreference";

export default function CountrySelectModal() {
  const { storeId } = useStoreId();
  const [isOpen, setIsOpen] = useState(true);

  const { selectedCountry, saveCountry } = useCountry();

  const { data: storePreference, isLoading } = useGetStorePreference(storeId);

  const countries = useMemo(
    () => storePreference?.countries || [],
    [storePreference?.countries],
  );

  useEffect(() => {
    // Check if user has already selected a country
    const savedCountry = localStorage.getItem(`store_${storeId}_country`);

    if (savedCountry) {
      setIsOpen(false);
      saveCountry(JSON.parse(savedCountry));
      return;
    }

    // If only one country, auto-select and don't show modal
    if (countries.length === 1) {
      setIsOpen(false);
      const country = countries[0];
      saveCountry(country);
      localStorage.setItem(`store_${storeId}_country`, JSON.stringify(country));
      return;
    }

    // If multiple countries and no selection, show modal
    if (countries.length > 1) {
      setIsOpen(true);
    }
  }, [countries, storeId]);

  const handleCountrySelect = (country) => {
    saveCountry(country);
    localStorage.setItem(`store_${storeId}_country`, JSON.stringify(country));
    handleOpenChange();
  };

  const handleOpenChange = (open) => {
    if (!open && selectedCountry) {
      setIsOpen(false);
    }
  };

  if (isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-screen max-h-screen w-screen max-w-full! items-center justify-center rounded-none border-0 p-0 shadow-none [&>button]:hidden">
        <div className="bg-background flex h-full w-full flex-col items-center justify-center px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="border-border bg-background flex h-16 w-16 items-center justify-center rounded-full border">
                <Globe className="text-foreground h-8 w-8" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-semibold tracking-tight">
              Select Your Region
            </h2>
            <p className="text-muted-foreground text-sm">
              Choose your country to see prices in your local currency
            </p>
          </div>

          {/* Country List */}
          <div className="w-full max-w-md space-y-0">
            {countries.map((country, index) => (
              <div key={country._id}>
                <Button
                  variant="ghost"
                  onClick={() => handleCountrySelect(country)}
                  className="group hover:bg-muted h-auto w-full justify-between px-6 py-4"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium">
                      {country.country_name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {country.currency_name} ({country.currency_symbol})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium">
                      {country.currency_code}
                    </span>
                  </div>
                </Button>
                {index < countries.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <p className="text-muted-foreground mt-8 text-center text-xs">
            You can change this later in your account settings
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
