import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Chain } from "viem";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  scroll,
} from "viem/chains";

import MainnetIcon from "@/image/network/mainnet.svg";
import PolygonIcon from "@/image/network/polygon.svg";
import BaseIcon from "@/image/network/base.svg";
import ArbitrumIcon from "@/image/network/arbitrum.svg";
import OptimismIcon from "@/image/network/optimism.svg";
import ScrollIcon from "@/image/network/scroll.svg";

export type SupportedNetwork =
  | "mainnet"
  | "polygon"
  | "base"
  | "arbitrum"
  | "optimism"
  | "scroll";

export interface UrlWithFallback {
  primary: string;
  fallback?: string;
}

interface ChainConfig {
  chain: Chain;
  rpcUrl: UrlWithFallback;
  icon: StaticImport;
  subgraphUrl: UrlWithFallback;
}

const CONFIGS: Record<SupportedNetwork, ChainConfig> = {
  mainnet: {
    chain: mainnet,
    rpcUrl: {
      primary: process.env.MAINNET_RPC_URL!,
      // fallback: "https://eth.llamarpc.com	",
    },
    icon: MainnetIcon,
    subgraphUrl: {
      primary: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/Qma9vGcUHz6pUeRTcHzU64yuS4i4dBxKh3TKKrXY3ckNas`,
      fallback:
        "https://api.studio.thegraph.com/query/35078/compound-v3-mainnet/v1.0.0",
    },
  },
  polygon: {
    chain: polygon,
    rpcUrl: {
      primary: process.env.POLYGON_RPC_URL!,
      fallback: undefined,
    },
    icon: PolygonIcon,
    subgraphUrl: {
      primary: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmZ99VBAHWhZN3QcQoeBJ1hqehqCEpRzTzAgwN8Ry17DNB`,
      fallback:
        "https://api.studio.thegraph.com/query/35078/compound-v3-polygon/v1.0.0",
    },
  },
  base: {
    chain: base,
    rpcUrl: {
      primary: process.env.BASE_RPC_URL!,
      fallback: undefined,
    },
    icon: BaseIcon,
    subgraphUrl: {
      primary: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmRh4sEASxtLi2Ue1sTTmVGRZoNYCcqkc4e64uersku9Dr`,
      fallback:
        "https://api.studio.thegraph.com/query/35078/compound-v3-base/v1.0.0",
    },
  },
  arbitrum: {
    chain: arbitrum,
    rpcUrl: {
      primary: process.env.ARBITRUM_RPC_URL!,
      fallback: undefined,
    },
    icon: ArbitrumIcon,
    subgraphUrl: {
      primary: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/Qmf9RaehDVfju5Qba2sSY3hdzA2Zwc7NW8dx5yG4wjEHor`,
      fallback:
        "https://api.studio.thegraph.com/query/35078/compound-v3-arbitrum/v1.0.0",
    },
  },
  optimism: {
    chain: optimism,
    rpcUrl: {
      primary: process.env.OPTIMISM_RPC_URL!,
      fallback: undefined,
    },
    icon: OptimismIcon,
    subgraphUrl: {
      primary: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmQgSu3HHPD2NjKHVe4gmzzLzS9pnSDgrUhu4RiBpHuqJ1`,
      fallback:
        "https://api.studio.thegraph.com/query/35078/compound-v3-optimism/v1.0.0",
    },
  },
  scroll: {
    chain: scroll,
    rpcUrl: {
      primary: process.env.SCROLL_RPC_URL!,
      fallback: undefined,
    },
    icon: ScrollIcon,
    subgraphUrl: {
      primary: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmNUqEQXxmUp5jmsYTLVaLauMPpWL33x6UC7Lijg7VHkYP`,
      fallback:
        "https://api.studio.thegraph.com/query/35078/compound-v3-scroll/v1.0.0",
    },
  },
};

export function getNetworkConfig(network: SupportedNetwork): ChainConfig {
  return CONFIGS[network];
}

export function getAllChainConfigs(): ChainConfig[] {
  return Object.keys(CONFIGS).map((key) => CONFIGS[key as SupportedNetwork]);
}

export function getSupportedNetworks(): SupportedNetwork[] {
  return Object.keys(CONFIGS).map((key) => key as SupportedNetwork);
}
