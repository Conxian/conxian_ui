/**
 * CoreContracts - Aligned with Conxian Backend (Clarinet.toml)
 * Last synced: January 2026
 * 
 * These contract IDs match the actual deployed contracts in the Conxian repo.
 * The base principal is configured per environment via NEXT_PUBLIC_CONTRACT_DEPLOYER.
 */

// Environment-specific deployer principals
const DEPLOYER_PRINCIPALS = {
  devnet: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  testnet: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ",
  mainnet: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS", // TODO: Update with actual mainnet deployer
} as const;

type NetworkType = keyof typeof DEPLOYER_PRINCIPALS;

// Determine current network from environment
const getNetwork = (): NetworkType => {
  const env = process.env.NEXT_PUBLIC_NETWORK || process.env.NODE_ENV;
  if (env === "production") return "mainnet";
  if (env === "testnet" || env === "test") return "testnet";
  return "devnet";
};

// Base principal - automatically configured per environment
export const NETWORK = getNetwork();
export const BASE_PRINCIPAL = 
  process.env.NEXT_PUBLIC_CONTRACT_DEPLOYER || DEPLOYER_PRINCIPALS[NETWORK];

export const CoreContracts = [
  // ============================================
  // SECURITY & MONITORING
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.circuit-breaker`,
    kind: "security",
    label: "Circuit Breaker",
  },
  {
    id: `${BASE_PRINCIPAL}.mev-protector`,
    kind: "security",
    label: "MEV Protector",
  },

  // ============================================
  // ORACLE
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.oracle-aggregator`,
    kind: "oracle",
    label: "Oracle Aggregator",
  },
  {
    id: `${BASE_PRINCIPAL}.points-oracle`,
    kind: "oracle",
    label: "Points Oracle",
  },
  {
    id: `${BASE_PRINCIPAL}.economic-policy-engine`,
    kind: "oracle",
    label: "Economic Policy Engine",
  },

  // ============================================
  // DEX & AMM
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.swap-manager`,
    kind: "dex",
    label: "Swap Manager",
  },
  {
    id: `${BASE_PRINCIPAL}.swap-router`,
    kind: "dex",
    label: "Swap Router",
  },
  {
    id: `${BASE_PRINCIPAL}.multi-hop-router-v3`,
    kind: "dex",
    label: "Multi-hop Router V3",
  },
  {
    id: `${BASE_PRINCIPAL}.liquidity-provider`,
    kind: "dex",
    label: "Liquidity Provider",
  },
  {
    id: `${BASE_PRINCIPAL}.pool-template`,
    kind: "dex",
    label: "Pool Template",
  },
  {
    id: `${BASE_PRINCIPAL}.vault`,
    kind: "vault",
    label: "Vault",
  },
  {
    id: `${BASE_PRINCIPAL}.dex-factory-v2`,
    kind: "dex",
    label: "DEX Factory V2",
  },

  // ============================================
  // TOKENS (SIP-010)
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.cxd-token`,
    kind: "token",
    label: "CXD Token",
    decimals: 6,
    symbol: "CXD",
  },
  {
    id: `${BASE_PRINCIPAL}.cxlp-token`,
    kind: "token",
    label: "CXLP Token",
    decimals: 6,
    symbol: "CXLP",
  },
  {
    id: `${BASE_PRINCIPAL}.cxvg-token`,
    kind: "token",
    label: "CXVG Governance Token",
    decimals: 6,
    symbol: "CXVG",
  },
  {
    id: `${BASE_PRINCIPAL}.cxs-token`,
    kind: "token",
    label: "CXS Staking Token",
    decimals: 6,
    symbol: "CXS",
  },
  {
    id: `${BASE_PRINCIPAL}.cxtr-token`,
    kind: "token",
    label: "CXTR Treasury Token",
    decimals: 6,
    symbol: "CXTR",
  },

  // ============================================
  // GOVERNANCE
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.cxd-staking`,
    kind: "governance",
    label: "CXD Staking",
  },
  {
    id: `${BASE_PRINCIPAL}.proposal-engine`,
    kind: "governance",
    label: "Proposal Engine",
  },
  {
    id: `${BASE_PRINCIPAL}.proposal-registry`,
    kind: "governance",
    label: "Proposal Registry",
  },
  {
    id: `${BASE_PRINCIPAL}.voting`,
    kind: "governance",
    label: "Voting",
  },
  {
    id: `${BASE_PRINCIPAL}.community-voting-engine`,
    kind: "governance",
    label: "Community Voting Engine",
  },
  {
    id: `${BASE_PRINCIPAL}.dao-treasury`,
    kind: "governance",
    label: "DAO Treasury",
  },
  {
    id: `${BASE_PRINCIPAL}.reputation-engine`,
    kind: "governance",
    label: "Reputation Engine",
  },

  // ============================================
  // CORE PROTOCOL
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.conxian-protocol`,
    kind: "core",
    label: "Conxian Protocol",
  },
  {
    id: `${BASE_PRINCIPAL}.conxian-access`,
    kind: "core",
    label: "Access Control (RBAC)",
  },
  {
    id: `${BASE_PRINCIPAL}.admin-facade`,
    kind: "core",
    label: "Admin Facade",
  },

  // ============================================
  // TREASURY & REVENUE
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.revenue-distributor`,
    kind: "treasury",
    label: "Revenue Distributor (60/20/20)",
  },
  {
    id: `${BASE_PRINCIPAL}.allocation-policy`,
    kind: "treasury",
    label: "Allocation Policy",
  },
  {
    id: `${BASE_PRINCIPAL}.operational-treasury`,
    kind: "treasury",
    label: "Operational Treasury",
  },

  // ============================================
  // DIMENSIONAL / POSITIONS
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.dimensional-core`,
    kind: "dimensional",
    label: "Dimensional Core",
  },
  {
    id: `${BASE_PRINCIPAL}.dimensional-engine`,
    kind: "dimensional",
    label: "Dimensional Engine",
  },
  {
    id: `${BASE_PRINCIPAL}.position-orchestrator`,
    kind: "dimensional",
    label: "Position Manager",
  },
  {
    id: `${BASE_PRINCIPAL}.collateral-orchestrator`,
    kind: "dimensional",
    label: "Collateral Manager",
  },
  {
    id: `${BASE_PRINCIPAL}.risk-unit`,
    kind: "core",
    label: "Risk Manager",
  },

  // ============================================
  // LENDING
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.lending-orchestrator`,
    kind: "lending",
    label: "Lending Manager",
  },

  // ============================================
  // AUTOMATION (Office Workers)
  // ============================================
  {
    id: `${BASE_PRINCIPAL}.office-orchestrator`,
    kind: "automation",
    label: "Office Manager",
  },
  {
    id: `${BASE_PRINCIPAL}.agent-risk`,
    kind: "automation",
    label: "Risk Agent",
  },
  {
    id: `${BASE_PRINCIPAL}.fiscal-orchestrator`,
    kind: "automation",
    label: "Treasury Agent",
  },
];

export const Tokens = CoreContracts.filter(c => c.kind === 'token');

export function explorerContractUrl(
  contractId: string,
  network: "devnet" | "testnet" | "mainnet"
): string {
  const baseUrl = `https://explorer.stacks.co/txid/${contractId}`;
  const params = network === "mainnet" ? "?chain=mainnet" : `?chain=testnet`;
  return baseUrl + params;
}
