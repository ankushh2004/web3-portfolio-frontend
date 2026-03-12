import { TOKENS } from "@/constants/tokens";

export type TokenPrices = Record<string, { USD: number }>;

const BASE_URL = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_URL;
const API_KEY = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;

const tokenSymbols = ["ETH", ...TOKENS.map((token) => token.symbol)].join(",");

export async function fetchTokenPrices(): Promise<TokenPrices> {
  if (!BASE_URL) {
    throw new Error("CryptoCompare base URL is not defined");
  }

  const url = `${BASE_URL}/data/pricemulti?fsyms=${tokenSymbols}&tsyms=USD&api_key=${API_KEY}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`CryptoCompare request failed: ${res.status}`);
    }

    const data: TokenPrices = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    throw new Error("Failed to fetch token prices");
  }
}
