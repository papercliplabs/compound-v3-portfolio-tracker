import { getNetworkConfig, SupportedNetwork } from "@/utils/configs";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import ARB from "@/image/token/ARB.svg";
import cbETH from "@/image/token/cbETH.svg";
import COMP from "@/image/token/COMP-dark.svg";
import ETH from "@/image/token/ETH.svg";
import LDO from "@/image/token/LDO.svg";
import LINK from "@/image/token/LINK.svg";
import MATIC from "@/image/token/MATIC.svg";
import MATICx from "@/image/token/MATICx.svg";
import OP from "@/image/token/OP.svg";
import rETH from "@/image/token/rETH.svg";
import UNI from "@/image/token/UNI.svg";
import USDC from "@/image/token/USDC.svg";
import USDT from "@/image/token/USDT.svg";
import WBTC from "@/image/token/WBTC.svg";
import wstMATIC from "@/image/token/wstMATIC.svg";

import unknown from "@/image/token/unknown.svg";

const TOKEN_ICONS: Record<string, StaticImport> = {
  ARB: ARB,
  cbETH: cbETH,
  COMP: COMP,
  ETH: ETH,
  WETH: ETH,
  LDO: LDO,
  stETH: LDO,
  wstETH: LDO,
  LINK: LINK,
  MATIC: MATIC,
  MATICx: MATICx,
  OP: OP,
  rETH: rETH,
  UNI: UNI,
  USDC: USDC,
  USDT: USDT,
  WBTC: WBTC,
  wstMATIC: wstMATIC,
};

interface TokenIconProps {
  symbol: string;
  network: SupportedNetwork;
  size: number;
  showNetworkIcon?: boolean;
}

export default function Token({
  symbol,
  network,
  size,
  showNetworkIcon,
}: TokenIconProps) {
  const tokenIcon = TOKEN_ICONS[symbol] ?? unknown;
  const networkConfig = getNetworkConfig(network);

  const networkIconPadding = size / 16;
  const networkIconSize = size / 2 + 2 * networkIconPadding;

  return (
    <div
      className="relative h-fit w-fit"
      style={{
        paddingRight: showNetworkIcon ? networkIconSize / 2 + "px" : "0",
        paddingBottom: showNetworkIcon ? networkIconPadding + "px" : "0",
      }}
    >
      <div
        className="relative h-fit w-fit"
        style={{ width: size + "px", height: size + "px" }}
      >
        <Image src={tokenIcon} fill alt={symbol} />
        {showNetworkIcon && (
          <Image
            src={networkConfig.icon}
            width={networkIconSize}
            height={networkIconSize}
            alt={networkConfig.chain.name}
            style={{
              padding: networkIconPadding + "px",
              transform: `translate(50%, ${networkIconPadding}px)`,
              borderRadius: networkIconSize / 4 + "px",
            }}
            className="bg-background-body absolute bottom-0 right-0 translate-x-1/2"
            priority
          />
        )}
      </div>
    </div>
  );
}
