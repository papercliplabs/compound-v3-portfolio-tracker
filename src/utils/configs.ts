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

const CONFIGS: Record<SupportedNetwork, ChainConfig> = {
  mainnet: {
    chain: mainnet,
    rpcUrl: {
      primary: process.env.MAINNET_RPC_URL!,
      // fallback: "https://eth.llamarpc.com	",
    },
    icon: MainnetIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/Qma9vGcUHz6pUeRTcHzU64yuS4i4dBxKh3TKKrXY3ckNas`,
    // subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/5nwMCSHaTqG3Kd2gHznbTXEnZ9QNWsssQfbHhDqQSQFp`,
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
    // subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/AaFtUWKfFdj2x8nnE3RxTSJkHwGHvawH3VWFBykCGzLs`,
    // subgraphUrl: `https://api.thegraph.com/subgraphs/id/QmZ99VBAHWhZN3QcQoeBJ1hqehqCEpRzTzAgwN8Ry17DNB`, // From The Graph team
  },
  base: {
    chain: base,
    rpcUrl: {
      primary: process.env.BASE_RPC_URL!,
      fallback: undefined,
    },
    icon: BaseIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmRh4sEASxtLi2Ue1sTTmVGRZoNYCcqkc4e64uersku9Dr`,
    // subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/2hcXhs36pTBDVUmk5K2Zkr6N4UYGwaHuco2a6jyTsijo`,
  },
  arbitrum: {
    chain: arbitrum,
    rpcUrl: {
      primary: process.env.ARBITRUM_RPC_URL!,
      fallback: undefined,
    },
    icon: ArbitrumIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/Qmf9RaehDVfju5Qba2sSY3hdzA2Zwc7NW8dx5yG4wjEHor`,
    // subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/Ff7ha9ELmpmg81D6nYxy4t8aGP26dPztqD1LDJNPqjLS`,
  },
  optimism: {
    chain: optimism,
    rpcUrl: {
      primary: process.env.OPTIMISM_RPC_URL!,
      fallback: undefined,
    },
    icon: OptimismIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/deployments/id/QmQgSu3HHPD2NjKHVe4gmzzLzS9pnSDgrUhu4RiBpHuqJ1`,
    // subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/FhHNkfh5z6Z2WCEBxB6V3s8RPxnJfWZ9zAfM5bVvbvbb`,
  },
  scroll: {
    chain: scroll,
    rpcUrl: {
      primary: process.env.SCROLL_RPC_URL!,
      fallback: undefined,
    },
    icon: ScrollIcon,
    // subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/6aRGn6noEdin1krLfYTnLMYaCoTujL7cHekARE4Ndxng`,
    subgraphUrl: `https://api.thegraph.com/subgraphs/id/QmNUqEQXxmUp5jmsYTLVaLauMPpWL33x6UC7Lijg7VHkYP`, // From The Graph team
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
