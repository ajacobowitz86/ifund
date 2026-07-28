import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ifund | Step 1 — Price Your Loan",
  description:
    "Step 1: enter loan details and a US property address to preview broker pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[radial-gradient(ellipse_at_top,_#e8eef6_0%,_#f4f7fb_42%,_#edf2f7_100%)] text-slate-900">
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              ifund
            </span>
            <span className="text-sm font-medium text-slate-500">
              Step 1 of 1 · Loan pricing
            </span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
