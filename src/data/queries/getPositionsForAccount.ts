"use server";
import { Address, isAddressEqual } from "viem";
import { Market, getMarketsForAccountCached } from "./getMarketsForAccount";
import {
  PositionDataEntry,
  getPositionHistoricalDataCached,
} from "./getPositionHistoricalData";
import { SupportedNetwork } from "@/utils/configs";

export interface Position {
  market: Market;
  summary: Omit<PositionDataEntry, "key">;
}

interface GetPositionsForAccountParams {
  accountAddress: Address;
}

export async function getPositionsForAccount({
  accountAddress,
}: GetPositionsForAccountParams): Promise<Position[]> {
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

  const positions = positionHistoricalDataResponse
    .map((response, i) => ({
      market: markets[i],
      historicalData: response,
    }))
    .filter(
      ({ historicalData }) =>
        historicalData != undefined && historicalData.length != 0,
    )
    .map((out) => ({
      market: out.market,
      summary: out.historicalData![out.historicalData!.length - 1], // Ts is not smart enough here
    }));

  return positions;
}

interface GetPositionForAccountParams {
  network: SupportedNetwork;
  marketAddress: Address;
  accountAddress: Address;
}

export async function getPositionForAccount({
  network,
  accountAddress,
  marketAddress,
}: GetPositionForAccountParams): Promise<Position | undefined> {
  return (await getPositionsForAccount({ accountAddress })).find(
    (position) =>
      isAddressEqual(position.market.address, marketAddress) &&
      position.market.network == network,
  );
}
