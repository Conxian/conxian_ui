export function getCoreApiUrl(): string {
  // Prefer public env (browser) then fallback to server env configured in next.config.ts
  return process.env.NEXT_PUBLIC_CORE_API_URL || "https://api.mainnet.hiro.so";
}

export function inferNetworkFromUrl(url: string): "devnet" | "testnet" | "mainnet" {
  const u = (url || "").toLowerCase();
  if (u.includes("localhost") || u.includes("127.0.0.1")) return "devnet";
  if (u.includes("testnet")) return "testnet";
  return "mainnet";
}

export const AppConfig = {
  coreApiUrl: getCoreApiUrl(),
  network: inferNetworkFromUrl(getCoreApiUrl()),
};
