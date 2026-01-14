import { EmptyContent } from "./EmptyContent";
import Hero from "./Hero";
import { staticStoreId } from "@/utils/storeId";

async function getContent(apiEndpoint, storeId) {
  try {
    const response = await fetch(
      `https://ecomback.bfinit.com${apiEndpoint}/${staticStoreId}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}

export default async function ContentPage({ title, apiEndpoint, storeId }) {
  const data = await getContent(apiEndpoint, storeId);

  if (!data?.data) {
    return <EmptyContent title={title} />;
  }

  const content =
    data?.data?.aboutDescription || data?.data?.faqDescription || data?.data;

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
