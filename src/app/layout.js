import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
import CartProvider from "@/providers/CartProvider";
import StoreIdProvider from "@/providers/StoreIdProvider";
import LayoutContent from "@/layout/LayoutContent";
import CountryProvider from "@/providers/CountryProvider";
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
  return (
    <html lang="en" className={geist.variable}>
      <body className="font-geist antialiased">
        <TanstackProvider>
          <StoreIdProvider>
            <CountryProvider>
              <AuthProvider>
                <CartProvider>
                  <Toaster />
                  <LayoutContent>{children}</LayoutContent>
                </CartProvider>
              </AuthProvider>
            </CountryProvider>
          </StoreIdProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
