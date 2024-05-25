"use client";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";
import { formatNumber } from "@/utils/format";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { AugmentedCollateralDataEntry } from ".";

interface CollateralPieChartProps {
  data: AugmentedCollateralDataEntry[];
}

export function CollateralPieChart({ data }: CollateralPieChartProps) {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%" className="p-[6px] ">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="100%"
            innerRadius="75%"
            dataKey="balanceUsd"
            nameKey="assetSymbol"
            rootTabIndex={-1}
            className="outline-none"
          >
            {data.map((entry, i) => {
              return (
                <Cell
                  key={`cell-${i}`}
                  fill={entry.color}
                  tabIndex={-1}
                  className="outline-none"
                />
              );
            })}
            <Label
              content={() => {
                return (
                  <foreignObject
                    x="50%"
                    y="50%"
                    width="1"
                    height="1"
                    overflow="visible"
                    className="absolute"
                  >
                    <div className="relative left-1/2 top-1/2 flex h-fit w-[250px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center  text-center">
                      <h2>
                        {formatNumber(
                          data.reduce((acc, d) => acc + d.balanceUsd, 0),
                          "$",
                        )}
                      </h2>
                      <span className="text-caption-md text-content-secondary font-semibold">
                        Total Collateral
                      </span>
                    </div>
                  </foreignObject>
                );
              }}
              position="center"
            />
          </Pie>
          <Tooltip
            labelFormatter={(label) => (
              <div className="text-caption-md text-content-primary font-semibold">
                {label}
              </div>
            )}
            formatter={(value) => (
              <div className="text-caption-md text-content-secondary font-semibold">
                {formatNumber(value as number, "$")}
              </div>
            )}
            separator=""
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${tailwindFullTheme.theme.colors.border.primary}`,
              boxShadow: tailwindFullTheme.theme.boxShadow[1],
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
