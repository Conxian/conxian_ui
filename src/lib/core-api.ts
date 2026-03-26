import { AppConfig } from "./config";

export type CoreStatus = { ok: boolean; chain_id?: number; network_id?: string; error?: string };
export type MempoolTx = {
  tx_id: string;
  tx_type: string;
  sender_address?: string;
  nonce?: number;
};
export type AddressBalances = { stx?: { balance?: string } };
export type FungibleTokenBalance = { asset_identifier: string; balance: string };
export type ReadOnlyOk = { ok: true; result?: string; events?: unknown };
export type ReadOnlyErr = { ok: false; status?: number; error: string };
export type ReadOnlyResponse = ReadOnlyOk | ReadOnlyErr;

export type TxInfo = {
  tx_id?: string;
  tx_status?: string;
};

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_CORE_API_URL || AppConfig.coreApiUrl).replace(/\/$/, "");
}

export async function getStatus(): Promise<CoreStatus>{
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/status`, { cache: "no-store" });
    if (!r.ok) return { ok: false, error: `status=${r.status}` };
    const j = await r.json();
    return { ok: true, chain_id: j.chain_id, network_id: j.network_id };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "request-failed";
    return { ok: false, error: msg };
  }
}

export async function getV2Info(): Promise<{ burn_block_height?: number } | null> {
  try {
    const r = await fetch(`${baseUrl()}/v2/info`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function getNetworkBlockTimes(): Promise<unknown>{
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/info/network_block_times`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function getMempool(limit = 10): Promise<MempoolTx[]>{
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/tx/mempool?limit=${limit}`, { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j.results) ? (j.results as MempoolTx[]) : [];
  } catch {
    return [];
  }
}

export async function getAddressBalances(addr: string): Promise<AddressBalances | null> {
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/address/${addr}/balances`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json() as Promise<AddressBalances>;
  } catch {
    return null;
  }
}

export async function getFungibleTokenBalances(addr: string): Promise<FungibleTokenBalance[]>{
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/tokens/balances/${addr}`, { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j?.fungible_tokens) ? (j.fungible_tokens as FungibleTokenBalance[]) : [];
  } catch {
    return [];
  }
}

export async function getContractInterface(principal: string, name: string): Promise<unknown | null> {
  try {
    const r = await fetch(`${baseUrl()}/v2/contracts/interface/${principal}/${name}`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function getContractSource(principal: string, name: string): Promise<string | null> {
  try {
    const r = await fetch(`${baseUrl()}/v2/contracts/source/${principal}/${name}`, { cache: "no-store" });
    if (!r.ok) return null;
    const text = await r.text();
    try {
      const j = JSON.parse(text) as { source?: unknown };
      return typeof j?.source === "string" ? j.source : text;
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

export async function getTx(txId: string): Promise<TxInfo | null> {
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/tx/${txId}`, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as TxInfo;
  } catch {
    return null;
  }
}

export async function waitForTx(
  txId: string,
  opts?: { timeoutMs?: number; intervalMs?: number }
): Promise<TxInfo> {
  const timeoutMs = opts?.timeoutMs ?? 180000;
  const intervalMs = opts?.intervalMs ?? 4000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const tx = await getTx(txId);
    const status = tx?.tx_status;

    if (status === "success" && tx) return tx;
    if (typeof status === "string" && status !== "pending") {
      throw new Error(`tx_status=${status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("tx-timeout");
}

// Read-only contract call via Hiro API. Args must be hex-encoded Clarity values (0x...)
export async function callReadOnly(
  contractPrincipal: string,
  contractName: string,
  functionName: string,
  sender: string,
  argsHex: string[]
): Promise<ReadOnlyResponse> {
  try {
    const body = {
      sender,
      arguments: argsHex,
    };
    const r = await fetch(`${baseUrl()}/v2/contracts/call-read/${contractPrincipal}/${contractName}/${functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const j = (await r.json().catch(() => ({}))) as { result?: string; events?: unknown; error?: string };
    if (!r.ok) return { ok: false, status: r.status, error: j?.error || 'call-failed' };
    return { ok: true, result: j.result, events: j.events };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'request-failed';
    return { ok: false, error: msg };
  }
}
