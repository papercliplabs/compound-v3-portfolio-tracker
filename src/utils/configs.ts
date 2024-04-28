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

interface ChainConfig {
  chain: Chain;
  rpcUrl: { primary: string; fallback?: string };
  icon: StaticImport;
  subgraphUrl: string;
}

// TODO: add rpc url's ehre if we need
const CONFIGS: Record<SupportedNetwork, ChainConfig> = {
  mainnet: {
    chain: mainnet,
    rpcUrl: {
      primary: process.env.MAINNET_RPC_URL!,
      fallback: "https://eth.llamarpc.com	",
    },
    icon: MainnetIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/Qma9vGcUHz6pUeRTcHzU64yuS4i4dBxKh3TKKrXY3ckNas`,
    // subgraphUrl:
    //   "http://192.168.1.64:8000/subgraphs/name/papercliplabs/compound-v3-local",
  },
  polygon: {
    chain: polygon,
    rpcUrl: {
      primary: process.env.POLYGON_RPC_URL!,
      fallback: undefined,
    },
    icon: PolygonIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmZ99VBAHWhZN3QcQoeBJ1hqehqCEpRzTzAgwN8Ry17DNB`,
  },
  base: {
    chain: base,
    rpcUrl: {
      primary: process.env.BASE_RPC_URL!,
      fallback: undefined,
    },
    icon: BaseIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmRh4sEASxtLi2Ue1sTTmVGRZoNYCcqkc4e64uersku9Dr`,
  },
  arbitrum: {
    chain: arbitrum,
    rpcUrl: {
      primary: process.env.ARBITRUM_RPC_URL!,
      fallback: undefined,
    },
    icon: ArbitrumIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/Qmf9RaehDVfju5Qba2sSY3hdzA2Zwc7NW8dx5yG4wjEHor`,
  },
  optimism: {
    chain: optimism,
    rpcUrl: {
      primary: process.env.OPTIMISM_RPC_URL!,
      fallback: undefined,
    },
    icon: OptimismIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmQgSu3HHPD2NjKHVe4gmzzLzS9pnSDgrUhu4RiBpHuqJ1`,
  },
  scroll: {
    chain: scroll,
    rpcUrl: {
      primary: process.env.SCROLL_RPC_URL!,
      fallback: undefined,
    },
    icon: ScrollIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/6aRGn6noEdin1krLfYTnLMYaCoTujL7cHekARE4Ndxng`,
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
