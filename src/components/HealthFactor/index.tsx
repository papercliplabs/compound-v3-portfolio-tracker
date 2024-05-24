import { SupportedNetwork } from "@/utils/configs";
import { Address } from "viem";
import { getPositionForAccount } from "@/data/queries/getPositionsForAccount";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { DataGranularity, TimeSelection } from "@/utils/types";
import { HealthFactorGauge } from "./HealthFactorGauge";
import TimeSeriesChart from "../Chart/TimeSeriesChart";
import { DATA_FOR_TIME_SELECTOR } from "@/utils/constants";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";

interface HealthFactorProps {
  network: SupportedNetwork;
  marketAddress: Address;
  accountAddress: Address;
  timeSelector: TimeSelection;
}

export default async function HealthFactor({
  network,
  marketAddress,
  accountAddress,
  timeSelector,
}: HealthFactorProps) {
  const granularity = DATA_FOR_TIME_SELECTOR[timeSelector].granularity;
  const [positionSummary, positionHistorical] = await Promise.all([
    getPositionForAccount({
      network,
      marketAddress,
      accountAddress,
    }),
    getPositionHistoricalDataCached({
      network,
      marketAddress,
      accountAddress,
      granularity,
    }),
  ]);

  if (!positionSummary || !positionHistorical) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-[16px] md:flex-row xl:gap-[72px]">
      <HealthFactorGauge value={positionSummary.summary.healthFactor} />
      <div className="h-[240px] w-full">
        <TimeSeriesChart
          data={positionHistorical}
          dataKey="healthFactor"
          timeSelection={timeSelector}
          style={{
            lineColor: tailwindFullTheme.theme.colors.data.series2,
            areaGradient: true,
          }}
        />
      </div>
    </div>
  );
}
