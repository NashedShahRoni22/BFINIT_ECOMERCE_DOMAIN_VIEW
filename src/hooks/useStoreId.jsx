import { useContext } from "react";
import { StoreIdContext } from "@/context/StoreIdContext";

export default function useStoreId() {
  return useContext(StoreIdContext);
}
