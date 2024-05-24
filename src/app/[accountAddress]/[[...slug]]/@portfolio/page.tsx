import { getMarketsForAccountCached } from "@/data/queries/getMarketsForAccount";
import { getPortfolioHistoricalData } from "@/data/queries/getPortfolioHistoricalData";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { Address } from "viem";
import { NoPositions } from "@/components/NoPositions";
import "@/utils/bigIntPolyfill";
import { TimeSelection } from "@/utils/types";
import { DATA_FOR_TIME_SELECTOR } from "@/utils/constants";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioActivityTable } from "@/components/ActivityTable";
import ChartCard from "@/components/Chart/ChartCard";
import PositionsAtRisk from "@/components/PositionsAtRisk";
import { Card } from "@/components/ui/card";
import TitlePopover from "@/components/TitlePopover";

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: { accountAddress: Address };
  searchParams: { timeSelector?: string };
}) {
  const { accountAddress } = params;
  const timeSelector = (searchParams.timeSelector ?? "MAX") as TimeSelection;
  const granularity = DATA_FOR_TIME_SELECTOR[timeSelector].granularity;

  const markets = await getMarketsForAccountCached({
    accountAddress,
  });

  if (markets.length == 0) {
    return <NoPositions />;
  }

  return (
    <>
      <Suspense fallback={null} key={accountAddress + "positions-at-risk"}>
        <PositionsAtRisk accountAddress={accountAddress} />
      </Suspense>
      <ChartCard
        query={getPortfolioHistoricalData}
        queryArgs={[{ accountAddress, granularity }]}
        name="Base asset balance"
        popoverDescription="TODO"
        dataKey="balanceUsd"
        timeSelection={timeSelector}
        unit="$"
        style={{
          lineColor: tailwindFullTheme.theme.colors.data.series1,
          areaGradient: true,
        }}
      />
      <ChartCard
        query={getPortfolioHistoricalData}
        queryArgs={[{ accountAddress, granularity }]}
        name="Profit and loss"
        popoverDescription="TODO"
        dataKey="profitAndLossUsd"
        timeSelection={timeSelector}
        unit="$"
        style={{
          lineColor: tailwindFullTheme.theme.colors.data.series2,
          areaGradient: false,
        }}
      />
      <ChartCard
        query={getPortfolioHistoricalData}
        queryArgs={[{ accountAddress, granularity }]}
        name="APR"
        popoverDescription="TODO"
        dataKey="avgApr.net"
        timeSelection={timeSelector}
        unit="%"
        showAverage
        style={{
          lineColor: tailwindFullTheme.theme.colors.data.series3,
          areaGradient: false,
        }}
      />
      <Card className="gap-3">
        <TitlePopover title="Transactions">TODO</TitlePopover>
        <Suspense
          fallback={<Skeleton className="h-[300px] w-full" />}
          key={accountAddress}
        >
          <PortfolioActivityTable accountAddress={accountAddress} />
        </Suspense>
      </Card>
    </>
  );
}
