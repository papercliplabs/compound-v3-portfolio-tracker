"use client";
import { useScreenSize } from "@/hooks/useScreenSize";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { DATA_FOR_TIME_SELECTOR } from "@/utils/constants";
import { extractNestedValue } from "@/utils/extractNestedValue";
import { formatNumber, formatTimestamp } from "@/utils/format";
import { NestedKeyOf, TimeSelection, Unit } from "@/utils/types";
import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BaseDataEntry } from "./types";

const NUM_X_AXIS_TICKS_LG = 5;
const NUM_X_AXIS_TICKS_SM = 3;

export interface TimeSeriesChartProps<DataEntry extends BaseDataEntry> {
  data: DataEntry[];
  dataKey: NestedKeyOf<DataEntry>;
  timeSelection: TimeSelection;
  unit?: Unit;
  showAverage?: boolean;
  style: {
    lineColor: string;
    areaGradient: boolean;
  };
}

export default function TimeSeriesChart<DataEntry extends BaseDataEntry>({
  data,
  dataKey,
  timeSelection,
  unit,
  showAverage,
  style,
}: TimeSeriesChartProps<DataEntry>) {
  const screenSize = useScreenSize();

  const numXAxisTicks = useMemo(() => {
    return screenSize == "lg" ? NUM_X_AXIS_TICKS_LG : NUM_X_AXIS_TICKS_SM;
  }, [screenSize]);

  const timeSelectorData = useMemo(
    () => DATA_FOR_TIME_SELECTOR[timeSelection],
    [timeSelection],
  );

  const { valuesWithinRange, xAxisDomainMin, yAxisDomainMin, yAxisDomainMax } =
    useMemo(() => {
      const minTimestamp = data[0].timestamp;

      const xAxisDomainMin = timeSelectorData.rangeS
        ? Math.max(
            Math.floor(Date.now() / 1000) - timeSelectorData.rangeS,
            minTimestamp,
          )
        : minTimestamp;

      const valuesWithinRange = data
        .filter((d) => d.timestamp >= xAxisDomainMin)
        .map((d) => extractNestedValue<number>(d, dataKey));

      const yAxisDomainMin = Math.min(...valuesWithinRange);
      const yAxisDomainMax = Math.max(...valuesWithinRange);

      const yRange = yAxisDomainMax - yAxisDomainMin;

      return {
        valuesWithinRange,
        xAxisDomainMin,

        // Add a bit more margin to avoid cutting off lines around the top and bottom
        yAxisDomainMin: yAxisDomainMin - yRange * 0.02,
        yAxisDomainMax: yAxisDomainMax + yRange * 0.02,
      };
    }, [data, timeSelectorData.rangeS, dataKey]);

  const average = useMemo(() => {
    const sum = valuesWithinRange.reduce((sum, val) => sum + val, 0);
    return sum / valuesWithinRange.length;
  }, [valuesWithinRange]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ right: 15 }}>
        <defs>
          <linearGradient
            id={`color-${style.lineColor}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={style.lineColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={style.lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray={4} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(t) =>
            formatTimestamp(t as number, timeSelectorData.granularity)
          }
          domain={[xAxisDomainMin, "dataMax"]}
          ticks={getXTicks(data, numXAxisTicks, xAxisDomainMin)}
          type="number"
          tickLine={false}
          tickMargin={10}
          allowDataOverflow={true}
          stroke={tailwindFullTheme.theme.colors.content.secondary}
        />
        <YAxis
          orientation="right"
          axisLine={false}
          tickLine={false}
          domain={[yAxisDomainMin, yAxisDomainMax]}
          allowDataOverflow={true}
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
          fill={
            style.areaGradient ? `url(#color-${style.lineColor})` : "#00000000"
          }
          baseValue={yAxisDomainMin}
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
            formatTimestamp(label as number, timeSelectorData.granularity, true)
          }
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${tailwindFullTheme.theme.colors.border.primary}`,
            boxShadow: tailwindFullTheme.theme.boxShadow[1],
          }}
        />
        {showAverage && (
          <ReferenceLine
            y={average}
            stroke={tailwindFullTheme.theme.colors.content.secondary}
            strokeWidth={1}
            className="bg-red-500"
            label={(props: any) => {
              const lineY = props["viewBox"]["y"] as number;
              return (
                <foreignObject
                  x={10}
                  y={lineY > 50 ? lineY - 40 : lineY + 10}
                  width={1}
                  height={1}
                  overflow="visible"
                >
                  <div className="text-content-primary bg-background-surface shadow-2 flex h-fit w-fit flex-row  items-center justify-center whitespace-nowrap rounded-md px-2 py-1 font-semibold">
                    AVG {formatNumber(average, unit, 2)}
                  </div>
                </foreignObject>
              );
            }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function getXTicks<DataEntry extends { timestamp: number }>(
  data: DataEntry[],
  numTicks: number,
  xAxisDomainStartS: number,
) {
  const filteredData = data.filter((d) => d.timestamp > xAxisDomainStartS);
  const gap = filteredData.length / numTicks;
  return Array(numTicks)
    .fill(0)
    .map((_, i) => {
      const index = Math.floor(gap / 2 + gap * i);
      return filteredData[index]["timestamp"];
    });
}
