import { Geist } from "next/font/google";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
import CartProvider from "@/providers/CartProvider";
import SectionRenderer from "@/components/core/SectionRenderer";
import { staticStoreId } from "@/utils/storeId";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export async function generateMetadata() {
  const data = await fetch(
    `https://ecomback.bfinit.com/meta/store/?storeId=${staticStoreId}`,
    { cache: "no-store" },
  );

  const sections = await data.json();
  const metaInfo = sections?.data?.[0];

  return {
    title: metaInfo?.Title || "BFINIT - Start Your Online Store Today",
    description:
      metaInfo?.Description ||
      "Build, customize, and grow your online store with BFINIT. Powerful ecommerce platform with beautiful themes, easy management tools, and everything you need to sell online.",
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
