import { DataGranularity, TimeSelection } from "./types";

export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = 86400;
export const SECONDS_PER_WEEK = 604800;
export const SECONDS_PER_MONTH = 2600640;
export const SECONDS_PER_YEAR = 31207680;

export const GRANULARITY_FOR_TIME_SELECTOR: Record<
  TimeSelection,
  DataGranularity
> = {
  "7D": "hourly",
  "1M": "daily",
  "3M": "daily",
  "1Y": "weekly",
  MAX: "weekly",
};
