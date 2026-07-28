import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const brandSerif = Cormorant_Garamond({
  variable: "--font-brand-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const brandSans = IBM_Plex_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const brandMono = IBM_Plex_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "IFUND EQUITY | Live Mortgage Pricing",
    template: "%s | IFUND EQUITY",
  },
  description:
    "IFUND EQUITY client portal with live market rates and personalized loan pricing for purchase, refinance, and cash-out.",
  icons: {
    icon: "/ifund-mark.png",
    apple: "/ifund-mark.png",
  },
  openGraph: {
    title: "IFUND EQUITY | Live Mortgage Pricing",
    description:
      "Track live market benchmarks and run personalized US loan pricing scenarios.",
    siteName: "IFUND EQUITY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${brandSerif.variable} ${brandSans.variable} ${brandMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-brand-navy antialiased">
        {children}
      </body>
    </html>
  );
}
