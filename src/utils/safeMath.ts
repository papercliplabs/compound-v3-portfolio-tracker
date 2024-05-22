export function safeDiv<T extends number | bigint>(
  numerator: T,
  denominator: T,
): T {
  if (denominator === 0 || denominator === BigInt(0)) {
    return (typeof numerator === "bigint" ? BigInt(0) : 0) as T;
  }

  return (numerator / denominator) as T;
}
