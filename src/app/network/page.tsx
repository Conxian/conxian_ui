"use client";

import React from "react";
import {
  getStatus,
  getNetworkBlockTimes,
  getMempool,
  CoreStatus,
  MempoolTx,
} from "@/lib/core-api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { AppConfig } from "@/lib/config";

export default function NetworkPage() {
  const [status, setStatus] = React.useState<CoreStatus | null>(null);
  const [blocks, setBlocks] = React.useState<unknown | null>(null);
  const [mempool, setMempool] = React.useState<MempoolTx[]>([]);
  const [loading, setLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    const [s, b, m] = await Promise.all([
      getStatus(),
      getNetworkBlockTimes(),
      getMempool(15),
    ]);
    setStatus(s);
    setBlocks(b);
    setMempool(m || []);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-10 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text tracking-widest uppercase">Network</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Live telemetry from the Stacks network.
          </p>
        </div>
        <Button onClick={refresh} disabled={loading} variant="outline" size="sm">
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Environment</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1 text-text">
            <div>
              <span className="font-medium text-text">Core API:</span>{" "}
              {AppConfig.coreApiUrl}
            </div>
            <div>
              <span className="font-medium text-text">Network:</span>{" "}
              {AppConfig.network}
            </div>
            <div>
              <span className="font-medium text-text">Status:</span>{" "}
              {status?.ok
                ? `OK (chain_id=${status.chain_id}, network=${status.network_id})`
                : `Error ${status?.error || "unknown"}`}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Block Times</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto text-text">
              {blocks ? JSON.stringify(blocks, null, 2) : "No data"}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Mempool (latest)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tx ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Nonce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(mempool) &&
                mempool.map((tx: MempoolTx, idx: number) => (
                  <TableRow key={tx?.tx_id || `tx-${idx}`}>
                    <TableCell className="break-all">
                      {tx?.tx_id || "—"}
                    </TableCell>
                    <TableCell>{tx?.tx_type || "—"}</TableCell>
                    <TableCell className="break-all">
                      {tx?.sender_address || "—"}
                    </TableCell>
                    <TableCell>{tx?.nonce ?? "—"}</TableCell>
                  </TableRow>
                ))}
              {(!mempool || mempool.length === 0) && (
                <TableRow>
                  <TableCell className="py-4 text-center" colSpan={4}>
                    No transactions in mempool.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
