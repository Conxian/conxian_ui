import { BASE_PRINCIPAL } from "./contracts";

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
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.conxian-labs.com",
  vaultUrl: process.env.NEXT_PUBLIC_VAULT_URL || "https://vault.conxian-labs.com",
  nexusUrl: process.env.NEXT_PUBLIC_NEXUS_URL || "https://nexus.conxian-labs.com",
  apiKey: process.env.NEXT_PUBLIC_CONXIAN_API_KEY || "",
  contracts: {
    router: `${BASE_PRINCIPAL}.swap-router`,
    factory: `${BASE_PRINCIPAL}.dex-factory-v2`,
    pool: `${BASE_PRINCIPAL}.pool-v2-stx-cxd`, // Default pool
  }
};
