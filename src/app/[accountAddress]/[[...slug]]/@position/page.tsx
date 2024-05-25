import { PositionActivityTable } from "@/components/ActivityTable";
import ChartCard from "@/components/Chart/ChartCard";
import { CollateralBreakdown } from "@/components/CollateralBreakdown";
import HealthFactor from "@/components/HealthFactor";
import TitlePopover from "@/components/TitlePopover";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { getPositionForAccount } from "@/data/queries/getPositionsForAccount";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { SupportedNetwork } from "@/utils/configs";
import { DATA_FOR_TIME_SELECTOR } from "@/utils/constants";
import { TimeSelection } from "@/utils/types";
import clsx from "clsx";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Address } from "viem";

export default async function Position({
  params,
  searchParams,
}: {
  params: {
    accountAddress: Address;
    slug?: [SupportedNetwork, Address];
  };
  searchParams: { timeSelector?: string };
}) {
  // Sanity check, but layout already performs this
  if (!(params.slug?.length == 2)) {
    redirect(`/${params.accountAddress}`);
  }

  const {
    accountAddress,
    slug: [network, marketAddress],
  } = params;

  const positionSummary = await getPositionForAccount({
    network,
    accountAddress,
    marketAddress,
  });

  // Sanity check, but layout already performs this
  if (!positionSummary) {
    redirect(`/${params.accountAddress}`);
  }

  const isBorrowing = positionSummary.summary.balanceUsd < 0;

  const timeSelector = (searchParams.timeSelector ?? "MAX") as TimeSelection;
  const granularity = DATA_FOR_TIME_SELECTOR[timeSelector].granularity;

  return (
    <>
      <ChartCard
        query={getPositionHistoricalDataCached}
        queryArgs={[
          {
            network,
            marketAddress,
            accountAddress,
            granularity,
          },
        ]}
        name="Base Asset Balance"
        popoverDescription="Balance of the positions base assets. A positive value means lending where a negative means borrowing"
        dataKey="balanceUsd"
        timeSelection={timeSelector}
        unit="$"
        style={{
          lineColor: tailwindFullTheme.theme.colors.data.series1,
          areaGradient: false,
        }}
      />
      {isBorrowing && (
        <Card>
          <TitlePopover title="Health Factor">
            The health factor is a single number that indicates a borrowing
            position{"'"}s health. It is the ratio of the liquidation threshold
            to borrowing amount. When it drops below 1 the position is
            liquidatable.
          </TitlePopover>
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <HealthFactor
              network={network}
              marketAddress={marketAddress}
              accountAddress={accountAddress}
              timeSelector={timeSelector}
            />
          </Suspense>
        </Card>
      )}
      <div
        className={clsx(
          "flex w-full flex-col gap-4 ",
          isBorrowing ? "flex-col md:flex-row" : "flex-col",
        )}
      >
        <ChartCard
          query={getPositionHistoricalDataCached}
          queryArgs={[
            {
              network,
              marketAddress,
              accountAddress,
              granularity,
            },
          ]}
          name="Profit & Loss"
          popoverDescription="Realized and unrealized profit and loss of the position. This includes interest, liquidation losses, rewards, gas fees, and accounts for asset price fluctuation versus USD."
          dataKey="profitAndLossUsd"
          timeSelection={timeSelector}
          unit="$"
          style={{
            lineColor: tailwindFullTheme.theme.colors.data.series3,
            areaGradient: false,
          }}
        />
        <ChartCard
          query={getPositionHistoricalDataCached}
          queryArgs={[
            {
              network,
              marketAddress,
              accountAddress,
              granularity,
            },
          ]}
          name="Annual Percent Rate"
          popoverDescription="The net annual percent rate (APR) for the position including rewards. This will equal the markets net supply or borrow APR."
          dataKey="apr.net"
          timeSelection={timeSelector}
          unit="%"
          showAverage
          style={{
            lineColor: tailwindFullTheme.theme.colors.data.series4,
            areaGradient: false,
          }}
        />
      </div>
      {isBorrowing && (
        <Card>
          <TitlePopover title="Collateral Breakdown">
            Breakdown of the positions collateral balances. The collateral ratio
            is the ratio of the collateral to borrowed value.
          </TitlePopover>
          <CollateralBreakdown
            network={network}
            marketAddress={marketAddress}
            accountAddress={accountAddress}
          />
        </Card>
      )}
      <Card className="gap-3">
        <TitlePopover title="Transactions">
          All position transactions including base and collateral deposits and
          withdrawals, liquidations, and rewards claimed.
        </TitlePopover>
        <Suspense
          fallback={<Skeleton className="h-[300px] w-full" />}
          key={accountAddress}
        >
          <PositionActivityTable
            network={network}
            marketAddress={marketAddress}
            accountAddress={accountAddress}
          />
        </Suspense>
      </Card>
    </>
  );
}
