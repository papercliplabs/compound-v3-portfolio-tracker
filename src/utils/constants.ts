import { DataGranularity, TimeSelection } from "./types";

export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = 86400;
export const SECONDS_PER_WEEK = 604800;
export const SECONDS_PER_MONTH = 2600640;
export const SECONDS_PER_YEAR = 31207680;

export const DATA_FOR_TIME_SELECTOR: Record<
  TimeSelection,
  { granularity: DataGranularity; rangeS: number | undefined }
> = {
  "7D": { granularity: "hourly", rangeS: SECONDS_PER_WEEK },
  "1M": { granularity: "daily", rangeS: SECONDS_PER_MONTH },
  "3M": { granularity: "daily", rangeS: SECONDS_PER_MONTH * 3 },
  "1Y": { granularity: "weekly", rangeS: SECONDS_PER_YEAR },
  MAX: { granularity: "weekly", rangeS: undefined },
};

export const AT_RISK_HEALTH_FACTOR_THRESHOLD = 1.5;
