"use server";
import { SupportedNetwork, getSupportedNetworks } from "@/utils/configs";
import { querySubgraph } from "../dataUtils";
import { graphql } from "../graphql/generated";
import { unstable_cache } from "next/cache";
import { DEFAULT_REVALIDATION_TIME_S } from "../graphql/graphQLFetch";
import { Address, getAddress, isAddressEqual } from "viem";
import { getPositionsForAccount } from "./getPositionsForAccount";

export interface Market {
  address: Address;
  network: SupportedNetwork;
  baseTokenAddress: Address;
  baseTokenSymbol: string;
}

interface GetMarketsForAccountParams {
  accountAddress: Address;
  network?: SupportedNetwork;
  // name: string;
}

export async function getMarketsForAccount({
  accountAddress,
  network,
}: GetMarketsForAccountParams): Promise<Market[]> {
  const networks = network ? [network] : getSupportedNetworks();

  let queriesPromises = networks.map((network) =>
    querySubgraph({
      network,
      query,
      variables: { accountId: accountAddress.toLowerCase() },
    }),
  );
  const responses = await Promise.all(queriesPromises);

  const markets: Market[] = [];
  for (let i = 0; i < networks.length; i++) {
    const response = responses[i];
    for (let position of response?.account?.positions ?? []) {
      markets.push({
        address: getAddress(position.market.id),
        network: networks[i],
        baseTokenAddress: getAddress(
          position.market.configuration.baseToken.token.address,
        ),
        baseTokenSymbol: position.market.configuration.baseToken.token.symbol,
      });
    }
  }

  return markets;
}

const query = graphql(/* GraphQL */ `
  query accountMarkets($accountId: ID!) {
    account(id: $accountId) {
      positions {
        market {
          id
          configuration {
            baseToken {
              token {
                address
                symbol
              }
            }
          }
        }
      }
    }
  }
`);

// Cache here instead of on fetch (fetch is still cached) to avoid doing the data transformations every time
export const getMarketsForAccountCached = unstable_cache(
  getMarketsForAccount,
  ["get-markets"],
  {
    revalidate: DEFAULT_REVALIDATION_TIME_S,
  },
);

interface GetMarketForAccountParams {
  network: SupportedNetwork;
  marketAddress: Address;
  accountAddress: Address;
}

export async function getMarketForAccount({
  network,
  marketAddress,
  accountAddress,
}: GetMarketForAccountParams): Promise<Market | undefined> {
  return (await getMarketsForAccount({ accountAddress })).find(
    (market) =>
      isAddressEqual(market.address, marketAddress) &&
      market.network == network,
  );
}
