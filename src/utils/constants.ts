import { DataGranularity, TimeSelection } from "./types";

export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = 86400;
export const SECONDS_PER_WEEK = 604800;
export const SECONDS_PER_MONTH = 2600640;
export const SECONDS_PER_YEAR = 31207680;

export const DEMO_ADDRESS = "0xfe99cc4664a939f826dbeb545c1aad4c89ee737a";

export const DATA_FOR_TIME_SELECTOR: Record<
  TimeSelection,
  { granularity: DataGranularity; rangeS: number | undefined; name: string }
> = {
  "7D": {
    granularity: "hourly",
    rangeS: SECONDS_PER_WEEK,
    name: "Last 7 days",
  },
  "1M": {
    granularity: "daily",
    rangeS: SECONDS_PER_MONTH,
    name: "Last 1 month",
  },
  "3M": {
    granularity: "daily",
    rangeS: SECONDS_PER_MONTH * 3,
    name: "Last 3 months",
  },
  "1Y": {
    granularity: "weekly",
    rangeS: SECONDS_PER_YEAR,
    name: "Last 1 year",
  },
  MAX: { granularity: "weekly", rangeS: undefined, name: "All time" },
};

export const AT_RISK_HEALTH_FACTOR_THRESHOLD = 1.5;
