"use client";

import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";
import WagmiProvider from "@/lib/wagmi";
import { ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  return (
    <ReduxProvider store={store}>
      <WagmiProvider>{children}</WagmiProvider>
    </ReduxProvider>
  );
};
export default Provider;
