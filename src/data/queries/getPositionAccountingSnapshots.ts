"use server";
import { SupportedNetwork } from "@/utils/configs";
import { graphql } from "../graphql/generated";
import { querySubgraph } from "../dataUtils";
import { unstable_cache } from "next/cache";
import { DEFAULT_REVALIDATION_TIME_S } from "../graphql/graphQLFetch";
import { Address, getAddress } from "viem";
import { assert } from "console";

export interface PositionAccountingSnapshot {
  timestamp: number;
  basePrincipal: bigint;
  baseTrackingAccrued: bigint;
  baseTrackingIndex: bigint;
  cumulativeBaseSupplied: bigint;
  cumulativeBaseSuppliedUsd: number;
  cumulativeBaseWithdrawn: bigint;
  cumulativeBaseWithdrawUsd: number;
  cumulativeCollateralLiquidatedUsd: number;
  cumulativeGasUsedUsd: number;
  collateralAssetBalances: {
    assetAddress: Address;
    assetSymbol: string;
    balance: bigint;
  }[];
}

interface GetPositionAccountingSnapshotParams {
  network: SupportedNetwork;
  marketAddress: string;
  accountAddress: string;
}

async function getPositionAccountingSnapshots({
  network,
  marketAddress,
  accountAddress,
}: GetPositionAccountingSnapshotParams): Promise<
  PositionAccountingSnapshot[] | undefined
> {
  const positionId =
    marketAddress.toLowerCase() + accountAddress.toLowerCase().slice(2);
  const positionSnapshotResp = await querySubgraph({
    network,
    query: snapshotQuery,
    variables: {
      positionId,
    },
  });
  const snapshots = positionSnapshotResp?.position?.positionAccountingSnapshots;

  if (!snapshots || snapshots.length == 0) {
    console.error(
      "getPositionAccountingSnapshots: data error - ",
      positionId,
      snapshots,
    );
    return undefined;
  }

  snapshots.reverse(); // Reverse so that first points in array are the oldest

  return snapshots.map((snapshot) => ({
    timestamp: Number(snapshot.timestamp),
    basePrincipal: BigInt(snapshot.accounting.basePrincipal),
    baseTrackingAccrued: BigInt(snapshot.accounting.baseTrackingAccrued),
    baseTrackingIndex: BigInt(snapshot.accounting.baseTrackingIndex),
    cumulativeBaseSupplied: BigInt(snapshot.accounting.cumulativeBaseSupplied),
    cumulativeBaseSuppliedUsd: Number(
      snapshot.accounting.cumulativeBaseSuppliedUsd,
    ),
    cumulativeBaseWithdrawn: BigInt(
      snapshot.accounting.cumulativeBaseWithdrawn,
    ),
    cumulativeBaseWithdrawUsd: Number(
      snapshot.accounting.cumulativeBaseWithdrawnUsd,
    ),
    cumulativeCollateralLiquidatedUsd: Number(
      snapshot.accounting.cumulativeCollateralLiquidatedUsd,
    ),
    cumulativeGasUsedUsd: Number(snapshot.accounting.cumulativeGasUsedUsd),
    collateralAssetBalances: snapshot.accounting.collateralBalances.map(
      (item) => ({
        assetAddress: getAddress(item.collateralToken.token.address),
        assetSymbol: item.collateralToken.token.symbol,
        balance: BigInt(item.balance),
      }),
    ),
  }));
}

// TODO(spennyp): we should pagenate this query (highly unlikely position has >1000 interactions tho)
const snapshotQuery = graphql(/* GraphQL */ `
  query PositionSnapshotQuery($positionId: ID!) {
    position(id: $positionId) {
      id
      positionAccountingSnapshots(
        orderBy: timestamp
        orderDirection: desc
        first: 1000
      ) {
        timestamp
        accounting {
          basePrincipal
          baseTrackingAccrued
          baseTrackingIndex
          cumulativeBaseSupplied
          cumulativeBaseSuppliedUsd
          cumulativeBaseWithdrawn
          cumulativeBaseWithdrawnUsd
          cumulativeCollateralLiquidatedUsd
          cumulativeGasUsedUsd
          collateralBalances {
            collateralToken {
              token {
                address
                symbol
              }
            }
            balance
          }
        }
      }
    }
  }
`);

// Cache here instead of on fetch (fetch is still cached) to avoid doing the data transformations every time
export const getPositionAccountingSnapshotsCached = unstable_cache(
  getPositionAccountingSnapshots,
  ["get-position-accounting-snapshots"],
  { revalidate: DEFAULT_REVALIDATION_TIME_S },
);
