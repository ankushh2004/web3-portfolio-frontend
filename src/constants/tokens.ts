
export interface TokenInterface {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
}

export const TOKENS: TokenInterface[] = [
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    decimals: 6,
  },
  {
    name: "Euro Coin",
    symbol: "EURC",
    address: "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4",
    decimals: 6,
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    decimals: 18,
  },
];
