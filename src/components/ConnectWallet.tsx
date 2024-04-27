"use client";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { useConfig } from "wagmi";
import { useRouter } from "next/navigation";
import { watchAccount } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { getAddress } from "viem";
import AccountAvatar from "./AccountAvatar";

export default function ConnectWallet() {
  const router = useRouter();
  const config = useConfig();
  const pathname = usePathname();

  // Redirect to correct page when the account changes
  watchAccount(config, {
    onChange(data) {
      if (data.address) {
        const pathnamePieces = pathname.split("/");
        router.push(
          `/${data.address}` +
            (pathnamePieces.length == 3
              ? `/${pathnamePieces[1]}/${pathnamePieces[2]}`
              : ""),
        );
      } else {
        router.push(`/`);
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
