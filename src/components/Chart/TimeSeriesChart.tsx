"use client";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { formatNumber, formatTimestamp } from "@/utils/format";
import { DataGranularity, NestedKeyOf, Unit } from "@/utils/types";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NUM_X_AXIS_TICKS = 5;

export interface TimeSeriesChartProps<DataEntry extends { timestamp: number }> {
  data: DataEntry[];
  dataKey: NestedKeyOf<DataEntry>;
  granularity: DataGranularity;
  unit?: Unit;
  style: {
    lineColor: string;
    areaGradient: boolean;
  };
}

export default function TimeSeriesChart<T extends { timestamp: number }>({
  data,
  dataKey,
  granularity,
  unit,
  style,
}: TimeSeriesChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ right: 0 }}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={style.lineColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={style.lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray={4} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(t) => formatTimestamp(t as number, granularity)}
          domain={["dataMin", "dataMax"]}
          ticks={getXTicks(data)}
          type="number"
          tickLine={false}
          tickMargin={10}
          stroke={tailwindFullTheme.theme.colors.content.secondary}
        />
        <YAxis
          orientation="right"
          axisLine={false}
          tickLine={false}
          tickMargin={4}
          tickFormatter={(v) => formatNumber(v, unit)}
          tickCount={4}
          stroke={tailwindFullTheme.theme.colors.content.secondary}
        />
        <Area
          type="monotone"
          dataKey={dataKey as string}
          stroke={style.lineColor}
          strokeWidth={2}
          fillOpacity={1}
          fill={style.areaGradient ? "url(#color)" : "#00000000"}
        />
        <Tooltip
          position={{ y: 0 }} // Set to the top of chart
          cursor={{
            stroke: tailwindFullTheme.theme.colors.content.primary,
            strokeWidth: 2,
            strokeDasharray: 4,
          }}
          formatter={(value) => [formatNumber(value as number, unit)]}
          labelFormatter={(label) =>
            formatTimestamp(label as number, granularity, true)
          }
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${tailwindFullTheme.theme.colors.border.primary}`,
            boxShadow: tailwindFullTheme.theme.boxShadow[1],
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function getXTicks<DataEntry extends { timestamp: number }>(data: DataEntry[]) {
  const gap = data.length / NUM_X_AXIS_TICKS;
  return Array(NUM_X_AXIS_TICKS)
    .fill(0)
    .map((_, i) => {
      const index = Math.floor(gap / 2 + gap * i);
      return data[index]["timestamp"];
    });
}
