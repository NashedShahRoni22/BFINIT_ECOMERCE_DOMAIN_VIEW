import { headers } from "next/headers";

export async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";

  const cleanprotocol = protocol.split(/[;,]/)[0].trim();

  return `${cleanprotocol}://${host}`;
}
