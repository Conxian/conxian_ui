"use client";

import React from "react";
import { callReadOnly, ReadOnlyResponse } from "@/lib/core-api";
import { decodeResultHex, getTupleField, getUint } from "@/lib/clarity";
import { DexPools } from "@/lib/pools";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CpuChipIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const DEFAULT_SENDER = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export default function PoolsPage() {
  const [selected, setSelected] = React.useState(DexPools[0].id);
  const [reserves, setReserves] = React.useState<ReadOnlyResponse | null>(null);
  const [totalSupply, setTotalSupply] = React.useState<ReadOnlyResponse | null>(null);
  const [price, setPrice] = React.useState<ReadOnlyResponse | null>(null);
  const [feeInfo, setFeeInfo] = React.useState<ReadOnlyResponse | null>(null);
  const [perf, setPerf] = React.useState<ReadOnlyResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    const [contractAddress, contractName] = selected.split(".");
    try {
      const [r1, r2, r3, r4, r5] = await Promise.all([
        callReadOnly(contractAddress, contractName, "get-reserves", DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, "get-total-supply", DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, "get-price", DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, "get-fee-info", DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, "get-performance-metrics", DEFAULT_SENDER, []),
      ]);
      setReserves(r1);
      setTotalSupply(r2);
      setPrice(r3);
      setFeeInfo(r4);
      setPerf(r5);
    } catch (e) {
      console.error("Failed to fetch pool data", e);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      {/* Terminal Top Bar */}
      <div className="bg-ink text-background py-2 px-6 flex justify-between items-center border-b border-ghost">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Reserve Explorer</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>PARITY: 1.00</span>
          <span>QUORUM: OK</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase text-ink">RESERVES</h1>
              <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">On-Chain Asset Telemetry</p>
           </div>
           <div className="flex gap-4">
              <select
                className="bg-neutral-light border border-ghost rounded-sm px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] focus:ring-1 focus:ring-accent focus:outline-none text-ink"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {DexPools.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <Button onClick={refresh} disabled={loading} className="h-10 px-6 bg-ink text-background font-black uppercase tracking-[0.2em] text-[10px]">
                {loading ? "SYNCING..." : "REFRESH"}
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="machined-card">
            <div className="machined-header">
              <span>LIQUIDITY RESERVES</span>
              <CpuChipIcon className="w-3 h-3 opacity-50" />
            </div>
            <CardContent className="p-6">
              <div className="text-3xl font-black tabular-nums text-ink">
                {reserves?.ok ? JSON.stringify(decodeResultHex(reserves.result!)?.value || "0.00") : "0.00"}
              </div>
              <p className="text-[9px] text-ink/40 mt-3 font-black uppercase tracking-[0.2em]">
                Live Vault Balance: {selected.split(".")[1]}
              </p>
            </CardContent>
          </Card>

          <Card className="machined-card">
            <div className="machined-header">
              <span>TOTAL SUPPLY (LP)</span>
              <ChartBarIcon className="w-3 h-3 opacity-50" />
            </div>
            <CardContent className="p-6">
              <div className="text-3xl font-black tabular-nums text-ink">
                {totalSupply?.ok ? getUint(totalSupply.result!)?.toString() || "0.00" : "0.00"}
              </div>
              <p className="text-[9px] text-ink/40 mt-3 font-black uppercase tracking-[0.2em]">
                Active LP Tokens in Circulation
              </p>
            </CardContent>
          </Card>

          <Card className="machined-card">
            <div className="machined-header">
              <span>INTERNAL PRICE</span>
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            <CardContent className="p-6">
              <div className="text-3xl font-black tabular-nums text-ink">
                {price?.ok ? getUint(price.result!)?.toString() || "0.00" : "0.00"}
              </div>
              <p className="text-[9px] text-ink/40 mt-3 font-black uppercase tracking-[0.2em]">
                Current Pool Swap Ratio
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="machined-card">
          <div className="machined-header">
            <span>PROTOCOL PERFORMANCE & FEES</span>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-ink uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-1 w-4 bg-accent" />
                  Fee Configuration
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-ghost pb-2">
                    <span className="text-ink/40 font-black uppercase">Swap Fee</span>
                    <span className="text-ink font-black">
                      {feeInfo?.ok ? String(getTupleField(feeInfo.result!, "swap-fee") || "0") : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-ghost pb-2">
                    <span className="text-ink/40 font-black uppercase">Admin Fee</span>
                    <span className="text-ink font-black">
                      {feeInfo?.ok ? String(getTupleField(feeInfo.result!, "admin-fee") || "0") : "0"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-ink uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-1 w-4 bg-accent" />
                  Operational Status
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-ghost pb-2">
                    <span className="text-ink/40 font-black uppercase">Volume (24h)</span>
                    <span className="text-ink font-black">
                      {perf?.ok ? String(getTupleField(perf.result!, "volume-24h") || "0") : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-ghost pb-2">
                    <span className="text-ink/40 font-black uppercase">Utilization</span>
                    <span className="text-ink font-black text-success">
                      {perf?.ok ? String(getTupleField(perf.result!, "utilization") || "0%") : "0%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
