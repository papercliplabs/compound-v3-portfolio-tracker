import {
  Market,
  getMarketsForAccountCached,
} from "@/data/queries/getMarketsForAccount";
import Token from "../Token";
import { getNetworkConfig } from "@/utils/configs";
import Link from "next/link";
import React from "react";
import { Stack } from "@phosphor-icons/react/dist/ssr";
import { twMerge } from "tailwind-merge";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { NavProps } from ".";
import { Address } from "viem";
import { Separator } from "../ui/separator";
import { formatNumber } from "@/utils/format";
import clsx from "clsx";

export async function NavBody({
  accountAddress,
  selectedPositionParams,
}: NavProps) {
  const markets = await getMarketsForAccountCached({ accountAddress });

  const positionHistoricalDataPromises = markets.map((market) =>
    getPositionHistoricalDataCached({
      network: market.network,
      marketAddress: market.address,
      accountAddress,
      granularity: "daily",
    }),
  );

  const positionHistoricalDataResponse = await Promise.all(
    positionHistoricalDataPromises,
  );

  const lendPositionProps: NavPositionLinkProps[] = [];
  const borrowPositionProps: NavPositionLinkProps[] = [];

  let totalBalanceUsd = 0;
  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    const data = positionHistoricalDataResponse[i];
    const lastEntry = data?.[data.length - 1];
    if (!lastEntry) {
      console.error("No position data!", market);
      continue;
    }

    const lastWeekEntries = data.slice(-7);
    const avgNetApr =
      lastWeekEntries.reduce((prevSum, entry) => prevSum + entry.apr.net, 0) /
      lastWeekEntries.length;

    const navPositionLinkProps: NavPositionLinkProps = {
      accountAddress,
      market,
      active: market.address == selectedPositionParams?.marketAddress,
      balanceUsd: lastEntry.balanceUsd,
      utilization: lastEntry.utilization,
      apr: avgNetApr,
    };

    if (navPositionLinkProps.balanceUsd > 0) {
      lendPositionProps.push(navPositionLinkProps);
    } else {
      borrowPositionProps.push(navPositionLinkProps);
    }

    totalBalanceUsd += navPositionLinkProps.balanceUsd;
  }

  return (
    <>
      <NavItem
        href={`/${accountAddress}`}
        active={!selectedPositionParams}
        className="justify-between"
      >
        <div className="flex flex-row gap-4">
          <Stack size={16} className="stroke-content-primary" weight="bold" />
          All Positions
        </div>
        ${formatNumber(totalBalanceUsd)}
      </NavItem>
      {borrowPositionProps.length > 0 && (
        <>
          <div className="flex w-full flex-row items-center gap-1">
            <span className="caption-md text-content-secondary text-nowrap">
              BORROWING ({borrowPositionProps.length})
            </span>
            <Separator className="shrink" />
          </div>
          {borrowPositionProps.map((props, i) => (
            <NavPositionLink {...props} key={i} />
          ))}
        </>
      )}
      {lendPositionProps.length > 0 && (
        <>
          <div className="flex w-full flex-row items-center gap-1">
            <span className="caption-md text-content-secondary text-nowrap">
              LENDING ({lendPositionProps.length})
            </span>
            <Separator className="shrink" />
          </div>
          {lendPositionProps.map((props, i) => (
            <NavPositionLink {...props} key={i} />
          ))}{" "}
        </>
      )}
    </>
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

interface NavPositionLinkProps {
  accountAddress: Address;
  market: Market;
  active: boolean;

  balanceUsd: number;
  utilization: number;
  apr: number;
}

function NavPositionLink({
  accountAddress,
  market,
  active,
  balanceUsd,
  utilization,
  apr,
}: NavPositionLinkProps) {
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
      <div className="flex w-full flex-row justify-between">
        <div
          className={clsx(
            "flex flex-col",
            balanceUsd < 0 ? "justify-between" : "justify-center",
          )}
        >
          <span>
            {market.baseTokenSymbol} •{" "}
            {getNetworkConfig(market.network).chain.name}
          </span>
          {balanceUsd < 0 && (
            <span className="caption-md text-content-secondary">
              {formatNumber(utilization * 100)}% utilized
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span>${formatNumber(Math.abs(balanceUsd))}</span>
          <span className="caption-md text-content-secondary">
            {formatNumber(apr * 100)}% APR (7D)
          </span>
        </div>
      </div>
    </NavItem>
  );
}
