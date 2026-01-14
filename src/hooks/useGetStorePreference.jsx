import { useQuery } from "@tanstack/react-query";
import { staticStoreId } from "@/utils/storeId";

const fetchStorePreference = async () => {
  const res = await fetch(
    `https://ecomback.bfinit.com/store/preference/?storeId=${staticStoreId}`,
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function useGetStorePreference() {
  return useQuery({
    queryFn: () => fetchStorePreference(),
    queryKey: ["storePreference", staticStoreId],
  });
}
