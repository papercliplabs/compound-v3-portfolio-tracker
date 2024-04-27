"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  Chain,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { fallback, getAddress, http } from "viem";
import { getAllChainConfigs } from "@/utils/configs";
import AccountAvatar from "@/components/AccountAvatar";
import { Suspense } from "react";

const allConfigs = getAllChainConfigs();

const config = getDefaultConfig({
  appName: "Compound v3 Portfolio Tracker",
  projectId: "d6eee3c7568a60e86be82a1f3a728e5a",
  chains: allConfigs.map((config) => config.chain) as [Chain, ...Chain[]],
  transports: Object.fromEntries(
    allConfigs.map((config) => [
      config.chain.id,
      fallback([
        http(config.rpcUrl.primary),
        ...(config.rpcUrl.fallback ? [http(config.rpcUrl.fallback)] : []),
      ]),
    ]),
  ),
  ssr: true,
});

const queryClient = new QueryClient();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          avatar={({ address }) => (
            <AccountAvatar address={getAddress(address)} size="lg" />
          )}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// TODO: move elsewhere
// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};
