import SectionRenderer from "@/components/core/SectionRenderer";

export default async function Home() {
  const data = await fetch(
    "https://ecomback.bfinit.com/store/theme/data/695a0774722618f178d3d14c",
  );

  const sections = await data.json();

  return (
    <div>
      <SectionRenderer sections={sections?.data?.sections?.body} />
    </div>
  );
}
