"use client";
import { Card } from "../ui/card";
import TimeSeriesChart, { TimeSeriesChartProps } from "./TimeSeriesChart";
import TitlePopover from "../TitlePopover";
import { Skeleton } from "../ui/skeleton";
import { ChartValue } from "./ChartValue";
import { BaseDataEntry } from "./types";
import { useQuery } from "@tanstack/react-query";

export interface ChartCardProps<
  DataEntry extends BaseDataEntry,
  P extends any[],
> extends Omit<TimeSeriesChartProps<DataEntry>, "data"> {
  name: string;
  popoverDescription: string;
  query: (...args: P) => Promise<DataEntry[] | undefined>;
  queryArgs: P;
}

export default function ChartCard<T extends BaseDataEntry, P extends any[]>({
  ...props
}: ChartCardProps<T, P>) {
  const result = useQuery({
    queryKey: [props.name, JSON.stringify(props.queryArgs)],
    queryFn: () => props.query(...props.queryArgs),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const loaded = !result.isLoading && result.data;

  return (
    <Card className="flex h-fit w-full flex-col gap-3">
      <div className="flex flex-col">
        <TitlePopover title={props.name}>
          {props.popoverDescription}
        </TitlePopover>
        {loaded ? (
          <ChartValue
            data={result.data!}
            dataKey={props.dataKey}
            unit={props.unit}
          />
        ) : (
          <Skeleton className="h-[28px] w-[80px]" />
        )}
      </div>

      <div className="h-[200px] w-full">
        {loaded ? (
          <TimeSeriesChart data={result.data!} {...props} />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>
    </Card>
  );
}
