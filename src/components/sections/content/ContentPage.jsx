"use client";
import useGetQuery from "@/hooks/api/useGetQuery";
import { EmptyContent } from "./EmptyContent";
import Hero from "./Hero";
import useStoreId from "@/hooks/useStoreId";

export default function ContentPage({ title, apiEndpoint }) {
  const { storeId } = useStoreId();

  const { data } = useGetQuery({
    endpoint: `${apiEndpoint}/${storeId}`,
    enabled: !!apiEndpoint && !!storeId,
    queryKey: [apiEndpoint, storeId],
  });

  if (!data?.data) {
    return <EmptyContent title={title} />;
  }

  const content =
    data?.data?.aboutDescription ||
    data?.data?.faqDescription ||
    data?.data?.description ||
    data?.data;

  return (
    <div>
      <Hero title={title} />

      <div
        id="content-display"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <article
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
