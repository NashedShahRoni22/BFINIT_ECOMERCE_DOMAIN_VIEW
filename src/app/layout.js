import { Geist } from "next/font/google";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
import CartProvider from "@/providers/CartProvider";
import SectionRenderer from "@/components/core/SectionRenderer";
import { staticStoreId } from "@/utils/storeId";
import { storeApi } from "@/lib/api/storeApi";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export async function generateMetadata() {
  const data = await storeApi("/meta/store", {
    next: { revalidate: 3600 },
  });

  const metaInfo = data?.data?.[0];

  return {
    title: metaInfo?.Title || "Online Store",
    description:
      metaInfo?.Description ||
      "Discover quality products with fast shipping and secure checkout. Shop now for the best deals and excellent customer service.",
  };
}

export default async function RootLayout({ children }) {
  const data = await fetch(
    `https://ecomback.bfinit.com/store/theme/data/${staticStoreId}`, //TODO: remove store id
  );

  const sections = await data.json();

  return (
    <html lang="en" className={geist.variable}>
      <body className="font-geist antialiased">
        <TanstackProvider>
          <AuthProvider>
            <CartProvider>
              <SectionRenderer sections={sections?.data?.sections?.header} />
              {children}
              <SectionRenderer sections={sections?.data?.sections?.footer} />
            </CartProvider>
          </AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
