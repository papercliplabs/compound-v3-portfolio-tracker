import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WalletProvider from "@/providers/WalletProvider";
import { Analytics } from "@vercel/analytics/react";
import "@/theme/globals.css";
import LearnMore from "@/components/LearnMore";
import ConnectWallet from "@/components/ConnectWallet";
import HeaderHomeButton from "@/components/HeaderHomeButton";
import { SearchWallet } from "@/components/SearchWallet";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Compound v3 User Portfolio Tracker",
  description: "Tracker to help Compound users understand their portfolio.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
  keywords: [
    "ethereum",
    "crypto",
    "defi",
    "compound",
    "lending",
    "paperclip labs",
  ],
};

function Header() {
  return (
    <header className="shadow-1 fixed top-0 z-[2] grid h-16 w-full grid-cols-[minmax(max-content,0.3fr)_1fr_minmax(max-content,0.3fr)] flex-row items-center justify-between gap-4 bg-white px-4 py-2 md:px-10">
      <HeaderHomeButton />
      <SearchWallet />
      <div className="flex  flex-row items-center justify-end gap-2">
        <LearnMore />
        <ConnectWallet responsive />
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} overflow-x-hidden overscroll-none antialiased`}
      >
        <WalletProvider>
          <Header />
          <main className="bg-background-surface mx-auto h-dvh w-screen max-w-[2560px] overflow-y-hidden pt-16">
            {children}
          </main>
          <Analytics />
        </WalletProvider>
      </body>
    </html>
  );
}
