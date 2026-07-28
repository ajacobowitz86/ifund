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
  title: "IFUND EQUITY",
  description:
    "Institutional growth and real estate. Access automated evaluation pipelines and portfolio management tools.",
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
      <body className="min-h-full font-sans text-brand-navy">{children}</body>
    </html>
  );
}
