"use client";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { AT_RISK_HEALTH_FACTOR_THRESHOLD } from "@/utils/constants";
import { formatNumber } from "@/utils/format";
import GaugeComponent from "react-gauge-component";
import { Badge } from "../ui/badge";
import { Warning } from "@phosphor-icons/react/dist/ssr";

const GAUGE_MAX = 5;

export function HealthFactorGauge({ value }: { value: number }) {
  return (
    <div className="relative h-[240px] w-[240px] pl-2">
      <GaugeComponent
        marginInPercent={{ top: 0.05, bottom: 0.0, left: 0.05, right: 0.05 }}
        type="radial"
        arc={{
          gradient: true,
          cornerRadius: 9999,
          subArcs: [
            {
              limit: 0,
              color: "#CC3331",
            },
            {
              limit: 1.5,
              color: "#E4642E",
            },
            {
              limit: 3,
              color: "#FF9D2A",
            },
            {
              limit: GAUGE_MAX,
              color: "#00CD9C",
            },
          ],
        }}
        minValue={0}
        maxValue={GAUGE_MAX}
        value={Math.min(value, GAUGE_MAX)}
        pointer={{
          type: "blob",
          elastic: true,
          width: 30,
        }}
        labels={{
          valueLabel: {
            hide: true,
          },
          tickLabels: {
            type: "inner",
            ticks: Array(GAUGE_MAX)
              .fill(0)
              .map((_, i) => ({ value: i })),
            defaultTickLineConfig: {
              hide: true,
            },
            defaultTickValueConfig: {
              style: {
                fontSize: "12px",
                fontWeight: 500,
              },
            },
          },
        }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
        <h2>{formatNumber(value, undefined, 3)}</h2>
        {value < AT_RISK_HEALTH_FACTOR_THRESHOLD && (
          <Badge variant="warning" className="flex flex-row gap-1">
            <span>At Risk</span>
            <Warning size={14} weight="bold" />
          </Badge>
        )}
      </div>
    </div>
  );
}
