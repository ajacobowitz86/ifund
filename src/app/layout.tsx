import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const brandSerif = Playfair_Display({
  variable: "--font-brand-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const brandSans = Inter({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "IFUND EQUITY | Mortgage Pricing Engine",
    template: "%s | IFUND EQUITY",
  },
  description:
    "Price conventional, FHA, refinance, and HELOC loans in seconds with instant, no-obligation quotes.",
  icons: {
    icon: "/ifund-mark.png",
    apple: "/ifund-mark.png",
  },
  openGraph: {
    title: "IFUND EQUITY | Mortgage Pricing Engine",
    description:
      "Instant pricing for conventional, FHA, rate-and-term refinance, cash-out refinance, and HELOC.",
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
      className={`${brandSerif.variable} ${brandSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-brand-navy antialiased">
        {children}
      </body>
    </html>
  );
}
