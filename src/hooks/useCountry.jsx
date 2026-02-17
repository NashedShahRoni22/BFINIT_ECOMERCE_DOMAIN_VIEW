import { CountryContext } from "@/context/CountryContext";
import { useContext } from "react";

export default function useCountry() {
  return useContext(CountryContext);
}
