"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import ConnectWallet from "./ConnectWallet";
import { Button } from "./ui/button";

export default function ConnectWalletOrViewPortfolio() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <Button asChild>
          <Link href={`/${address}`}>View your portfolio</Link>
        </Button>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
}
