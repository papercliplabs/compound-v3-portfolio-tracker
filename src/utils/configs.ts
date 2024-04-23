import { Chain, Client, createPublicClient, http } from "viem";
import { arbitrum, base, mainnet, polygon } from "viem/chains";

export type SupportedNetwork = "mainnet" | "polygon" | "base" | "arbitrum";

interface ChainConfig {
  chain: Chain;
  rpcUrl: { primary: string; fallback?: string };
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
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/AaFtUWKfFdj2x8nnE3RxTSJkHwGHvawH3VWFBykCGzLs`,
  },
  base: {
    chain: base,
    rpcUrl: {
      primary: process.env.BASE_RPC_URL!,
      fallback: undefined,
    },
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/2hcXhs36pTBDVUmk5K2Zkr6N4UYGwaHuco2a6jyTsijo`,
  },
  arbitrum: {
    chain: arbitrum,
    rpcUrl: {
      primary: process.env.ARBITRUM_RPC_URL!,
      fallback: undefined,
    },
    subgraphUrl: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.SUBGRAPH_API_KEY!}/subgraphs/id/Ff7ha9ELmpmg81D6nYxy4t8aGP26dPztqD1LDJNPqjLS`,
  },
};

export function getChainConfig(network: SupportedNetwork): ChainConfig {
  return CONFIGS[network];
}

export function getAllChainConfigs(): ChainConfig[] {
  return Object.keys(CONFIGS).map((key) => CONFIGS[key as SupportedNetwork]);
}
