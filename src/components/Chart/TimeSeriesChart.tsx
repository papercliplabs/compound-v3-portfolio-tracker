"use client";
import { DataGranularity } from "@/utils/types";
import { ComposedChart, Line, ResponsiveContainer, XAxis } from "recharts";

interface BaseChartProps<DataEntry> {
  data: DataEntry[];
  dataKey: keyof DataEntry;
  granularity: DataGranularity;
}

export default function TimeSeriesChart<T>({
  data,
  dataKey,
  granularity,
}: BaseChartProps<T>) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(t) => formatTimestamp(t as number, granularity)}
          />
          <Line
            type="monotone"
            name={dataKey as string}
            dataKey={dataKey as string}
            stroke="#8884d8"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatTimestamp(
  timestamp: number,
  granularity: DataGranularity,
): string {
  // new Date(t * 1000).getMonth().toString()

  return "";
}
