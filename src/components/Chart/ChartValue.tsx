import { extractNestedValue } from "@/utils/extractNestedValue";
import { formatNumber } from "@/utils/format";
import { NestedKeyOf, Unit } from "@/utils/types";
import clsx from "clsx";
import { BaseDataEntry } from "./types";

interface ChartValueProps<DataEntry extends BaseDataEntry> {
  data: DataEntry[];
  dataKey: NestedKeyOf<DataEntry>;
  unit?: Unit;
}

export function ChartValue<DataEntry extends BaseDataEntry>({
  data,
  dataKey,
  unit,
}: ChartValueProps<DataEntry>) {
  // Extract last value
  const firstEntry = data[0];
  const lastEntry = data[data.length - 1];

  const firstValue = extractNestedValue<number>(firstEntry, dataKey);
  const lastValue = extractNestedValue<number>(lastEntry, dataKey);

  const percentChange = (lastValue - firstValue) / Math.abs(firstValue);

  return (
    <div className="flex flex-row items-center gap-3">
      <h3>{formatNumber(lastValue, unit)}</h3>
      {firstValue != 0 && (
        <div
          className={clsx(
            "text-caption-md",
            percentChange > 0
              ? "text-semantic-success"
              : "text-semantic-critical",
          )}
        >
          {percentChange > 0 && "+"}
          {formatNumber(percentChange, "%")}
        </div>
      )}
    </div>
  );
}
