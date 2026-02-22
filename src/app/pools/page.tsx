"use client";

import React from "react";
import { CoreContracts } from "@/lib/contracts";
import { callReadOnly, ReadOnlyResponse } from "@/lib/coreApi";
import { decodeResultHex, getTupleField, getUint } from "@/lib/clarity";

const DEFAULT_SENDER = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";

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
          "get-pool-performance",
          DEFAULT_SENDER,
          []
        ),
      ]);
      setReserves(r1);
      setTotalSupply(r2);
      setPrice(r3);
      setFeeInfo(r4);
      setPerf(r5);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pool Explorer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-xs block mb-1 text-text-secondary">Pool Contract</label>
              <select
                aria-label="Pool contract"
                className="flex h-10 w-full rounded-md border border-neutral-light bg-background-light px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {dexPools.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} — {c.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={refresh}
                disabled={loading || !selected}
                variant="outline"
                size="sm"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reserves</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto text-text-secondary">
                  {reserves ? JSON.stringify(reserves, null, 2) : "—"}
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto text-text-secondary">
                  {totalSupply ? JSON.stringify(totalSupply, null, 2) : "—"}
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto text-text-secondary">
                  {price ? JSON.stringify(price, null, 2) : "—"}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fee Info</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto text-text-secondary">
                  {feeInfo ? JSON.stringify(feeInfo, null, 2) : "—"}
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Derived KPIs</CardTitle>
              </CardHeader>
              <CardContent>
                <DerivedKPIs
                  reserves={reserves}
                  price={price}
                  feeInfo={feeInfo}
                  perf={perf}
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DerivedKPIs({
  reserves,
  price,
  feeInfo,
  perf,
}: {
  reserves: ReadOnlyResponse | null;
  price: ReadOnlyResponse | null;
  feeInfo: ReadOnlyResponse | null;
  perf: ReadOnlyResponse | null;
}) {
  const r =
    reserves && "result" in reserves ? decodeResultHex(reserves.result) : null;
  const p =
    price && "result" in price ? decodeResultHex(price.result) : null;
  const f =
    feeInfo && "result" in feeInfo ? decodeResultHex(feeInfo.result) : null;
  const pr =
    perf && "result" in perf ? decodeResultHex(perf.result) : null;

  const reserveAU = getUint(getTupleField(r?.value ?? null, "reserve-a"));
  const reserveBU = getUint(getTupleField(r?.value ?? null, "reserve-b"));
  const priceXYU = getUint(getTupleField(p?.value ?? null, "price-x-y"));
  const priceYXU = getUint(getTupleField(p?.value ?? null, "price-y-x"));
  const lpFeeBpsU = getUint(getTupleField(f?.value ?? null, "lp-fee-bps"));
  const protocolFeeBpsU = getUint(
    getTupleField(f?.value ?? null, "protocol-fee-bps")
  );
  const vol24hU = getUint(getTupleField(pr?.value ?? null, "volume-24h"));
  const fees24hU = getUint(getTupleField(pr?.value ?? null, "fees-24h"));

  const lpFeeBps = lpFeeBpsU !== null ? Number(lpFeeBpsU) : null;
  const protocolFeeBps =
    protocolFeeBpsU !== null ? Number(protocolFeeBpsU) : null;
  const totalFeeBps = (lpFeeBps ?? 0) + (protocolFeeBps ?? 0);
  const inventorySkew =
    reserveAU !== null && reserveBU !== null
      ? Number(reserveAU) / Math.max(1, Number(reserveBU))
      : null;
  // TVL in A-units: reserveA + reserveB converted via Y->X
  const tvlAUnits =
    reserveAU !== null && reserveBU !== null && priceYXU !== null
      ? Number(reserveAU) + (Number(reserveBU) * Number(priceYXU)) / 1
      : null;

  return (
    <div className="text-xs space-y-1 text-text-secondary">
      <div>
        <span className="font-medium text-text">LP Fee (bps):</span>{" "}
        {lpFeeBps ?? "—"}
      </div>
      <div>
        <span className="font-medium text-text">Protocol Fee (bps):</span>{" "}
        {protocolFeeBps ?? "—"}
      </div>
      <div>
        <span className="font-medium text-text">Total Fee (bps):</span>{" "}
        {Number.isFinite(totalFeeBps) ? totalFeeBps : "—"}
      </div>
      <div>
        <span className="font-medium text-text">Price X/Y:</span>{" "}
        {priceXYU !== null ? Number(priceXYU) : "—"}
      </div>
      <div>
        <span className="font-medium text-text">Price Y/X:</span>{" "}
        {priceYXU !== null ? Number(priceYXU) : "—"}
      </div>
      <div>
        <span className="font-medium text-text">Inventory Skew (A/B):</span>{" "}
        {inventorySkew !== null ? inventorySkew.toFixed(4) : "—"}
      </div>
      <div>
        <span className="font-medium text-text">Volume (24h):</span>{" "}
        {vol24hU !== null ? Number(vol24hU) : "—"}
      </div>
      <div>
        <span className="font-medium text-text">Fees (24h):</span>{" "}
        {fees24hU !== null ? Number(fees24hU) : "—"}
      </div>
      <div>
        <span className="font-medium text-text">TVL (A units):</span>{" "}
        {tvlAUnits !== null ? tvlAUnits.toFixed(2) : "—"}
      </div>
    </div>
  );
}
