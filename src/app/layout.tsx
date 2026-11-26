import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { MobileNav } from "@/components/common/mobile-nav";
import { AuthModal } from "@/components/auth/auth-modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KEYRA — Verified Homes. Zero Brokerage. Direct Connect.",
  description:
    "Pune's premier managed real estate rental marketplace. Zero brokerage verified flats, coliving, PGs, and commercial spaces in Baner, Wakad, Hinjewadi, and Balewadi.",
  metadataBase: new URL("https://keyra.in"),
  openGraph: {
    title: "KEYRA — Verified Homes. Zero Brokerage.",
    description: "Rent verified flats in Pune West with direct owner connection and 0% brokerage.",
    url: "https://keyra.in",
    siteName: "KEYRA",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8F9FF] text-slate-900 pb-16 md:pb-0">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileNav />
            <AuthModal />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
