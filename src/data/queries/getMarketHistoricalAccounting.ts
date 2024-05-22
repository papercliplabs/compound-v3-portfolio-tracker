"use server";
import { DataGranularity } from "@/utils/types";
import { graphql } from "../graphql/generated";
import { querySubgraph } from "../dataUtils";
import { SupportedNetwork } from "@/utils/configs";
import { unstable_cache } from "next/cache";
import { DEFAULT_REVALIDATION_TIME_S } from "../graphql/graphQLFetch";
import { bigIntSafeDiv } from "@/utils/bigInt";
import {
  HOURLY_DATA_MAX_NUM_POINTS,
  DAILY_DATA_MAX_NUM_POINTS,
  WEEKLY_DATA_MAX_NUM_POINTS,
} from "../dataConstants";
import { Address, getAddress } from "viem";
import {
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_WEEK,
} from "@/utils/constants";

export interface MarketAccountingEntry {
  key: number; // hour / day / week
  timestamp: number; // time since unix epoch
  baseBorrowIndex: bigint;
  baseSupplyIndex: bigint;
  trackingBorrowIndex: bigint; // For borrow rewards
  trackingSupplyIndex: bigint; // For supply rewards
  baseUsdExchangeRate: bigint; // price scaled with decimals, i.e amount / baseUsdExchangeRate = amountUsd
  rewardTokenUsdPrice: number;
  collateralAssetUsdExchangeRates: {
    assetAddress: Address;
    usdExchangeRate: bigint;
  }[];
  supplyApr: { base: number; reward: number; net: number };
  borrowApr: { base: number; reward: number; net: number };
}

interface GetMarketHistoricalAccountingParams {
  network: SupportedNetwork;
  marketAddress: string;
  granularity: DataGranularity;
}

// Fully interpolated interior points, and extrapolated endpoints - needed for aggregation
async function getMarketHistoricalAccounting({
  network,
  marketAddress,
  granularity,
}: GetMarketHistoricalAccountingParams): Promise<
  MarketAccountingEntry[] | undefined
> {
  let marketData: MarketAccountingEntry[] | undefined;

  let expectedLastKey;
  let expectedLength;

  if (granularity == "hourly") {
    const data = await querySubgraph({
      network,
      query: hourlyQuery,
      variables: {
        marketAddress: marketAddress.toLowerCase(),
        first: HOURLY_DATA_MAX_NUM_POINTS,
      },
    });
    marketData = data.market?.hourlyMarketAccounting.map(
      mapHistoricalEntryToData,
    );

    expectedLastKey = Math.floor(Date.now() / 1000 / SECONDS_PER_HOUR);
    expectedLength = HOURLY_DATA_MAX_NUM_POINTS;
  } else if (granularity == "daily") {
    const data = await querySubgraph({
      network,
      query: dailyQuery,
      variables: {
        marketAddress: marketAddress.toLowerCase(),
        first: DAILY_DATA_MAX_NUM_POINTS,
      },
    });
    marketData = data.market?.dailyMarketAccounting.map(
      mapHistoricalEntryToData,
    );

    expectedLastKey = Math.floor(Date.now() / 1000 / SECONDS_PER_DAY);
    expectedLength = DAILY_DATA_MAX_NUM_POINTS;
  } else {
    const data = await querySubgraph({
      network,
      query: weeklyQuery,
      variables: {
        marketAddress: marketAddress.toLowerCase(),
        first: WEEKLY_DATA_MAX_NUM_POINTS,
      },
    });
    marketData = data.market?.weeklyMarketAccounting.map(
      mapHistoricalEntryToData,
    );

    expectedLastKey = Math.floor(Date.now() / 1000 / SECONDS_PER_WEEK);
    expectedLength = WEEKLY_DATA_MAX_NUM_POINTS;
  }

  // Reverse so first points are oldest (time in increasing with index)
  return marketData && marketData.length > 2
    ? // ? interpolate(marketData.reverse())
      extrapolate(
        interpolate(marketData.reverse()),
        expectedLastKey,
        expectedLength,
      )
    : undefined;
}

const hourlyQuery = graphql(/* GraphQL */ `
  query MarketHourlyQuery($marketAddress: ID!, $first: Int!) {
    market(id: $marketAddress) {
      id
      hourlyMarketAccounting(
        orderBy: timestamp
        orderDirection: desc
        first: $first
      ) {
        key: hour
        timestamp
        accounting {
          baseBorrowIndex
          baseSupplyIndex
          trackingBorrowIndex
          trackingSupplyIndex
          totalBaseSupply
          totalBaseSupplyUsd
          rewardTokenUsdPrice
          collateralBalances {
            collateralToken {
              token {
                address
              }
            }
            balance
            balanceUsd
          }
          supplyApr
          borrowApr
          rewardSupplyApr
          rewardBorrowApr
          netSupplyApr
          netBorrowApr
        }
      }
    }
  }
`);

const dailyQuery = graphql(/* GraphQL */ `
  query MarketDailyQuery($marketAddress: ID!, $first: Int!) {
    market(id: $marketAddress) {
      id
      dailyMarketAccounting(
        orderBy: timestamp
        orderDirection: desc
        first: $first
      ) {
        key: day
        timestamp
        accounting {
          baseBorrowIndex
          baseSupplyIndex
          trackingBorrowIndex
          trackingSupplyIndex
          totalBaseSupply
          totalBaseSupplyUsd
          rewardTokenUsdPrice
          collateralBalances {
            collateralToken {
              token {
                address
              }
            }
            balance
            balanceUsd
          }
          supplyApr
          borrowApr
          rewardSupplyApr
          rewardBorrowApr
          netSupplyApr
          netBorrowApr
        }
      }
    }
  }
`);

const weeklyQuery = graphql(/* GraphQL */ `
  query MarketWeeklyQuery($marketAddress: ID!, $first: Int!) {
    market(id: $marketAddress) {
      id
      weeklyMarketAccounting(
        orderBy: timestamp
        orderDirection: desc
        first: 1000
      ) {
        key: week
        timestamp
        accounting {
          baseBorrowIndex
          baseSupplyIndex
          trackingBorrowIndex
          trackingSupplyIndex
          totalBaseSupply
          totalBaseSupplyUsd
          rewardTokenUsdPrice
          collateralBalances {
            collateralToken {
              token {
                address
              }
            }
            balance
            balanceUsd
          }
          supplyApr
          borrowApr
          rewardSupplyApr
          rewardBorrowApr
          netSupplyApr
          netBorrowApr
        }
      }
    }
  }
`);

function mapHistoricalEntryToData({
  key,
  timestamp,
  accounting,
}: {
  key: string;
  timestamp: string;
  accounting: {
    baseBorrowIndex: string;
    baseSupplyIndex: string;
    trackingBorrowIndex: string;
    trackingSupplyIndex: string;
    totalBaseSupply: string;
    totalBaseSupplyUsd: string;
    rewardTokenUsdPrice: string;
    collateralBalances: {
      collateralToken: {
        token: {
          address: string;
        };
      };
      balance: string;
      balanceUsd: string;
    }[];
    supplyApr: string;
    borrowApr: string;
    rewardSupplyApr: string;
    rewardBorrowApr: string;
    netSupplyApr: string;
    netBorrowApr: string;
  };
}): MarketAccountingEntry {
  const totalBaseSupplyUsd = Number(accounting.totalBaseSupplyUsd);
  return {
    key: Number(key),
    timestamp: Number(timestamp),
    baseBorrowIndex: BigInt(accounting.baseBorrowIndex),
    baseSupplyIndex: BigInt(accounting.baseSupplyIndex),
    trackingBorrowIndex: BigInt(accounting.trackingBorrowIndex),
    trackingSupplyIndex: BigInt(accounting.trackingSupplyIndex),
    baseUsdExchangeRate: bigIntSafeDiv(
      BigInt(accounting.totalBaseSupply),
      BigInt(totalBaseSupplyUsd.toFixed(0)),
    ),
    rewardTokenUsdPrice: Number(accounting.rewardTokenUsdPrice),
    collateralAssetUsdExchangeRates: accounting.collateralBalances.map(
      (collateralBalance) => ({
        assetAddress: getAddress(
          collateralBalance.collateralToken.token.address,
        ),
        usdExchangeRate: bigIntSafeDiv(
          BigInt(collateralBalance.balance),
          BigInt(Number(collateralBalance.balanceUsd).toFixed(0)),
        ),
      }),
    ),
    supplyApr: {
      base: Number(accounting.supplyApr),
      reward: Number(accounting.rewardSupplyApr),
      net: Number(accounting.netSupplyApr),
    },
    borrowApr: {
      base: -Number(accounting.borrowApr),
      reward: Number(accounting.rewardSupplyApr),
      net: -Number(accounting.netBorrowApr),
    },
  };
}

function interpolate(data: MarketAccountingEntry[]): MarketAccountingEntry[] {
  const interpolated: MarketAccountingEntry[] = [];

  let numInterpolated = 0;
  let lastEntry = data[0];
  for (let entry of data) {
    const keyDelta = entry.key - lastEntry.key;

    if (keyDelta > 1) {
      // Interpolate all points
      const stepTimestamp = (entry.timestamp - lastEntry.timestamp) / keyDelta;
      const stepBaseBorrowIndex =
        (entry.baseBorrowIndex - lastEntry.baseBorrowIndex) / BigInt(keyDelta);
      const stepBaseSupplyIndex =
        (entry.baseSupplyIndex - lastEntry.baseSupplyIndex) / BigInt(keyDelta);
      const stepTrackingBorrowIndex =
        (entry.trackingBorrowIndex - lastEntry.trackingBorrowIndex) /
        BigInt(keyDelta);
      const stepTrackingSupplyIndex =
        (entry.trackingSupplyIndex - lastEntry.trackingSupplyIndex) /
        BigInt(keyDelta);
      const stepBaseUsdExchangeRate =
        (entry.baseUsdExchangeRate - lastEntry.baseUsdExchangeRate) /
        BigInt(keyDelta);
      const stepRewardTokenPriceUsd =
        (entry.rewardTokenUsdPrice - lastEntry.rewardTokenUsdPrice) / keyDelta;
      const stepBaseSupplyApr =
        (entry.supplyApr.base - lastEntry.supplyApr.base) / keyDelta;
      const stepRewardSupplyApr =
        (entry.supplyApr.reward - lastEntry.supplyApr.reward) / keyDelta;
      const stepNetSupplyApr =
        (entry.supplyApr.net - lastEntry.supplyApr.net) / keyDelta;
      const stepBaseBorrowApr =
        (entry.borrowApr.base - lastEntry.borrowApr.base) / keyDelta;
      const stepRewardBorrowApr =
        (entry.borrowApr.reward - lastEntry.borrowApr.reward) / keyDelta;
      const stepNetBorrowApr =
        (entry.borrowApr.net - lastEntry.borrowApr.net) / keyDelta;

      for (let i = 1; i < keyDelta; i++) {
        interpolated.push({
          key: lastEntry.key + i,
          timestamp: lastEntry.timestamp + stepTimestamp * i,
          baseBorrowIndex:
            lastEntry.baseBorrowIndex + stepBaseBorrowIndex * BigInt(i),
          baseSupplyIndex:
            lastEntry.baseSupplyIndex + stepBaseSupplyIndex * BigInt(i),
          trackingBorrowIndex:
            lastEntry.trackingBorrowIndex + stepTrackingBorrowIndex * BigInt(i),
          trackingSupplyIndex:
            lastEntry.trackingSupplyIndex + stepTrackingSupplyIndex * BigInt(i),
          baseUsdExchangeRate:
            lastEntry.baseUsdExchangeRate + stepBaseUsdExchangeRate * BigInt(i),
          rewardTokenUsdPrice:
            lastEntry.rewardTokenUsdPrice + stepRewardTokenPriceUsd * i,
          collateralAssetUsdExchangeRates:
            entry.collateralAssetUsdExchangeRates.map((item, i) => ({
              assetAddress: item.assetAddress,
              usdExchangeRate:
                (item.usdExchangeRate -
                  lastEntry.collateralAssetUsdExchangeRates[i]
                    .usdExchangeRate) /
                BigInt(keyDelta),
            })),
          supplyApr: {
            base: lastEntry.supplyApr.base + stepBaseSupplyApr * i,
            reward: lastEntry.supplyApr.reward + stepRewardSupplyApr * i,
            net: lastEntry.supplyApr.net + stepNetSupplyApr * i,
          },
          borrowApr: {
            base: lastEntry.borrowApr.base + stepBaseBorrowApr * i,
            reward: lastEntry.borrowApr.reward + stepRewardBorrowApr * i,
            net: lastEntry.borrowApr.net + stepNetBorrowApr * i,
          },
        });
        numInterpolated += 1;
      }
    }

    // Now add the actual entry
    interpolated.push(entry);
    lastEntry = entry;
  }

  if (numInterpolated > 5) {
    console.warn(
      "interpolate - interpolated more than 5 points",
      numInterpolated,
    );
  }

  return interpolated;
}

function extrapolate(
  data: MarketAccountingEntry[], // Assumes size >= 2
  expectedLastKey: number,
  expectedLength: number,
): MarketAccountingEntry[] {
  const keyDelta = expectedLastKey - data[data.length - 1].key;
  let numExtrapolated = 0;

  const lastEntry = data[data.length - 1];
  const secondLastEntry = data[data.length - 2];
  const stepTimestamp = lastEntry.timestamp - secondLastEntry.timestamp;

  // Right end extrapolation
  if (keyDelta > 0) {
    // Extrapolate
    const stepBaseBorrowIndex =
      lastEntry.baseBorrowIndex - secondLastEntry.baseBorrowIndex;
    const stepBaseSupplyIndex =
      lastEntry.baseSupplyIndex - secondLastEntry.baseSupplyIndex;
    const stepTrackingBorrowIndex =
      lastEntry.trackingBorrowIndex - secondLastEntry.trackingBorrowIndex;
    const stepTrackingSupplyIndex =
      lastEntry.trackingSupplyIndex - secondLastEntry.trackingSupplyIndex;
    const stepBaseUsdExchangeRate =
      lastEntry.baseUsdExchangeRate - secondLastEntry.baseUsdExchangeRate;
    const stepRewardTokenPriceUsd =
      lastEntry.rewardTokenUsdPrice - secondLastEntry.rewardTokenUsdPrice;
    const stepBaseSupplyApr =
      lastEntry.supplyApr.base - secondLastEntry.supplyApr.base;
    const stepRewardSupplyApr =
      lastEntry.supplyApr.reward - secondLastEntry.supplyApr.reward;
    const stepNetSupplyApr =
      lastEntry.supplyApr.net - secondLastEntry.supplyApr.net;
    const stepBaseBorrowApr =
      lastEntry.borrowApr.base - secondLastEntry.borrowApr.base;
    const stepRewardBorrowApr =
      lastEntry.borrowApr.reward - secondLastEntry.borrowApr.reward;
    const stepNetBorrowApr =
      lastEntry.borrowApr.net - secondLastEntry.borrowApr.net;

    for (let i = 1; i < keyDelta + 1; i++) {
      data.push({
        key: lastEntry.key + i,
        timestamp: lastEntry.timestamp + stepTimestamp * i,
        baseBorrowIndex:
          lastEntry.baseBorrowIndex + stepBaseBorrowIndex * BigInt(i),
        baseSupplyIndex:
          lastEntry.baseSupplyIndex + stepBaseSupplyIndex * BigInt(i),
        trackingBorrowIndex:
          lastEntry.trackingBorrowIndex + stepTrackingBorrowIndex * BigInt(i),
        trackingSupplyIndex:
          lastEntry.trackingSupplyIndex + stepTrackingSupplyIndex * BigInt(i),
        baseUsdExchangeRate:
          lastEntry.baseUsdExchangeRate + stepBaseUsdExchangeRate * BigInt(i),
        rewardTokenUsdPrice:
          lastEntry.rewardTokenUsdPrice + stepRewardTokenPriceUsd * i,
        collateralAssetUsdExchangeRates:
          lastEntry.collateralAssetUsdExchangeRates.map((item, i) => ({
            assetAddress: item.assetAddress,
            usdExchangeRate:
              (item.usdExchangeRate -
                secondLastEntry.collateralAssetUsdExchangeRates[i]
                  .usdExchangeRate) /
              BigInt(keyDelta),
          })),
        supplyApr: {
          base: lastEntry.supplyApr.base + stepBaseSupplyApr * i,
          reward: lastEntry.supplyApr.reward + stepRewardSupplyApr * i,
          net: lastEntry.supplyApr.net + stepNetSupplyApr,
        },
        borrowApr: {
          base: lastEntry.borrowApr.base + stepBaseBorrowApr * i,
          reward: lastEntry.borrowApr.reward + stepRewardBorrowApr * i,
          net: lastEntry.borrowApr.net + stepNetBorrowApr,
        },
      });
      numExtrapolated += 1;
    }
  }

  if (numExtrapolated > 5) {
    console.warn(
      "extrapolate - extrapolated more than 5 points",
      numExtrapolated,
    );
  }

  // Clamp to expected length, could still be shorter
  return data.slice(Math.max(data.length - expectedLength, 0));
}

// Cache here instead of on fetch (fetch is still cached) to avoid doing the data transformations every time
export const getMarketHistoricalAccountingCached = unstable_cache(
  getMarketHistoricalAccounting,
  ["get-market-data"],
  { revalidate: DEFAULT_REVALIDATION_TIME_S },
);
