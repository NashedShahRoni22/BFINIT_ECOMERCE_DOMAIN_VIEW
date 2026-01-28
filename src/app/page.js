"use client";

import SectionRenderer from "@/components/core/SectionRenderer";
import StorefrontLoader from "@/components/loader/StorefrontLoader";
import useGetQuery from "@/hooks/api/useGetQuery";
import useStoreId from "@/hooks/useStoreId";

export default function Home() {
  const { storeId } = useStoreId();

  const { data, isLoading, error } = useGetQuery({
    endpoint: `/store/theme/data/${storeId}`,
    queryKey: ["theme-data", storeId],
    enabled: !!storeId,
  });

  if (isLoading) {
    return <StorefrontLoader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Error loading theme data</p>
      </div>
    );
  }

  const sections = data?.data?.sections?.body;

  return (
    <div>
      <SectionRenderer sections={sections} />
    </div>
  );
}
