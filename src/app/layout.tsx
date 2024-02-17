import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WalletProvider from "@/providers/WalletProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

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
    <header className="flex w-full flex-row items-center justify-between bg-red-500 px-12 py-6">
      HEADER
      <ConnectButton />
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
      <body className={inter.className}>
        <WalletProvider>
          <div className="flex min-h-screen w-full flex-col overflow-hidden">
            <Header />
            <main className="grow bg-pink-400 p-12">{children}</main>
            <Footer />
          </div>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
