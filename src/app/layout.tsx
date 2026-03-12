import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Provider from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ChainBoard — On-Chain Portfolio Manager",
  description: "Track tokens, manage vaults, and monitor activity on-chain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Provider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
            }}
          />
        </Provider>
      </body>
    </html>
  );
}
