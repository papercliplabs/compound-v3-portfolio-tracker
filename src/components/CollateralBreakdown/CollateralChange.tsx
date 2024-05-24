import { get } from "http";
import { CollateralBreakdownProps } from ".";
import { getPositionHistoricalDataCached } from "@/data/queries/getPositionHistoricalData";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { formatNumber } from "@/utils/format";

const CHANGE_SECONDS = SECONDS_PER_DAY;

export default async function CollateralChange({
  network,
  marketAddress,
  accountAddress,
}: CollateralBreakdownProps) {
  const historicalData = await getPositionHistoricalDataCached({
    network,
    marketAddress,
    accountAddress,
    granularity: "daily",
  });

  if (!historicalData || historicalData.length == 0) {
    return <>--</>;
  }

  const current = historicalData[historicalData.length - 1];
  const timestampThreshold = current.timestamp - CHANGE_SECONDS;
  const prev = historicalData
    .reverse()
    .find((entry) => entry.timestamp < timestampThreshold);

  if (prev == undefined) {
    return <>--</>;
  }

  const change = current.totalCollateralUsd - prev.totalCollateralUsd;
  const percentChange = change / prev.totalCollateralUsd;

  return (
    <h3
      className={
        percentChange > 0 ? "text-semantic-success" : "text-semantic-critical"
      }
    >
      {(percentChange > 0 ? "+" : "") + formatNumber(percentChange, "%", 3)}
    </h3>
  );
}
