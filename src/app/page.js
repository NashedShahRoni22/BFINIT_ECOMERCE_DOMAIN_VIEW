import SectionRenderer from "@/components/core/SectionRenderer";

export default async function Home() {
  const data = await fetch(
    "https://ecomback.bfinit.com/store/theme/data/695e08b54bf6001a986a4bde",
  );

  const sections = await data.json();

  return (
    <div>
      <SectionRenderer sections={sections?.data?.sections?.body} />
    </div>
  );
}
