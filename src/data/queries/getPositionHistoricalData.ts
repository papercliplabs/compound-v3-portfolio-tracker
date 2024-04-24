"use server";
import { DataGranularity } from "@/utils/types";
import { SupportedNetwork } from "@/utils/configs";
import { unstable_cache } from "next/cache";
import { DEFAULT_REVALIDATION_TIME_S } from "../graphql/graphQLFetch";
import { getMarketHistoricalAccountingCached } from "./getMarketHistoricalAccounting";
import { bigIntAbs, bigIntSafeDiv } from "@/utils/bigInt";
import { getMarketRewardConfigCached } from "./getMarketRewardConfig";
import { getMarketConfigSnapshotsCached } from "./getMarketConfigSnapshots";
import { Address, formatUnits, isAddressEqual } from "viem";
import { getPositionAccountingSnapshotsCached } from "./getPositionAccountingSnapshots";

const BASE_INDEX_SCALE = BigInt(1e15);
const USD_DECIMALS_SCALER = 1e4;
const FACTOR_SCALE = BigInt(1e18);

interface PositionDataEntry {
  key: number; // hour / day / week
  timestamp: number; // time since unix epoch
  balance: bigint;
  balanceUsd: number;
  rewardsAccrued: bigint; // In reward token (for debugging)
  rewardsAccruedUsd: number;
  profitAndLossUsd: number; // baseBalanceUsd - netDepositsUsd + rewardsUsd - collateralLiquidatedUsd

  // Collateral related
  collateral: { assetAddress: Address; balanceUsd: number }[];
  borrowCapUsd: number;
  liquidationThresholdUsd: number;

  healthFactor: number;

  apr: { base: number; reward: number; net: number };
}

interface GetPositionHistoricalDataParams {
  network: SupportedNetwork;
  marketAddress: Address;
  accountAddress: string;
  granularity: DataGranularity;
}

async function getPositionHistoricalData({
  network,
  marketAddress,
  accountAddress,
  granularity,
}: GetPositionHistoricalDataParams): Promise<PositionDataEntry[] | undefined> {
  const positionAccountingSnapshots =
    await getPositionAccountingSnapshotsCached({
      network,
      marketAddress,
      accountAddress,
    });

  const marketHistoricalData = await getMarketHistoricalAccountingCached({
    network,
    marketAddress,
    granularity,
  });

  const marketConfigSnapshots = await getMarketConfigSnapshotsCached({
    network,
    marketAddress,
  });

  const marketRewardConfig = await getMarketRewardConfigCached({
    network,
    marketAddress,
  });

  if (
    !positionAccountingSnapshots ||
    !marketHistoricalData ||
    !marketConfigSnapshots ||
    !marketRewardConfig
  ) {
    console.error(
      "getPositionHistoricalData: data error - ",
      network,
      marketAddress,
      accountAddress,
      positionAccountingSnapshots,
      marketHistoricalData,
      marketConfigSnapshots,
      marketRewardConfig,
    );
    return undefined;
  }

  // Stitch together
  const positionHistoricalData: PositionDataEntry[] = [];

  let currentPositionSnapshotIndex = 0;
  let currentMarketConfigSnapshotIndex = 0;

  for (let marketEntry of marketHistoricalData) {
    let positionEntry: PositionDataEntry = {
      key: marketEntry.key,
      timestamp: marketEntry.timestamp,
      balance: BigInt(0),
      balanceUsd: 0,
      rewardsAccrued: BigInt(0),
      rewardsAccruedUsd: 0,
      profitAndLossUsd: 0,
      collateral: [],
      borrowCapUsd: 0,
      liquidationThresholdUsd: 0,
      healthFactor: 0,
      apr: { base: 0, reward: 0, net: 0 },
    };

    // Find the corresponding position snapshot index
    while (
      currentPositionSnapshotIndex != positionAccountingSnapshots.length - 1 &&
      marketEntry.timestamp >=
        Number(
          positionAccountingSnapshots[currentPositionSnapshotIndex + 1]
            .timestamp,
        )
    ) {
      currentPositionSnapshotIndex += 1;
    }

    // Find the corresponding market config snapshot
    while (
      currentMarketConfigSnapshotIndex != marketConfigSnapshots.length - 1 &&
      marketEntry.timestamp >=
        Number(
          marketConfigSnapshots[currentMarketConfigSnapshotIndex + 1].timestamp,
        )
    ) {
      currentMarketConfigSnapshotIndex += 1;
    }

    if (
      marketEntry.timestamp < Number(positionAccountingSnapshots[0].timestamp)
    ) {
      // Do nothing, filling in 0's before first interaction
    } else {
      const positionAccountingSnapshot =
        positionAccountingSnapshots[currentPositionSnapshotIndex];

      const marketConfigSnapshot =
        marketConfigSnapshots[currentMarketConfigSnapshotIndex];

      const basePrincipal = BigInt(positionAccountingSnapshot.basePrincipal);

      positionEntry.balance = presentValue(
        marketEntry.baseSupplyIndex,
        marketEntry.baseBorrowIndex,
        basePrincipal,
      );

      positionEntry.balanceUsd =
        Number(
          bigIntSafeDiv(
            positionEntry.balance * BigInt(USD_DECIMALS_SCALER),
            marketEntry.baseUsdExchangeRate,
          ),
        ) / USD_DECIMALS_SCALER;

      // Rewards accrued
      const rewardIndexDelta =
        basePrincipal > BigInt(0)
          ? marketEntry.trackingSupplyIndex -
            BigInt(positionAccountingSnapshot.baseTrackingIndex)
          : marketEntry.trackingBorrowIndex -
            BigInt(positionAccountingSnapshot.baseTrackingIndex);

      const rewardAccruedDelta =
        (bigIntAbs(basePrincipal) * rewardIndexDelta) /
        marketConfigSnapshot.trackingIndexScale /
        marketConfigSnapshot.accrualDescaleFactor;
      const rewardAccruedUnscaled =
        BigInt(positionAccountingSnapshot.baseTrackingAccrued) +
        rewardAccruedDelta;
      const rewardAccruedInRewardTokens = marketRewardConfig.shouldUpscale
        ? (rewardAccruedUnscaled *
            marketRewardConfig.rescaleFactor *
            marketRewardConfig.multiplier) /
          FACTOR_SCALE
        : ((rewardAccruedUnscaled / marketRewardConfig.rescaleFactor) *
            marketRewardConfig.multiplier) /
          FACTOR_SCALE;

      positionEntry.rewardsAccrued = rewardAccruedInRewardTokens;

      positionEntry.rewardsAccruedUsd =
        Number(
          formatUnits(
            rewardAccruedInRewardTokens,
            marketRewardConfig.rewardTokenDecimals,
          ),
        ) * marketEntry.rewardTokenUsdPrice;

      positionEntry.profitAndLossUsd =
        positionEntry.balanceUsd -
        (positionAccountingSnapshot.cumulativeBaseSuppliedUsd -
          positionAccountingSnapshot.cumulativeBaseWithdrawUsd) +
        positionEntry.rewardsAccruedUsd -
        positionAccountingSnapshot.cumulativeCollateralLiquidatedUsd -
        positionAccountingSnapshot.cumulativeGasUsedUsd;

      for (let positionCollateralBalance of positionAccountingSnapshot.collateralAssetBalances) {
        const exchangeRate = marketEntry.collateralAssetUsdExchangeRates.find(
          (item) =>
            isAddressEqual(
              item.assetAddress,
              positionCollateralBalance.assetAddress,
            ),
        );
        const config = marketConfigSnapshot.collateralTokenConfigs.find(
          (item) =>
            isAddressEqual(
              item.assetAddress,
              positionCollateralBalance.assetAddress,
            ),
        );

        if (exchangeRate == undefined || config == undefined) {
          console.error(
            "getPositionHistoricalData - missing collateral data",
            positionCollateralBalance.assetAddress,
            exchangeRate,
            config,
          );
        } else {
          const collateralBalanceUsd =
            Number(
              bigIntSafeDiv(
                positionCollateralBalance.balance * BigInt(USD_DECIMALS_SCALER),
                exchangeRate.usdExchangeRate,
              ),
            ) / USD_DECIMALS_SCALER;

          positionEntry.collateral.push({
            assetAddress: positionCollateralBalance.assetAddress,
            balanceUsd: collateralBalanceUsd,
          });
          positionEntry.borrowCapUsd +=
            collateralBalanceUsd * config.borrowCollateralFactor;
          positionEntry.liquidationThresholdUsd +=
            collateralBalanceUsd * config.liquidateCollateralFactor;
        }
      }

      positionEntry.healthFactor =
        positionEntry.balanceUsd >= 0
          ? NaN // Not borrowing, health factor doesn't make sense
          : positionEntry.liquidationThresholdUsd / -positionEntry.balanceUsd;

      positionEntry.apr =
        positionEntry.balanceUsd >= 0
          ? marketEntry.supplyApr
          : marketEntry.borrowApr;
    }

    positionHistoricalData.push(positionEntry);
  }

  return positionHistoricalData;
}

function presentValue(
  supplyIndex: bigint,
  borrowIndex: bigint,
  principalAmount: bigint,
) {
  return principalAmount > 0
    ? (principalAmount * supplyIndex) / BASE_INDEX_SCALE
    : (principalAmount * borrowIndex) / BASE_INDEX_SCALE;
}

// Cache here instead of on fetch (fetch is still cached) to avoid doing the data transformations every time
export const getPositionHistoricalDataCached = unstable_cache(
  getPositionHistoricalData,
  ["get-position-data"],
  { revalidate: DEFAULT_REVALIDATION_TIME_S },
);
