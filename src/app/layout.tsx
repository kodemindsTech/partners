import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Retner Partner Portal — Growth Agency & Affiliate Program",
  description: "Mobile-first portal for agencies, freelancers, and growth consultants to refer D2C brands to Retner, track leads, earn up to 20% lifetime commission, and request fast payouts.",
  applicationName: "Retner Partner Portal",
  appleWebApp: {
    capable: true,
    title: "Retner Partners",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Retner Partner Portal",
    description: "Earn up to 20% lifetime recurring commission referring D2C brands on Shopify to Retner AI.",
    url: "https://partners.retner.ai",
    siteName: "Retner Partners",
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1F251D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F5F5F7] dark:bg-black text-[#1D1D1F] dark:text-[#F5F5F7]">
        {children}
      </body>
    </html>
  );
}
