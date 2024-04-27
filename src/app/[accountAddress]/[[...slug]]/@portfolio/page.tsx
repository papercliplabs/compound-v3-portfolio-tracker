import Chart from "@/components/Chart";
import { Card } from "@/components/ui/card";
import { getMarketsForAccountCached } from "@/data/queries/getMarketsForAccount";
import { getPortfolioActivityCached } from "@/data/queries/getPortfolioActivity";
import { getPortfolioHistoricalDataCached } from "@/data/queries/getPortfolioHistoricalData";
import { getPositionActivityCached } from "@/data/queries/getPositionActivity";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import "@/utils/bigIntPolyfill";
import { redirect } from "next/navigation";
import { Address, getAddress, isAddress } from "viem";

export default async function PortfolioPage({
  params,
}: {
  params: { accountAddress: Address };
}) {
  const { accountAddress } = params;
  // Liquidated
  // const positionData = await getPositionHistoricalDataCached({
  //   network: "mainnet",
  //   marketAddress: "0xc3d688b66703497daa19211eedff47f25384cdc3",
  //   accountAddress: "0x7f7bbb19026b5eca0b6cdb96caa84923716532a5",
  //   granularity: "daily",
  // });

  const granularity = "weekly";

  const markets = await getMarketsForAccountCached({
    accountAddress,
  });

  const portfolio = await getPortfolioHistoricalDataCached({
    accountAddress,
    granularity,
  });

  const portfolioActivity = await getPortfolioActivityCached({
    accountAddress,
  });

  return (
    <>
      <Card>
        <Chart data={portfolio!} dataKey="balanceUsd" />
      </Card>
      <Card>
        <Chart data={portfolio!} dataKey="avgApr.net" />
      </Card>
      {markets.map(async (market, i) => {
        const positionData = await getPositionHistoricalDataCached({
          network: market.network,
          marketAddress: market.address,
          accountAddress,
          granularity,
        });
        const positionActivity = await getPositionActivityCached({
          network: market.network,
          marketAddress: market.address,
          accountAddress,
        });
        return (
          <Card key={i}>
            <Chart data={positionData!} dataKey="balanceUsd" />
          </Card>
        );
      })}
      {/* <Chart data={positionData!} dataKey="balanceUsd" />
      <Chart data={positionData!} dataKey="healthFactor" />
      <Chart data={positionData!} dataKey="profitAndLossUsd" />
      <Chart data={positionData!} dataKey="apr.net" /> */}
    </>
  );
}
