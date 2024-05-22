export function bigIntAbs(num: bigint) {
  return num < BigInt(0) ? -num : num;
}
