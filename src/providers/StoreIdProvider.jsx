"use client";
import { useEffect, useState } from "react";
import { StoreIdContext } from "@/context/StoreIdContext";
import useGetQuery from "@/hooks/api/useGetQuery";

export default function StoreIdProvider({ children }) {
  const [domain, setDomain] = useState("");
  const [storeId, setStoreId] = useState("69898f57b104b007445a579f"); // TODO: remove the storeId before build
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    const cleanDomain = hostname.replace(/^www\./, "");

    setDomain(cleanDomain);
    // setDomain("talkenglish24.com");

    // Check localStorage for cached storeId and domain
    const cachedStoreId = localStorage.getItem("storeId");
    const cachedDomain = localStorage.getItem("storeDomain");

    // Only use cache if domain matches
    if (cachedStoreId && cachedDomain === cleanDomain) {
      setStoreId(cachedStoreId);
    } else {
      // Clear old cache if domain changed
      localStorage.removeItem("storeId");
      localStorage.removeItem("storeDomain");
    }

    setIsInitializing(false);
  }, []);

  const {
    data: storeIdData,
    isLoading,
    isError,
    error,
  } = useGetQuery({
    endpoint: `/publish/domainInfo/${domain}`,
    queryKey: ["storeId", domain],
    enabled: !!domain && !storeId,
  });

  useEffect(() => {
    if (storeIdData?.storeId) {
      setStoreId(storeIdData.storeId);
      localStorage.setItem("storeId", storeIdData.storeId);
      localStorage.setItem("storeDomain", domain);
    }
  }, [storeIdData, domain]);

  const value = {
    storeId,
    domain,
    isLoading: isInitializing || isLoading,
    error: isError
      ? error?.message || "Failed to fetch store information"
      : null,
  };

  return (
    <StoreIdContext.Provider value={value}>{children}</StoreIdContext.Provider>
  );
}
