import Chart from "@/components/Chart";
import { Card } from "@/components/ui/card";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { SupportedNetwork } from "@/utils/configs";
import { redirect } from "next/navigation";
import { Address } from "viem";

export default async function Position({
  params,
}: {
  params: {
    accountAddress: Address;
    slug?: [SupportedNetwork, Address];
  };
}) {
  // Sanity check, but layout already performs this
  if (!(params.slug?.length == 2)) {
    redirect(`/${params.accountAddress}`);
  }

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
      <Card>TEST</Card>
      <Card>TEST</Card>
      {/* <Card>
        <Chart data={positionHistoricalData!} dataKey="balanceUsd" />
      </Card>
      <Card>
        <Chart data={positionHistoricalData!} dataKey="profitAndLossUsd" />
      </Card> */}
    </>
  );
}
