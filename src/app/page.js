import SectionRenderer from "@/components/core/SectionRenderer";
import { staticStoreId } from "@/utils/storeId";

export default async function Home() {
  const data = await fetch(
    `https://ecomback.bfinit.com/store/theme/data/${staticStoreId}`,
  );

  const sections = await data.json();

  return (
    <div>
      <SectionRenderer sections={sections?.data?.sections?.body} />
    </div>
  );
}
