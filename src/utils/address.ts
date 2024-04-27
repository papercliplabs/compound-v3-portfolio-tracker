import { Address } from "viem";

export function getLinearGradientForAddress(address: Address) {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  const number = Math.ceil(seed % 0xffffff);
  return `linear-gradient(45deg, #${number.toString(16).padStart(6, "0")}, #FFFFFF)`;
}

export function shortAddress(address: Address) {
  return address.slice(0, 6) + "..." + address.slice(address.length - 4);
}
