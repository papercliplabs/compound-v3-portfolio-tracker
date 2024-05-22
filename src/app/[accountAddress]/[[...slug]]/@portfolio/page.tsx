import ActivityTable from "@/components/ActivityTable";
import { Columns } from "@/components/ActivityTable/Columns";
import Chart from "@/components/Chart";
import TimeSeriesChart from "@/components/Chart/TimeSeriesChart";
import ExternalLink from "@/components/ExternalLink";
import { Card } from "@/components/ui/card";
import { getMarketsForAccountCached } from "@/data/queries/getMarketsForAccount";
import { getPortfolioActivity } from "@/data/queries/getPortfolioActivity";
import { getPortfolioHistoricalData } from "@/data/queries/getPortfolioHistoricalData";
import { getPositionActivityCached } from "@/data/queries/getPositionActivity";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import "@/utils/bigIntPolyfill";
import { Info } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
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

  const portfolio = await getPortfolioHistoricalData({
    accountAddress,
    granularity,
  });

  const portfolioActivity = await getPortfolioActivity({
    accountAddress,
  });

  if (markets.length == 0) {
    return <NoPositions />;
  }

  return (
    <>
      {/* <Card>
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
      })} */}
      <Card>
        {/* <TimeSeriesChart data={portfolio ?? []} dataKey="balanceUsd" /> */}
      </Card>
      <ActivityTable data={portfolioActivity} columns={Columns} />
    </>
  );
}

function NoPositions() {
  console.log("NONE!");
  return (
    <div className="m-auto flex h-full w-full max-w-[500px] flex-col items-center justify-between text-center">
      <div className="flex flex-col items-center gap-3 pt-[108px]">
        <Image src="/image/no-positions.png" width={480} height={80} alt="" />
        <h1>This account does not have any Compound v3 positions.</h1>
        <span className="text-caption-md text-content-secondary">
          Try searching for another account.
        </span>
      </div>
      <Card className="flex flex-row">
        <Info width={20} height={20} className="pr-2" />
        <div className=" flex-wrap items-start justify-start whitespace-pre-wrap text-start">
          If you believe this is a mistake, please{" "}
          <ExternalLink
            href="mailto:contact@paperclip.xyz"
            className="text-semantic-brand"
          >
            contract us
          </ExternalLink>
          .
        </div>
      </Card>
    </div>
  );
}
