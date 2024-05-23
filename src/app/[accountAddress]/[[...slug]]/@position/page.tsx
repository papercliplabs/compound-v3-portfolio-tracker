import Chart from "@/components/Chart";
import ChartCard from "@/components/Chart/ChartCard";
import { Card } from "@/components/ui/card";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { SupportedNetwork } from "@/utils/configs";
import { GRANULARITY_FOR_TIME_SELECTOR } from "@/utils/constants";
import { TimeSelection } from "@/utils/types";
import { redirect } from "next/navigation";
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
  const granularity = GRANULARITY_FOR_TIME_SELECTOR[timeSelector];

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
        name="Base asset balance"
        popoverDescription="TODO"
        dataKey="balanceUsd"
        granularity={granularity}
        unit="$"
        style={{
          lineColor: tailwindFullTheme.theme.colors.data.series1,
          areaGradient: true,
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
        name="Health Factor"
        popoverDescription="TODO"
        dataKey="healthFactor"
        granularity={granularity}
        unit="$"
        style={{
          lineColor: tailwindFullTheme.theme.colors.data.series2,
          areaGradient: true,
        }}
      />
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
          granularity={granularity}
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
          granularity={granularity}
          unit="$"
          style={{
            lineColor: tailwindFullTheme.theme.colors.data.series4,
            areaGradient: false,
          }}
        />
      </div>
    </>
  );
}
