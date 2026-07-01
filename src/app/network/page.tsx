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
import { logger } from "@/lib/logger";
import {
  CpuChipIcon,
  GlobeAltIcon,
  BoltIcon,
  ChartBarIcon,
  MapIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function NetworkPage() {
  const [status, setStatus] = useState<CoreStatus | null>(null);
  const [blocks, setBlocks] = useState<unknown | null>(null);
  const [mempool, setMempool] = useState<MempoolTx[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [s, b, m] = await Promise.allSettled([getStatus(), getNetworkBlockTimes(), getMempool(20)]);

      if (s.status === 'fulfilled') setStatus(s.value);
      else logger.error('Failed to fetch core status', { module: 'Network', error: s.reason });

      if (b.status === 'fulfilled') setBlocks(b.value);
      else logger.warn('Failed to fetch block times', { module: 'Network', error: b.reason });

      if (m.status === 'fulfilled') setMempool(m.value || []);
      else logger.warn('Failed to fetch mempool', { module: 'Network', error: m.reason });
    } catch (e) {
      logger.error('Critical failure in network refresh', { module: 'Network', error: e });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="flex-1 flex flex-col bg-background terminal-text">
      <div className="bg-neutral-light text-ink font-black py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network</span>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>Ready</span>
          <span>Uptime: 99.998%</span>
        </div>
      </div>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase text-ink">NETWORK</h1>
            <p className="text-ink font-black uppercase tracking-[0.4em] text-xs mt-2">
              Network Status and Activity
            </p>
          </div>
          <Button onClick={refresh} disabled={loading} className="h-10 px-6 bg-ink text-background-paper font-black uppercase tracking-[0.2em] text-[10px]">
            {loading ? 'UPDATING...' : 'REFRESH'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Global TPS', value: '14,204', detail: '+12% Shift', icon: ChartBarIcon },
            { label: 'Avg Block Time', value: '402ms', detail: 'Steady', icon: CpuChipIcon },
            { label: 'Active Nodes', value: '3,142', detail: '-2 Offline', icon: GlobeAltIcon },
            { label: 'Gas Volatility', value: 'HIGH', detail: 'Predictive Warn', icon: BoltIcon, color: 'text-error' },
          ].map((m, i) => (
            <Card key={i} className="machined-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black text-ink-light uppercase tracking-widest">{m.label}</span>
                  <m.icon className="w-3 h-3 opacity-20" />
                </div>
                <div className="flex justify-between items-end">
                  <span className={`text-2xl font-black tabular-nums ${m.color || 'text-ink'}`}>{m.value}</span>
                  <span className="text-[8px] font-black uppercase opacity-60 mb-1">{m.detail}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-8 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>NETWORK FORECAST</span>
                <BoltIcon className="w-3 h-3 text-ink" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] text-ink-light font-black uppercase tracking-widest mb-6">
                  Predicted gas volatility and congestion
                </p>
                <div className="h-40 bg-neutral-light border border-ghost rounded-sm flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end px-4 pb-8 gap-1">
                    {[0.4, 0.6, 0.5, 0.8, 0.9, 0.7, 0.4, 0.5, 0.6, 0.8, 0.9, 0.7, 0.8, 0.6].map((h, i) => (
                      <div key={i} className="flex-1 bg-accent/20 border-t-2 border-accent" style={{ height: `${h * 100}%` }} />
                    ))}
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-6 text-[8px] font-black text-ink-light uppercase tracking-widest">
                    <span>T-60m</span>
                    <span>T-30m</span>
                    <span className="text-ink">NOW</span>
                    <span>+30m</span>
                    <span>+60m</span>
                  </div>
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 bg-background-paper/80 px-4 py-2 border border-ghost rounded-sm">
                    Processing forecast...
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="machined-card">
              <div className="machined-header">
                <span>TOPOLOGY</span>
                <MapIcon className="w-3 h-3" />
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 h-48 bg-neutral-light border border-ghost rounded-sm relative flex items-center justify-center">
                    <GlobeAltIcon className="w-32 h-32 text-ink-light/20 animate-pulse-soft" />
                    <div className="absolute top-1/4 left-1/4 h-2 w-2 bg-success rounded-full animate-ping" title="US-EAST" />
                    <div className="absolute top-1/3 left-2/3 h-2 w-2 bg-error rounded-full animate-ping" title="EU-CENTRAL" />
                    <div className="absolute bottom-1/4 left-1/2 h-2 w-2 bg-success rounded-full animate-ping" title="AP-SOUTH" />
                    <span className="absolute bottom-3 left-4 text-[8px] font-mono text-ink-light font-bold uppercase tracking-widest">
                      Global infrastructure status
                    </span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-ink-light uppercase tracking-widest">Regional Health</p>
                    <div className="space-y-2">
                      {[
                        { region: 'US-EAST', status: 'READY', color: 'text-success' },
                        { region: 'EU-CENTRAL', status: 'DEGRADED', color: 'text-error' },
                        { region: 'AP-SOUTH', status: 'READY', color: 'text-success' },
                        { region: 'SA-EAST', status: 'STANDBY', color: 'text-ink-light' },
                      ].map((r, i) => (
                        <div key={i} className="flex justify-between items-center text-[9px] font-black">
                          <span className="text-ink-light">{r.region}</span>
                          <span className={r.color}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card className="machined-card border-error/40">
              <div className="machined-header bg-error/5 border-error/20">
                <span className="text-error">INCIDENTS</span>
                <ExclamationTriangleIcon className="w-3 h-3 text-error" />
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-error/5 border border-error/10 rounded-sm">
                    <p className="text-[10px] font-black text-error uppercase tracking-widest mb-1">LATENCY SPIKE 14:02:11Z</p>
                    <p className="text-[9px] text-ink-light font-bold mb-3">EU-Central region experiencing &gt;500ms propagation delay.</p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="h-7 text-[8px] border-error/40 text-error font-black uppercase">Isolate Region</Button>
                      <Button variant="outline" className="h-7 text-[8px] font-black uppercase">View Logs</Button>
                    </div>
                  </div>
                  <div className="p-3 bg-warning/5 border border-warning/10 rounded-sm opacity-60">
                    <p className="text-[10px] font-black text-warning uppercase tracking-widest mb-1">VALIDATOR OFFLINE 13:45:00Z</p>
                    <p className="text-[9px] text-ink-light font-bold">Node ID: 0x8f...3b missed 3 consecutive epochs.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="machined-card">
              <div className="machined-header">
                <span>MEMPOOL</span>
                <BoltIcon className="w-3 h-3 text-ink" />
              </div>
              <CardContent className="p-0 overflow-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>TRANSACTION</TableHead>
                      <TableHead className="text-right">NONCE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mempool.map((tx, idx) => (
                      <TableRow key={tx?.tx_id || `tx-${idx}`}>
                        <TableCell className="font-mono text-[9px] font-black text-ink truncate max-w-[120px]">{tx?.tx_id || '—'}</TableCell>
                        <TableCell className="text-right text-[9px] font-black text-ink tabular-nums">{tx?.nonce ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                    {mempool.length === 0 && (
                      <TableRow>
                        <TableCell className="py-10 text-center font-black uppercase text-[10px] text-ink-light" colSpan={2}>
                          Awaiting transactions...
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
