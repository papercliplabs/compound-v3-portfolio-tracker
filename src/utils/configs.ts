import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Chain, Client, createPublicClient, http } from "viem";
import { arbitrum, base, mainnet, polygon } from "viem/chains";

import MainnetIcon from "@/image/network/mainnet.svg";
import PolygonIcon from "@/image/network/polygon.svg";
import BaseIcon from "@/image/network/base.svg";
import ArbitrumIcon from "@/image/network/arbitrum.svg";

export type SupportedNetwork = "mainnet" | "polygon" | "base" | "arbitrum";

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
      fallback: undefined,
    },
    icon: MainnetIcon,
    // subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/5nwMCSHaTqG3Kd2gHznbTXEnZ9QNWsssQfbHhDqQSQFp`,
    subgraphUrl:
      "http://192.168.1.64:8000/subgraphs/name/papercliplabs/compound-v3-local",
  },
  polygon: {
    chain: polygon,
    rpcUrl: {
      primary: process.env.POLYGON_RPC_URL!,
      fallback: undefined,
    },
    icon: PolygonIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/AaFtUWKfFdj2x8nnE3RxTSJkHwGHvawH3VWFBykCGzLs`,
  },
  base: {
    chain: base,
    rpcUrl: {
      primary: process.env.BASE_RPC_URL!,
      fallback: undefined,
    },
    icon: BaseIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/2hcXhs36pTBDVUmk5K2Zkr6N4UYGwaHuco2a6jyTsijo`,
  },
  arbitrum: {
    chain: arbitrum,
    rpcUrl: {
      primary: process.env.ARBITRUM_RPC_URL!,
      fallback: undefined,
    },
    icon: ArbitrumIcon,
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/Ff7ha9ELmpmg81D6nYxy4t8aGP26dPztqD1LDJNPqjLS`,
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
