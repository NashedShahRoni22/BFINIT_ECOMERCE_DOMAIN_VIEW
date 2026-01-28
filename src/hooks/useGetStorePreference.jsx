import { useQuery } from "@tanstack/react-query";
import useStoreId from "./useStoreId";

const fetchStorePreference = async (storeId) => {
  const res = await fetch(
    `https://ecomback.bfinit.com/store/preference/?storeId=${storeId}`,
  );
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export default function useGetStorePreference() {
  const { storeId } = useStoreId();

  return useQuery({
    queryFn: () => fetchStorePreference(storeId),
    queryKey: ["storePreference", storeId],
  });
}
