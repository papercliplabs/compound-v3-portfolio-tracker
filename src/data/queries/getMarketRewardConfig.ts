"use server";
import { SupportedNetwork } from "@/utils/configs";
import { Address, getAddress, zeroAddress } from "viem";
import { graphql } from "../graphql/generated";
import { querySubgraph } from "../dataUtils";
import { unstable_cache } from "next/cache";
import { DEFAULT_REVALIDATION_TIME_S } from "../graphql/graphQLFetch";

interface MarketRewardConfig {
  rewardTokenAddress: Address;
  rewardTokenDecimals: number;
  rescaleFactor: bigint;
  shouldUpscale: boolean;
  multiplier: bigint;
}

interface GetMarketRewardConfigParams {
  network: SupportedNetwork;
  marketAddress: string;
}

async function getMarketRewardConfig({
  network,
  marketAddress,
}: GetMarketRewardConfigParams): Promise<MarketRewardConfig | undefined> {
  const rewardQueryResp = await querySubgraph({
    network,
    query: rewardConfigQuery,
    variables: {
      marketAddress: marketAddress.toLowerCase(),
    },
  });

  if (!rewardQueryResp.market?.rewardConfiguration) {
    console.error(
      "getMarketHistoricalData - no reward config for ",
      network,
      marketAddress,
    );
    return undefined;
  }

  let rewardTokenDecimals = 18;
  const rewardTokenAddress = getAddress(
    rewardQueryResp.market.rewardConfiguration.tokenAddress,
  );
  if (rewardTokenAddress != zeroAddress) {
    const tokenQueryResp = await querySubgraph({
      network,
      query: tokenQuery,
      variables: {
        tokenId: rewardTokenAddress.toLowerCase(),
      },
    });

    rewardTokenDecimals = tokenQueryResp.token?.decimals ?? 18;
  }

  return {
    rewardTokenAddress: getAddress(
      rewardQueryResp.market.rewardConfiguration.tokenAddress,
    ),
    rewardTokenDecimals,
    rescaleFactor: BigInt(
      rewardQueryResp.market.rewardConfiguration.rescaleFactor,
    ),
    shouldUpscale: rewardQueryResp.market.rewardConfiguration.shouldUpscale,
    multiplier: BigInt(rewardQueryResp.market.rewardConfiguration.multiplier),
  };
}

const rewardConfigQuery = graphql(/* GraphQL */ `
  query MarketRewardConfig($marketAddress: ID!) {
    market(id: $marketAddress) {
      rewardConfiguration {
        tokenAddress
        rescaleFactor
        shouldUpscale
        multiplier
      }
    }
  }
`);

const tokenQuery = graphql(/* GraphQL */ `
  query Token($tokenId: ID!) {
    token(id: $tokenId) {
      decimals
    }
  }
`);

export const getMarketRewardConfigCached = unstable_cache(
  getMarketRewardConfig,
  ["get-market-reward-config"],
  { revalidate: DEFAULT_REVALIDATION_TIME_S },
);
