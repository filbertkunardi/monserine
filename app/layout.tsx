import type { Metadata } from "next";
import { Poppins, Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getCartId } from "@/lib/cart";
import { getCart } from "@/lib/shopify/queries";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const bebas = localFont({
  src: "./fonts/BebasRegular.ttf",
  variable: "--font-bebas",
  display: "swap",
});

const astonScript = localFont({
  src: "./fonts/AstonScript.ttf",
  variable: "--font-aston",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MONSERINE",
  description: "MONSERINE clothing",
};

async function getCartCount(): Promise<number> {
  try {
    const cartId = await getCartId();
    if (!cartId) return 0;
    const cart = await getCart(cartId);
    return cart?.totalQuantity ?? 0;
  } catch {
    return 0;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cartCount = await getCartCount();

  return (
    <html lang="en" className={`${poppins.variable} ${barlowCondensed.variable} ${bebas.variable} ${astonScript.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream font-sans text-dark antialiased">
        <SiteHeader cartCount={cartCount} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
