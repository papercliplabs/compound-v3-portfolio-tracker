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
import { Wallet } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";

export default function ConnectWallet({
  responsive,
}: {
  responsive?: boolean;
}) {
  const router = useRouter();
  const config = useConfig();
  const pathname = usePathname();

  useEffect(() => {
    // Only start watching 2s after load to prevent immediate navigation from reconnect
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
    }, 2000);

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
                    <span
                      className={clsx(responsive ? "hidden lg:flex" : "flex")}
                    >
                      Connect Wallet
                    </span>
                    <span
                      className={clsx(responsive ? "flex lg:hidden" : "hidden")}
                    >
                      <Wallet width={20} height={20} className="p-0" />
                    </span>
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
                    className="h-[20px] w-[20px]"
                  />
                  <span
                    className={clsx(responsive ? "hidden lg:flex" : "flex")}
                  >
                    {account.displayName}
                  </span>
                </Button>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
