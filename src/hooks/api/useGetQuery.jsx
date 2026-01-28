import { useQuery } from "@tanstack/react-query";
import useAuth from "../useAuth";
import { getApi } from "@/lib/api/getApi";

export default function useGetQuery({
  endpoint,
  token = false,
  clientId = false,
  queryKey,
  enabled = true,
}) {
  const auth = useAuth();
  const customer = auth?.customer;

  return useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getApi(
        endpoint,
        token ? customer?.token : null,
        clientId ? customer?.data?.clientid : null,
      );

      return result;
    },
    enabled,
  });
}
