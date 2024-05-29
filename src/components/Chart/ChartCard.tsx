import { Card } from "../ui/card";
import TimeSeriesChart, { TimeSeriesChartProps } from "./TimeSeriesChart";
import TitlePopover from "../TitlePopover";
import { formatNumber } from "@/utils/format";
import clsx from "clsx";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { extractNestedValue } from "@/utils/extractNestedValue";

export interface ChartCardProps<
  DataEntry extends { timestamp: number },
  P extends any[],
> extends Omit<TimeSeriesChartProps<DataEntry>, "data"> {
  name: string;
  popoverDescription: string;
  query: (...args: P) => Promise<DataEntry[] | undefined>;
  queryArgs: P;
}

export default async function ChartCard<
  T extends { timestamp: number },
  P extends any[],
>({ ...props }: ChartCardProps<T, P>) {
  const baseSuspenseKey = props.name + JSON.stringify(props.queryArgs);

  return (
    <Card className="flex h-fit w-full flex-col gap-3">
      <div className="flex flex-col">
        <TitlePopover title={props.name}>
          {props.popoverDescription}
        </TitlePopover>
        <Suspense
          fallback={<Skeleton className="h-[30px] w-[200px]" />}
          key={baseSuspenseKey + "values"}
        >
          <ChartValues {...props} />
        </Suspense>
      </div>
      <Suspense
        fallback={<Skeleton className="h-[200px] w-full" />}
        key={baseSuspenseKey + "chart"}
      >
        <ChartWrapper {...props} />
      </Suspense>
    </Card>
  );
}

async function ChartValues<T extends { timestamp: number }, P extends any[]>({
  query,
  queryArgs,
  dataKey,
  unit,
}: ChartCardProps<T, P>) {
  const data = await query(...queryArgs);

  if (!data || data.length == 0) {
    return null;
  }
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

async function ChartWrapper<T extends { timestamp: number }, P extends any[]>({
  query,
  queryArgs,
  dataKey,
  unit,
  ...props
}: ChartCardProps<T, P>) {
  const data = await query(...queryArgs);

  if (!data || data.length == 0) {
    return null;
  }

  return (
    <div className="h-[200px] w-full">
      <TimeSeriesChart data={data} dataKey={dataKey} unit={unit} {...props} />
    </div>
  );
}
