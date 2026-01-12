// utils/get-url.js
import { headers } from "next/headers";

export async function getHost() {
  const headersList = await headers();
  return headersList.get("x-forwarded-host") || headersList.get("host");
}