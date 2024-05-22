"use server";
import { DataGranularity } from "@/utils/types";
import { Address } from "viem";
import { getMarketsForAccountCached } from "./getMarketsForAccount";
import { unstable_cache } from "next/cache";
import {
  PositionDataEntry,
  getPositionHistoricalDataCached,
} from "./getPositionHistoricalData";
import { safeDiv } from "@/utils/safeMath";

interface PortfolioDataEntry {
  key: number; // hour / day / week
  timestamp: number; // time since unix epoch

  balanceUsd: number;
  profitAndLossUsd: number;
  avgApr: { base: number; reward: number; net: number };
}

interface GetPortfolioHistoricalDataParams {
  accountAddress: Address;
  granularity: DataGranularity;
}

export async function getPortfolioHistoricalData({
  accountAddress,
  granularity,
}: GetPortfolioHistoricalDataParams): Promise<
  PortfolioDataEntry[] | undefined
> {
  const markets = await getMarketsForAccountCached({ accountAddress });

  const positionHistoricalDataPromises = markets?.map((market) =>
    getPositionHistoricalDataCached({
      network: market.network,
      marketAddress: market.address,
      accountAddress,
      granularity,
    }),
  );

  const positionHistoricalDataResponses = await Promise.all(
    positionHistoricalDataPromises,
  );

  return aggregatePortfolioDataCached(positionHistoricalDataResponses);
}

// Needs to be a promise for unstable cache
async function aggregatePortfolioData(
  positionHistoricalDataArray: (PositionDataEntry[] | undefined)[],
): Promise<PortfolioDataEntry[]> {
  const maxLength = positionHistoricalDataArray.reduce(
    (prevMax, response) => Math.max(prevMax, response?.length ?? 0),
    0,
  );

  const portfolioHistoricalData: PortfolioDataEntry[] = [];
  for (let i = 0; i < maxLength; i++) {
    let portfolioDataEntry: PortfolioDataEntry = {
      key: 0,
      timestamp: 0,
      balanceUsd: 0,
      profitAndLossUsd: 0,
      avgApr: { base: 0, reward: 0, net: 0 },
    };

    for (let response of positionHistoricalDataArray) {
      const responseEntry = response?.[response.length - 1 - i];

      if (responseEntry) {
        portfolioDataEntry.key = responseEntry.key;
        portfolioDataEntry.timestamp = responseEntry.timestamp;
        portfolioDataEntry.balanceUsd =
          portfolioDataEntry.balanceUsd + responseEntry.balanceUsd;
        portfolioDataEntry.profitAndLossUsd =
          portfolioDataEntry.profitAndLossUsd + responseEntry.profitAndLossUsd;
        portfolioDataEntry.avgApr = {
          base:
            portfolioDataEntry.avgApr.base +
            responseEntry.apr.base * Math.abs(responseEntry.balanceUsd),
          reward:
            portfolioDataEntry.avgApr.reward +
            responseEntry.apr.reward * Math.abs(responseEntry.balanceUsd),
          net:
            portfolioDataEntry.avgApr.net +
            responseEntry.apr.net * Math.abs(responseEntry.balanceUsd),
        };
      }
    }

    // Divide out to get average for apr
    portfolioDataEntry.avgApr.base = safeDiv(
      portfolioDataEntry.avgApr.base,
      portfolioDataEntry.balanceUsd,
    );
    portfolioDataEntry.avgApr.reward = safeDiv(
      portfolioDataEntry.avgApr.reward,
      portfolioDataEntry.balanceUsd,
    );
    portfolioDataEntry.avgApr.net = safeDiv(
      portfolioDataEntry.avgApr.net,
      portfolioDataEntry.balanceUsd,
    );

    portfolioHistoricalData.push(portfolioDataEntry);
  }

  portfolioHistoricalData.reverse(); // Reverse since we did this backwards

  return portfolioHistoricalData;
}

const aggregatePortfolioDataCached = unstable_cache(aggregatePortfolioData, [
  "aggregate-portfolio-data",
]);
