export function bigIntSafeDiv(num: bigint, denom: bigint) {
  return denom != BigInt(0) ? num / denom : BigInt(0);
}

export function bigIntAbs(num: bigint) {
  return num < BigInt(0) ? -num : num;
}
