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
        name="Base Asset Balance"
        popoverDescription="Sum of the base asset balances for all your Compound v3 positions across all chains. A positive value means net lending where a negative means net borrowing."
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
        name="Profit & Loss"
        popoverDescription="Sum of the realized and unrealized profit and loss for all your Compound v3 positions across all chains. This includes interest, liquidation losses, rewards, gas fees, and accounts for asset price fluctuation versus USD."
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
        name="Annual Percentage Rate"
        popoverDescription="Weighted average of annual percentage rates (APRs) for all your Compound v3 position across all chains, including rewards. A negative value means borrowing costs exceed lending earnings."
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
        <TitlePopover title="Transactions">
          All portfolio transactions including base and collateral deposits and
          withdrawals, liquidations, and rewards claimed.
        </TitlePopover>
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
