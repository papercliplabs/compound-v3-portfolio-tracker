import Chart from "@/components/Chart";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { SupportedNetwork } from "@/utils/configs";
import { Address } from "viem";

export default async function Position({
  params,
}: {
  params: {
    accountAddress: Address;
    slug: [SupportedNetwork, Address];
  };
}) {
  const {
    accountAddress,
    slug: [network, marketAddress],
  } = params;

  const positionHistoricalData = await getPositionHistoricalDataCached({
    network,
    marketAddress,
    accountAddress,
    granularity: "weekly",
  });

  return (
    <>
      {" "}
      <Chart data={positionHistoricalData!} dataKey="balanceUsd" />
    </>
  );
}
