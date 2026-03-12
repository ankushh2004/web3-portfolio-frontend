"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { http } from "viem";
import { mainnet, sepolia, polygon } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],

  connectors: [injected({ target: "metaMask" })],

  transports: {
    [mainnet.id]: http(
      `${process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_RPC_URL}/${process.env.NEXT_PUBLIC_ALCHEMY_RPC_KEY}`,
    ),

    [sepolia.id]: http(
      `${process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_RPC_URL}/${process.env.NEXT_PUBLIC_ALCHEMY_RPC_KEY}`,
    ),
  },
});

// ------------------------------------

const queryClient = new QueryClient();

interface WagmiProviderProps {
  children: ReactNode;
}

const Provider = ({ children }: WagmiProviderProps) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default Provider;
