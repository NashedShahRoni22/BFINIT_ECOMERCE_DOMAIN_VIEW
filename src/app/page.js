import SectionRenderer from "@/components/core/SectionRenderer";
import { getHost } from "@/utils/get-url";
import { staticStoreId } from "@/utils/storeId";

export default async function Home() {
  const host = await getHost();
  const data = await fetch(
    `https://ecomback.bfinit.com/store/theme/data/${staticStoreId}`,
  );

  const sections = await data.json();

  return (
    <div>
      <SectionRenderer sections={sections?.data?.sections?.body} />
      <p>current host: {host}</p>
    </div>
  );
}
