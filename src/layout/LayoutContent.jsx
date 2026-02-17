"use client";
import { useEffect, useState } from "react";
import SectionRenderer from "@/components/core/SectionRenderer";
import useStoreId from "@/hooks/useStoreId";
import useGetQuery from "@/hooks/api/useGetQuery";
import StorefrontLoader from "@/components/loader/StorefrontLoader";
import DomainErrorScreen from "@/components/errors/DomainErrorScreen";
import ThemeErrorScreen from "@/components/errors/ThemeErrorScreen";
import CountrySelectModal from "@/components/modals/CountrySelectModal";

export default function LayoutContent({ children }) {
  const {
    storeId,
    domain,
    isLoading: storeIdLoading,
    error: storeIdError,
  } = useStoreId();
  const [sections, setSections] = useState(null);

  const {
    data,
    isLoading: isSectionsLoading,
    isError: isSectionsError,
    error: sectionsError,
  } = useGetQuery({
    endpoint: `/store/theme/data/${storeId}`,
    queryKey: ["storeFront", "stores", storeId, "theme", "data"],
    enabled: !!storeId,
  });

  useEffect(() => {
    if (storeId && data) {
      setSections(data?.data?.sections);
    }
  }, [storeId, data]);

  // ALWAYS show loader first if still initializing
  if (storeIdLoading) {
    return <StorefrontLoader />;
  }

  // Domain not recognized error (only after loading complete)
  if (storeIdError || (!storeId && !storeIdLoading)) {
    return <DomainErrorScreen domain={domain} error={storeIdError} />;
  }

  // Show loader while fetching sections
  if (isSectionsLoading) {
    return <StorefrontLoader />;
  }

  // Theme/sections loading error
  if (isSectionsError || (storeId && !sections && !isSectionsLoading)) {
    return (
      <ThemeErrorScreen
        storeId={storeId}
        error={sectionsError?.message || "Failed to load store theme"}
      />
    );
  }

  // Final check before rendering
  if (!storeId || !sections) {
    return <StorefrontLoader />;
  }

  return (
    <>
      <CountrySelectModal />
      <SectionRenderer sections={sections?.header} />
      {children}
      <SectionRenderer sections={sections?.footer} />
    </>
  );
}
