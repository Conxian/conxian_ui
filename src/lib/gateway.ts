export type GatewayStatus = {
  version: string;
  uptime_seconds: number;
  status: string;
  total_requests: number;
  total_tvl_usd: number;
  active_sovereign_nodes: number;
};

export type ReserveAsset = {
  asset: string;
  total_supplied: number;
  total_reserves: number;
  collateral_ratio: number;
  status: string;
};

export type PriceInfo = {
  asset: string;
  price_usd: number;
  last_updated: string;
  source: string;
};

export type GovernanceProposal = {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  ends_at: string;
  yes_votes: number;
  no_votes: number;
};

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export function getGatewayBaseUrl(): string {
  const url =
    process.env.CONXIAN_GATEWAY_URL ||
    process.env.NEXT_PUBLIC_CORE_API_URL ||
    "http://localhost:8080";
  return normalizeBaseUrl(url);
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) {
    throw new Error(`gateway-status=${r.status}`);
  }
  return (await r.json()) as T;
}

export async function getGatewayStatus(): Promise<GatewayStatus> {
  return fetchJson<GatewayStatus>(`${getGatewayBaseUrl()}/api/v1/status`);
}

export async function getGatewayReserves(): Promise<ReserveAsset[]> {
  return fetchJson<ReserveAsset[]>(`${getGatewayBaseUrl()}/api/v1/reserves`);
}

export async function getGatewayPrices(): Promise<Record<string, PriceInfo>> {
  return fetchJson<Record<string, PriceInfo>>(`${getGatewayBaseUrl()}/api/v1/prices`);
}

export async function getGovernanceProposals(): Promise<GovernanceProposal[]> {
  return fetchJson<GovernanceProposal[]>(`${getGatewayBaseUrl()}/api/v1/governance/proposals`);
}

export async function submitGovernanceVote(opts: {
  proposalId: string;
  voter: string;
  choice: "yes" | "no";
}): Promise<{ success: boolean; proposal?: GovernanceProposal; error?: string }> {
  const r = await fetch(`${getGatewayBaseUrl()}/api/v1/governance/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      proposal_id: opts.proposalId,
      voter: opts.voter,
      choice: opts.choice,
    }),
    cache: "no-store",
  });

  if (!r.ok) {
    throw new Error(`gateway-status=${r.status}`);
  }

  return (await r.json()) as { success: boolean; proposal?: GovernanceProposal; error?: string };
}
