"use client";
import { Card } from "../ui/card";
import TimeSeriesChart, { TimeSeriesChartProps } from "./TimeSeriesChart";
import TitlePopover from "../TitlePopover";
import { Skeleton } from "../ui/skeleton";
import { ChartValue } from "./ChartValue";
import { BaseDataEntry } from "./types";
import { useQuery } from "@tanstack/react-query";
import { NestedKeyOf } from "@/utils/types";
import { useMemo, useState } from "react";
import { Switch } from "../ui/switch";

export interface ChartCardToggleProps<
  DataEntry extends BaseDataEntry,
  P extends any[],
> extends Omit<TimeSeriesChartProps<DataEntry>, "data" | "dataKey"> {
  name: string;
  popoverDescription: string;
  query: (...args: P) => Promise<DataEntry[] | undefined>;
  queryArgs: P;
  toggleName: string;
  togglePopoverDescription: string;
  dataKeyToggleOn: NestedKeyOf<DataEntry>;
  dataKeyToggleOff: NestedKeyOf<DataEntry>;
}

export default function ToggleChartCard<
  T extends BaseDataEntry,
  P extends any[],
>({
  name,
  popoverDescription,
  toggleName,
  togglePopoverDescription,
  dataKeyToggleOn,
  dataKeyToggleOff,
  ...props
}: ChartCardToggleProps<T, P>) {
  const result = useQuery({
    queryKey: [name, JSON.stringify(props.queryArgs)],
    queryFn: () => props.query(...props.queryArgs),
    staleTime: 1000 * 60 * 5, // 5 min
  });
  const loaded = !result.isLoading && result.data;

  const [toggleOn, setToggleOn] = useState<boolean>(true);

  const dataKey = useMemo(() => {
    return toggleOn ? dataKeyToggleOn : dataKeyToggleOff;
  }, [dataKeyToggleOn, dataKeyToggleOff, toggleOn]);

  return (
    <Card className="flex h-fit w-full flex-col gap-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <TitlePopover title={name}>{popoverDescription}</TitlePopover>
          {loaded ? (
            <ChartValue
              data={result.data!}
              dataKey={dataKey}
              unit={props.unit}
            />
          ) : (
            <Skeleton className="h-[28px] w-[80px]" />
          )}
        </div>
        <div className="justify-center-center flex h-fit flex-row items-center gap-1.5 pr-4 text-center">
          <TitlePopover title={toggleName}>
            {togglePopoverDescription}
          </TitlePopover>
          <Switch
            checked={toggleOn}
            onCheckedChange={setToggleOn}
            className="mb-1"
          />
        </div>
      </div>

      <div className="h-[200px] w-full">
        {loaded ? (
          <TimeSeriesChart data={result.data!} dataKey={dataKey} {...props} />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>
    </Card>
  );
}
