"use client";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { useConfig } from "wagmi";
import { useRouter } from "next/navigation";
import { watchAccount } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { getAddress } from "viem";
import AccountAvatar from "./AccountAvatar";
import { useEffect } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import { Wallet } from "@phosphor-icons/react/dist/ssr";

export default function ConnectWallet({
  responsive,
}: {
  responsive?: boolean;
}) {
  const router = useRouter();
  const config = useConfig();
  const pathname = usePathname();
  const screenSize = useScreenSize();

  useEffect(() => {
    // Only start watching 1s after load to prevent immediate navigation from reconnect
    const timeout = setTimeout(() => {
      // Redirect to correct page when the account changes
      watchAccount(config, {
        onChange(account, prevAccount) {
          if (account.address) {
            const pathnamePieces = pathname.split("/");
            router.push(
              `/${account.address}` +
                (pathnamePieces.length == 3
                  ? `/${pathnamePieces[1]}/${pathnamePieces[2]}`
                  : ""),
            );
          }
        },
      });
    }, 1000);

    return () => clearTimeout(timeout);
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
                  <Button onClick={openConnectModal}>
                    {screenSize == "lg" || !responsive ? (
                      "Connect Wallet"
                    ) : (
                      <Wallet width={20} height={20} className="p-0" />
                    )}
                  </Button>
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
                  {(screenSize == "lg" || !responsive) && account.displayName}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
