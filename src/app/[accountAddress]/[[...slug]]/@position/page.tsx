import Chart from "@/components/Chart";
import ChartCard from "@/components/Chart/ChartCard";
import { PositionTitle } from "@/components/PositionTitle";
import Token from "@/components/Token";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { getPositionForAccount } from "@/data/queries/getPositionsForAccount";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { SupportedNetwork, getNetworkConfig } from "@/utils/configs";
import {
  AT_RISK_HEALTH_FACTOR_THRESHOLD,
  DATA_FOR_TIME_SELECTOR,
} from "@/utils/constants";
import { TimeSelection } from "@/utils/types";
import { Warning } from "@phosphor-icons/react/dist/ssr";
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
      <Suspense fallback={null}>
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
          unit="$"
          style={{
            lineColor: tailwindFullTheme.theme.colors.data.series2,
            areaGradient: true,
          }}
          hideIfSupply
        />
      </Suspense>

      <div className="flex w-full flex-col gap-4 md:flex-row">
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
    </>
  );
}
