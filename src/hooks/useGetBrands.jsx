import { useQuery } from "@tanstack/react-query";
import { staticStoreId } from "@/utils/storeId";

const fetchBrands = async () => {
  const res = await fetch(
    `https://ecomback.bfinit.com/brand?storeId=${staticStoreId}`,
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function useGetBrands() {
  return useQuery({
    queryFn: () => fetchBrands(),
    queryKey: ["brands", staticStoreId],
    enabled: !!staticStoreId,
  });
}
