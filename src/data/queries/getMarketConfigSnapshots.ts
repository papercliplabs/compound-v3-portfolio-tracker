"use server";
import { SupportedNetwork } from "@/utils/configs";
import { graphql } from "../graphql/generated";
import { querySubgraph } from "../dataUtils";
import { unstable_cache } from "next/cache";
import { DEFAULT_REVALIDATION_TIME_S } from "../graphql/graphQLFetch";
import { Address, getAddress } from "viem";

const BASE_ACCRUAL_SCALE = 1e6;

interface MarketConfig {
  timestamp: number; // time since unix epoch
  trackingIndexScale: bigint;
  accrualDescaleFactor: bigint;
  collateralTokenConfigs: {
    assetAddress: Address;
    borrowCollateralFactor: number;
    liquidateCollateralFactor: number;
  }[];
}

interface GetMarketConfigSnapshotsParams {
  network: SupportedNetwork;
  marketAddress: string;
}

async function getMarketConfigSnapshots({
  network,
  marketAddress,
}: GetMarketConfigSnapshotsParams): Promise<MarketConfig[] | undefined> {
  const queryResp = await querySubgraph({
    network,
    query,
    variables: {
      marketAddress: marketAddress.toLowerCase(),
    },
  });

  const snapshots = queryResp.market?.configurationSnapshots;

  if (!snapshots) {
    console.error(
      "getMarketHistoricalConfig - no config for ",
      network,
      marketAddress,
    );
    return undefined;
  }

  snapshots.reverse(); // Reverse so that first points in array are the oldest

  return snapshots.map((snapshot) => {
    return {
      timestamp: Number(snapshot.timestamp),
      trackingIndexScale: BigInt(snapshot.configuration.trackingIndexScale),
      accrualDescaleFactor:
        BigInt(10 ** snapshot.configuration.baseToken.token.decimals!) /
        BigInt(BASE_ACCRUAL_SCALE),
      collateralTokenConfigs: snapshot.configuration.collateralTokens.map(
        (token) => ({
          assetAddress: getAddress(token.token.address),
          borrowCollateralFactor: Number(token.borrowCollateralFactor),
          liquidateCollateralFactor: Number(token.liquidateCollateralFactor),
        }),
      ),
    };
  });
}

const query = graphql(`
  query MarketHistoricalConfig($marketAddress: ID!) {
    market(id: $marketAddress) {
      configurationSnapshots(
        orderBy: timestamp
        orderDirection: desc
        first: 1000
      ) {
        timestamp
        configuration {
          trackingIndexScale
          baseToken {
            token {
              decimals
            }
          }
          collateralTokens {
            token {
              address
            }
            borrowCollateralFactor
            liquidateCollateralFactor
          }
        }
      }
    }
  }
`);

export const getMarketConfigSnapshotsCached = unstable_cache(
  getMarketConfigSnapshots,
  ["get-market-config-snapshots"],
  { revalidate: DEFAULT_REVALIDATION_TIME_S },
);
