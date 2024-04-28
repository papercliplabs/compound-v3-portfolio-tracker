"use client";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { useAccount, useConfig } from "wagmi";
import { useRouter } from "next/navigation";
import { watchAccount } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { getAddress } from "viem";
import AccountAvatar from "./AccountAvatar";
import { useEffect } from "react";

export default function ConnectWallet() {
  const router = useRouter();
  const config = useConfig();
  const pathname = usePathname();

  const { address } = useAccount();

  useEffect(() => {
    console.log("USE EEFFFECT", address);
  }, [address]);

  // Redirect to correct page when the account changes
  watchAccount(config, {
    onChange(account, prevAccount) {
      console.log("CHANGE", account, prevAccount);
      if (account.address) {
        const pathnamePieces = pathname.split("/");
        router.push(
          `/${account.address}` +
            (pathnamePieces.length == 3
              ? `/${pathnamePieces[1]}/${pathnamePieces[2]}`
              : ""),
        );
      } else {
        // router.push(`/`);
      }
    },
  });

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal}>Connect Wallet</Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive">
                    Wrong network
                  </Button>
                );
              }

              return (
                <Button
                  onClick={openAccountModal}
                  variant="secondary"
                  className="flex flex-row gap-1"
                >
                  <AccountAvatar
                    address={getAddress(account.address)}
                    size="sm"
                  />
                  {account.displayName}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
