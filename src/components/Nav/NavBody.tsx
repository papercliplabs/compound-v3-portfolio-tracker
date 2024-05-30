import { getMarketsForAccountCached } from "@/data/queries/getMarketsForAccount";
import React from "react";
import { Stack } from "@phosphor-icons/react/dist/ssr";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { NavProps } from ".";
import { Separator } from "../ui/separator";
import { formatNumber } from "@/utils/format";
import {
  NavItem,
  NavPositionLink,
  NavPositionLinkProps,
} from "./NavPositionLink";
import { AT_RISK_HEALTH_FACTOR_THRESHOLD } from "@/utils/constants";

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
  const closedPositionProps: NavPositionLinkProps[] = [];

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
      active:
        market.address == selectedPositionParams?.marketAddress &&
        market.network == selectedPositionParams?.network,
      balanceUsd: lastEntry.balanceUsd,
      utilization: lastEntry.utilization,
      atRisk:
        lastEntry.balanceUsd < 0 &&
        lastEntry.healthFactor < AT_RISK_HEALTH_FACTOR_THRESHOLD,
      apr: avgNetApr,
    };

    if (navPositionLinkProps.balanceUsd == 0) {
      closedPositionProps.push(navPositionLinkProps);
    } else if (navPositionLinkProps.balanceUsd > 0) {
      lendPositionProps.push(navPositionLinkProps);
    } else {
      borrowPositionProps.push(navPositionLinkProps);
    }

    totalBalanceUsd += navPositionLinkProps.balanceUsd;
  }

  return (
    <div
      className="flex flex-col gap-3 overflow-auto pb-16"
      data-vaul-no-drag=""
    >
      <NavItem
        href={`/${accountAddress}`}
        active={!selectedPositionParams}
        className="justify-between"
      >
        <div className="flex flex-row items-center gap-4">
          <Stack
            size={40}
            className="stroke-content-primary border-border-primary rounded-[9px] border p-2"
            weight="fill"
          />
          All Positions
        </div>
        {formatNumber(totalBalanceUsd, "$")}
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
      {closedPositionProps.length > 0 && (
        <>
          <div className="flex w-full flex-row items-center gap-1">
            <span className="caption-md text-content-secondary text-nowrap">
              CLOSED ({closedPositionProps.length})
            </span>
            <Separator className="shrink" />
          </div>
          {closedPositionProps.map((props, i) => (
            <NavPositionLink {...props} key={i} />
          ))}{" "}
        </>
      )}
    </div>
  );
}
