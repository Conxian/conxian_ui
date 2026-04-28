"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  getStatus,
  getNetworkBlockTimes,
  getMempool,
  CoreStatus,
  MempoolTx,
} from "@/lib/core-api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { AppConfig } from "@/lib/config";
import { CpuChipIcon, GlobeAltIcon, BoltIcon } from "@heroicons/react/24/outline";

export default function NetworkPage() {
  const [status, setStatus] = useState<CoreStatus | null>(null);
  const [blocks, setBlocks] = useState<unknown | null>(null);
  const [mempool, setMempool] = useState<MempoolTx[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [s, b, m] = await Promise.all([
        getStatus(),
        getNetworkBlockTimes(),
        getMempool(20),
      ]);
      setStatus(s);
      setBlocks(b);
      setMempool(m || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      <div className="bg-ink text-background py-2 px-6 flex justify-between items-center border-b border-ghost">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network Topology Telemetry</span>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <span>PROTO: STACKS_v2</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase text-ink">TELEMETRY</h1>
              <p className="text-accent font-bold uppercase tracking-[0.4em] text-xs mt-2">Real-Time Chain State Analysis</p>
           </div>
           <Button onClick={refresh} disabled={loading} className="h-10 px-6 bg-ink text-background font-black uppercase tracking-widest text-[10px]">
              {loading ? "SYNCING..." : "REFRESH"}
           </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-4 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>ENVIRONMENT_CONFIG</span>
                <GlobeAltIcon className="w-3 h-3" />
              </div>
              <CardContent className="p-6 space-y-4 font-mono text-[10px] text-ink/60">
                <div className="space-y-2">
                   <div className="flex justify-between border-b border-ghost pb-1">
                      <span>CORE_API:</span>
                      <span className="text-ink font-bold truncate ml-4">{AppConfig.coreApiUrl}</span>
                   </div>
                   <div className="flex justify-between border-b border-ghost pb-1">
                      <span>NETWORK_ID:</span>
                      <span className="text-ink font-bold">{AppConfig.network.toUpperCase()}</span>
                   </div>
                   <div className="flex justify-between border-b border-ghost pb-1">
                      <span>SYNC_STATUS:</span>
                      <span className={status?.ok ? "text-success font-bold" : "text-error font-bold"}>
                        {status?.ok ? "LOCKED" : "FAULT"}
                      </span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="machined-card">
              <div className="machined-header">
                <span>BLOCK_LATENCY_LOG</span>
                <CpuChipIcon className="w-3 h-3 opacity-50" />
              </div>
              <CardContent className="p-4">
                <pre className="text-[10px] font-mono overflow-auto max-h-[300px] text-ink/70 bg-neutral-light p-4 rounded-sm border border-ghost">
                  {blocks ? JSON.stringify(blocks, null, 2) : "AWAITING_PACKET..."}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-8 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>MEMPOOL_STREAM (LATEST_20)</span>
                <BoltIcon className="w-3 h-3 text-accent" />
              </div>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-ink/[0.02] border-ghost">
                      <TableHead className="text-[9px] font-black">TX_ID_VECTOR</TableHead>
                      <TableHead className="text-[9px] font-black">OP_TYPE</TableHead>
                      <TableHead className="text-[9px] font-black">SENDER_ORIGIN</TableHead>
                      <TableHead className="text-[9px] font-black text-right">NONCE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mempool.map((tx, idx) => (
                      <TableRow key={tx?.tx_id || `tx-${idx}`} className="border-ghost hover:bg-neutral-light transition-colors">
                        <TableCell className="font-mono text-[9px] font-bold text-accent truncate max-w-[120px]">
                          {tx?.tx_id || "—"}
                        </TableCell>
                        <TableCell className="text-[9px] font-black text-ink/60 uppercase">{tx?.tx_type || "—"}</TableCell>
                        <TableCell className="font-mono text-[9px] text-ink/40 truncate max-w-[120px]">
                          {tx?.sender_address || "—"}
                        </TableCell>
                        <TableCell className="text-right text-[9px] font-black text-ink">{tx?.nonce ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                    {mempool.length === 0 && (
                      <TableRow>
                        <TableCell className="py-20 text-center font-black uppercase text-[10px] text-ink/20" colSpan={4}>
                          MEMPOOL_EMPTY: AWAITING_NETWORK_EVENT
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
