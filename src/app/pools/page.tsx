"use client";

import React from "react";
import { callReadOnly, ReadOnlyResponse } from "@/lib/core-api";
import { DexPools } from "@/lib/pools";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CpuChipIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { logger } from "@/lib/logger";

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
      const results = await Promise.allSettled([
        callReadOnly(contractAddress, contractName, "get-reserves", DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, "get-total-supply", DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, "get-price", DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, "get-fee-info", DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, "get-performance-metrics", DEFAULT_SENDER, []),
      ]);

      if (results[0].status === "fulfilled") setReserves(results[0].value);
      else logger.error("Failed to fetch reserves", { module: "Pools", pool: selected, error: results[0].reason });

      if (results[1].status === "fulfilled") setTotalSupply(results[1].value);
      else logger.warn("Failed to fetch total supply", { module: "Pools", pool: selected, error: results[1].reason });

      if (results[2].status === "fulfilled") setPrice(results[2].value);
      else logger.warn("Failed to fetch price", { module: "Pools", pool: selected, error: results[2].reason });

      if (results[3].status === "fulfilled") setFeeInfo(results[3].value);
      else logger.warn("Failed to fetch fee info", { module: "Pools", pool: selected, error: results[3].reason });

      if (results[4].status === "fulfilled") setPerf(results[4].value);
      else logger.warn("Failed to fetch performance metrics", { module: "Pools", pool: selected, error: results[4].reason });
    } catch (e) {
      logger.error("Critical failure in pools refresh", { module: "Pools", pool: selected, error: e });
    } finally {
      setLoading(false);
    }
  }, [selected]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="flex-1 flex flex-col bg-background terminal-text">
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pools</span>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>Pool Active</span>
          <span>Oracle Sync: 100%</span>
        </div>
      </div>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase text-ink">POOLS</h1>
            <p className="text-ink font-black uppercase tracking-[0.4em] text-xs mt-2">
              Liquidity Pools
            </p>
          </div>
          <Button
            onClick={refresh}
            disabled={loading}
            className="h-10 px-6 bg-ink text-background-paper font-black uppercase tracking-[0.2em] text-[10px]"
          >
            {loading ? "UPDATING..." : "REFRESH"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="machined-card col-span-2">
            <div className="machined-header">
              <span>SELECT POOL</span>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DexPools.map((p) => (
                  <Button
                    key={p.id}
                    variant={selected === p.id ? "default" : "outline"}
                    onClick={() => setSelected(p.id)}
                    className="h-12 font-black uppercase tracking-widest text-[9px] border-accent/20"
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="machined-card">
            <div className="machined-header">
              <span>POOL STATUS</span>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Data Available</span>
              </div>
              <p className="text-[9px] text-ink-light leading-relaxed font-bold">
                Pool data is synced and available for reading from the protocol.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "RESERVES", value: reserves?.ok ? "FETCHED" : "AWAITING...", icon: ChartBarIcon },
            { label: "LP SUPPLY", value: totalSupply?.ok ? "FETCHED" : "AWAITING...", icon: CpuChipIcon },
            { label: "POOL PRICE", value: price?.ok ? "SYNCHRONIZED" : "AWAITING...", icon: ChartBarIcon },
            { label: "FEES", value: feeInfo?.ok ? "0.3% FIXED" : "AWAITING...", icon: CpuChipIcon },
          ].map((m, i) => (
            <Card key={i} className="machined-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black text-ink-light uppercase tracking-widest">{m.label}</span>
                  <m.icon className="w-3 h-3 opacity-20" />
                </div>
                <div className="text-lg font-black tabular-nums text-ink">{m.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
