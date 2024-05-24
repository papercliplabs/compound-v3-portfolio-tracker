import { PositionActivityTable } from "@/components/ActivityTable";
import ChartCard from "@/components/Chart/ChartCard";
import { PositionTitle } from "@/components/PositionTitle";
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
      <Suspense
        fallback={<Skeleton className="h-[44px] w-full max-w-[400px]" />}
      >
        <PositionTitle
          accountAddress={accountAddress}
          network={network}
          marketAddress={marketAddress}
        />
      </Suspense>
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
      {/* TODO: custom card for health factor */}
      {isBorrowing && (
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
          name="Health Factor"
          popoverDescription="TODO"
          dataKey="healthFactor"
          timeSelection={timeSelector}
          style={{
            lineColor: tailwindFullTheme.theme.colors.data.series2,
            areaGradient: true,
          }}
        />
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
          popoverDescription="TODO"
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
          name="APR"
          popoverDescription="TODO"
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
      {/* TODO: collateral breakdown */}
      <Card className="gap-3">
        <TitlePopover title="Transactions">TODO</TitlePopover>
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
