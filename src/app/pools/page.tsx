"use client";

import React from "react";
import { CoreContracts, BASE_PRINCIPAL } from "@/lib/contracts";
import { callReadOnly, ReadOnlyResponse } from "@/lib/core-api";
import { decodeResultHex, getTupleField, getUint } from "@/lib/clarity";

const DEFAULT_SENDER = BASE_PRINCIPAL;

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PoolsPage() {
  const dexPools = CoreContracts.filter((c) => c.kind === "dex");
  const [selected, setSelected] = React.useState<string>(dexPools[0]?.id || "");
  const [loading, setLoading] = React.useState(false);

  const [reserves, setReserves] = React.useState<ReadOnlyResponse | null>(null);
  const [totalSupply, setTotalSupply] =
    React.useState<ReadOnlyResponse | null>(null);
  const [price, setPrice] = React.useState<ReadOnlyResponse | null>(null);
  const [feeInfo, setFeeInfo] = React.useState<ReadOnlyResponse | null>(null);
  const [perf, setPerf] = React.useState<ReadOnlyResponse | null>(null);

  const refresh = React.useCallback(async () => {
    if (!selected) return;
    const [contractAddress, contractName] = selected.split(".") as [
      string,
      string,
    ];
    setLoading(true);
    try {
      const [r1, r2, r3, r4, r5] = await Promise.all([
        callReadOnly(
          contractAddress,
          contractName,
          "get-reserves",
          DEFAULT_SENDER,
          []
        ),
        callReadOnly(
          contractAddress,
          contractName,
          "get-total-supply",
          DEFAULT_SENDER,
          []
        ),
        callReadOnly(
          contractAddress,
          contractName,
          "get-price",
          DEFAULT_SENDER,
          []
        ),
        callReadOnly(
          contractAddress,
          contractName,
          "get-fee-info",
          DEFAULT_SENDER,
          []
        ),
        callReadOnly(
          contractAddress,
          contractName,
          "get-performance-metrics",
          DEFAULT_SENDER,
          []
        ),
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
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Pools Explorer
          </h1>
          <p className="text-text-secondary">
            On-chain telemetry for Conxian liquidity pools.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="bg-background-paper border border-accent/20 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {dexPools.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <Button onClick={refresh} disabled={loading}>
            {loading ? "Syncing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Liquidity Reserves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {reserves?.ok ? decodeResultHex(reserves.result!) : "0.00"}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Live vault balance for {selected.split(".")[1]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Total Supply (LP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {totalSupply?.ok ? getUint(totalSupply.result!) : "0.00"}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Active LP tokens in circulation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Internal Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {price?.ok ? getUint(price.result!) : "0.00"}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Current pool swap ratio
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Protocol Performance & Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Fee Configuration
              </h3>
              <div className="space-y-2 border-l-2 border-accent/20 pl-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Swap Fee</span>
                  <span className="font-mono">
                    {feeInfo?.ok ? getTupleField(feeInfo.result!, "swap-fee") : "0"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Admin Fee</span>
                  <span className="font-mono">
                    {feeInfo?.ok ? getTupleField(feeInfo.result!, "admin-fee") : "0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Operational Status
              </h3>
              <div className="space-y-2 border-l-2 border-accent/20 pl-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Volume (24h)</span>
                  <span className="font-mono">
                    {perf?.ok ? getTupleField(perf.result!, "volume-24h") : "0"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Utilization</span>
                  <span className="font-mono">
                    {perf?.ok ? getTupleField(perf.result!, "utilization") : "0%"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
