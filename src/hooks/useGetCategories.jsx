import { useQuery } from "@tanstack/react-query";
import useStoreId from "./useStoreId";

const fetchCategories = async (storeId) => {
  const res = await fetch(
    `https://ecomback.bfinit.com/category?storeId=${storeId}`,
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function useGetCategories() {
  const { storeId } = useStoreId();

  return useQuery({
    queryFn: () => fetchCategories(storeId),
    queryKey: ["categories", storeId],
    enabled: !!storeId,
  });
}
