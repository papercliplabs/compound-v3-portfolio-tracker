import {
  Market,
  getMarketsForAccountCached,
} from "@/data/queries/getMarketsForAccount";
import { Address } from "viem";
import Token from "./Token";
import { SupportedNetwork, getNetworkConfig } from "@/utils/configs";
import Link from "next/link";
import { Separator } from "./ui/separator";
import React, { Suspense } from "react";
import { Stack } from "@phosphor-icons/react/dist/ssr";
import { twMerge } from "tailwind-merge";
import AccountAvatar from "./AccountAvatar";
import AccountName from "./AccountName";
import { Skeleton } from "./ui/skeleton";

interface NavProps {
  accountAddress: Address;
  selectedPositionParams?: {
    network: SupportedNetwork;
    marketAddress: Address;
  };
}

export default async function Nav({
  accountAddress,
  selectedPositionParams,
}: NavProps) {
  return (
    <div className=" flex w-[480px] shrink-0 flex-col gap-3 px-6 py-[56px]">
      <div className="flex flex-row items-center gap-4">
        <AccountAvatar address={accountAddress} size="lg" />
        <div className="flex h-full flex-col justify-between">
          <Suspense fallback={<Skeleton className="h-[30px] w-full shrink" />}>
            <h2 className="shrink">
              <AccountName address={accountAddress} />
            </h2>
          </Suspense>
          <div className="body-md text-content-secondary">
            <AccountName address={accountAddress} disableEns />
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <Suspense fallback="LOADING">
        <NavBody
          accountAddress={accountAddress}
          selectedPositionParams={selectedPositionParams}
        />
      </Suspense>
    </div>
  );
}

async function NavBody({ accountAddress, selectedPositionParams }: NavProps) {
  const markets = await getMarketsForAccountCached({ accountAddress });
  return (
    <>
      <NavItem
        href={`/${accountAddress}`}
        active={!selectedPositionParams}
        className="gap-4"
      >
        <Stack size={16} className="stroke-content-primary" weight="bold" />
        All Positions
      </NavItem>
      {markets.map((market, i) => (
        <NavPositionLink
          accountAddress={accountAddress}
          market={market}
          active={market.address == selectedPositionParams?.marketAddress}
          key={i}
        />
      ))}
    </>
  );
}

function NavPositionLink({
  accountAddress,
  market,
  active,
}: {
  accountAddress: Address;
  market: Market;
  active: boolean;
}) {
  return (
    <NavItem
      active={active}
      href={`/${accountAddress}/${market.network}/${market.address}`}
    >
      <Token
        symbol={market.baseTokenSymbol}
        network={market.network}
        size={32}
        showNetworkIcon
      />
      {market.baseTokenSymbol} • {getNetworkConfig(market.network).chain.name}
    </NavItem>
  );
}

const NavItem = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement> & {
    active: boolean;
    href: string;
  }
>(({ active, href, className, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      href={href}
      className={twMerge(
        "flex h-[48px] w-full flex-row items-center gap-[10px] rounded-md px-4 py-2",
        active ? "bg-white" : "hover:bg-white/30",
        className,
      )}
      {...props}
    />
  );
});
NavItem.displayName = "NavItem";
