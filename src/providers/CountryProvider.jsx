"use client";
import { CountryContext } from "@/context/CountryContext";
import useStoreId from "@/hooks/useStoreId";
import { useEffect, useState } from "react";

export default function CountryProvider({ children }) {
  const { storeId } = useStoreId();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    const savedCountry = localStorage.getItem(`store_${storeId}_country`);

    if (savedCountry) {
      try {
        setSelectedCountry(JSON.parse(savedCountry));
      } catch (error) {
        console.error("Failed to parse saved country:", error);
      }
    }

    setIsLoading(false);
  }, [storeId]);

  const saveCountry = (country) => {
    setSelectedCountry(country);
    localStorage.setItem(`store_${storeId}_country`, JSON.stringify(country));
  };

  const clearCountry = () => {
    setSelectedCountry(null);
    localStorage.removeItem(`store_${storeId}_country`);
  };

  const value = {
    selectedCountry,
    saveCountry,
    clearCountry,
    isLoading,
  };

  return (
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
}
