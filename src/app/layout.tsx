import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WalletProvider from "@/providers/WalletProvider";
import { Analytics } from "@vercel/analytics/react";
import "@/theme/globals.css";
import Token from "@/components/Token";
import LearnMore from "@/components/LearnMore";
import ConnectWallet from "@/components/ConnectWallet";

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
    <header className="shadow-1 flex h-16 w-full flex-row items-center justify-between bg-white px-10  py-2">
      LOGO
      <div className="flex h-full flex-row items-center gap-2">
        <LearnMore />
        <ConnectWallet />
      </div>
    </header>
  );
}

function Footer() {
  return <footer className="w-full bg-blue-500 px-12 py-6">FOOTER</footer>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <WalletProvider>
          <div className="flex min-h-screen w-full flex-col overflow-hidden">
            <Header />
            <main className="bg-background-surface grow">{children}</main>
            <Footer />
          </div>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
