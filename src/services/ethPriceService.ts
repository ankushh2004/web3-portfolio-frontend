export async function fetchEthPrice(): Promise<number> {
  const url = process.env.NEXT_PUBLIC_COINGECKO_URL;
  if (!url) {
    throw new Error("Missing Coingecko API URL in environment variables");
  }
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch ETH price (status ${res.status})`);
  }

  const data = await res.json();
  return data.ethereum.usd as number;
}
