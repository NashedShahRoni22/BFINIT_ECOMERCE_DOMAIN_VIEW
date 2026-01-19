import { useQuery } from "@tanstack/react-query";
import { staticStoreId } from "@/utils/storeId";

const fetchCategories = async () => {
  const res = await fetch(
    `https://ecomback.bfinit.com/category?storeId=${staticStoreId}`,
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function useGetCategories() {
  return useQuery({
    queryFn: () => fetchCategories(),
    queryKey: ["categories", staticStoreId],
    enabled: !!staticStoreId,
  });
}
