"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState, useMemo } from "react";
import useCountry from "@/hooks/useCountry";
import useStoreId from "@/hooks/useStoreId";
import useGetStorePreference from "@/hooks/useGetStorePreference";

export default function CountrySelectModal() {
  const { storeId } = useStoreId();
  const [isOpen, setIsOpen] = useState(true);

  const { selectedCountry, saveCountry } = useCountry();

  const { data: storePreference, isLoading } = useGetStorePreference(storeId);

  const storeName = storePreference?.storeName || "STORE";

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
    setIsOpen(false);
  };

  const handleOpenChange = (open) => {
    if (!open && !selectedCountry) return;
    setIsOpen(false);
  };

  if (isLoading) return null;

  const half = Math.ceil(countries.length / 2);
  const leftCol = countries.slice(0, half);
  const rightCol = countries.slice(half);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="bg-foreground/50 flex h-screen max-h-screen w-screen max-w-full! items-center justify-center rounded-none border-0 p-0 shadow-none backdrop-blur-sm [&>button]:hidden"
      >
        {/* Modal Card */}
        <div className="bg-background relative flex max-h-[90svh] w-[500px] max-w-[92vw] flex-col shadow-2xl">
          {/* Fixed header */}
          <div className="px-8 pt-8 pb-6 sm:px-10 sm:pt-10">
            <div className="mb-7">
              <h1 className="text-foreground text-xl font-light tracking-widest uppercase">
                {storeName}
              </h1>
            </div>
            <div className="border-border mb-6 border-t" />
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Please select your location
            </p>
          </div>

          {/* Scrollable country list */}
          <div className="overflow-y-auto px-8 pb-8 sm:px-10 sm:pb-10">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:gap-x-10">
              {[leftCol, rightCol].map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col">
                  {col.map((country) => (
                    <button
                      key={country._id}
                      onClick={() => handleCountrySelect(country)}
                      className="group border-border hover:bg-muted active:bg-muted/70 flex cursor-pointer items-center justify-between border-b p-3 text-left transition-colors duration-150 last:border-b-0"
                    >
                      <span className="text-muted-foreground group-hover:text-foreground text-xs tracking-widest uppercase transition-colors duration-150">
                        {country.country_name}
                      </span>
                      <span className="text-muted-foreground/0 group-hover:text-muted-foreground ml-2 shrink-0 text-xs transition-colors duration-150">
                        {country.currency_symbol}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
