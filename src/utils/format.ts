import { DataGranularity, Unit } from "./types";

export function formatNumber(
  input: number | bigint,
  unit?: Unit,
  maxSigFigs: number = 4,
): string {
  const style = unit == "$" ? "currency" : unit == "%" ? "percent" : "decimal";
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumSignificantDigits: maxSigFigs,
    style,
    currency: "USD",
  }).format(input);
}

export function formatTimestamp(
  timestamp: number,
  granularity: DataGranularity,
  full?: boolean,
): string {
  const date = new Date(timestamp * 1000);

  switch (granularity) {
    case "weekly":
      // MMM, YYYY and MMM DD, YYYY for full
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
        ...(full
          ? ({
              day: "numeric",
            } as Intl.DateTimeFormatOptions)
          : {}),
      }).format(date);

    case "daily":
      // MMM DD and MMM DD, YYYY for full
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        ...(full
          ? [
              {
                year: "numeric",
              } as Intl.DateTimeFormatOptions,
            ]
          : []),
      }).format(date);
    case "hourly":
      // MMM DD and MMM DD, YYYY MM:HH for full
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        ...(full
          ? [
              {
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              } as Intl.DateTimeFormatOptions,
            ]
          : []),
      }).format(date);
  }
}
