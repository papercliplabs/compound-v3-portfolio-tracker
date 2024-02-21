"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { http } from "viem";

const config = getDefaultConfig({
  appName: "Compound v3 Portfolio Tracker",
  projectId: "d6eee3c7568a60e86be82a1f3a728e5a",
  chains: [mainnet, arbitrum, base, polygon],
  transports: {
    [mainnet.id]: http(process.env.MAINNET_RPC_URL!),
    [arbitrum.id]: http(process.env.ARBITRUM_RPC_URL!),
    [base.id]: http(process.env.BASE_RPC_URL!),
    [polygon.id]: http(process.env.POLYGON_RPC_URL!),
  },
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
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
