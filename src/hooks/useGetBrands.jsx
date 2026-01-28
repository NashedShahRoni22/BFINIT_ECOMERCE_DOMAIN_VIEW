import { useQuery } from "@tanstack/react-query";
import useStoreId from "./useStoreId";

const fetchBrands = async (storeId) => {
  const res = await fetch(
    `https://ecomback.bfinit.com/brand?storeId=${storeId}`,
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function useGetBrands() {
  const { storeId } = useStoreId();

  return useQuery({
    queryFn: () => fetchBrands(storeId),
    queryKey: ["brands", storeId],
    enabled: !!storeId,
  });
}
