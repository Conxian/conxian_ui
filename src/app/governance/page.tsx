"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  ScaleIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";

export default function GovernancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-3">
          <ScaleIcon className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Governance</span>
        </div>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>
            Status: <span className="text-success font-black">Operational</span>
          </span>
          <span>
            Epoch: <span className="text-ink font-black">#4892</span>
          </span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase text-ink">GOVERNANCE</h1>
            <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">
              Proposals and Voting
            </p>
          </div>
          <div className="flex gap-4">
            <Button className="h-10 px-6 bg-ink text-background-paper font-black uppercase tracking-[0.2em] text-[10px]">
              VIEW PROPOSALS
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-7 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>VOTING POLICY</span>
                <PlusIcon className="w-3 h-3 text-accent" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] text-ink-light font-bold mb-6 uppercase tracking-widest">
                  Define rule-based voting behavior for governance proposals.
                </p>

                <div className="space-y-4 p-4 bg-neutral-light border border-accent/10 rounded-sm">
                  <div className="flex items-center gap-4 text-[11px] font-black text-ink">
                    <span className="w-8 opacity-40 uppercase">IF</span>
                    <div className="flex-1 p-2 border border-accent/20 bg-background rounded-sm">
                      PROPOSAL_TYPE = TREASURY_ALLOCATION
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-black text-ink">
                    <span className="w-8 opacity-40 uppercase">AND</span>
                    <div className="flex-1 p-2 border border-accent/20 bg-background rounded-sm">
                      IMPACT &lt; $5,000,000
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-black text-ink pt-2 border-t border-accent/10">
                    <span className="w-8 opacity-40 uppercase">THEN</span>
                    <div className="flex-1 p-2 border border-accent/40 bg-background rounded-sm text-success">
                      EXECUTE_VOTE: YES
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="outline" className="text-[10px] h-9 px-4 font-black tracking-widest uppercase">
                    SAVE POLICY
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="machined-card">
              <div className="machined-header">
                <span>VOTING HISTORY</span>
                <ArrowDownTrayIcon className="w-3 h-3" />
              </div>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>TIMESTAMP</TableHead>
                      <TableHead>ACTION</TableHead>
                      <TableHead>PROP_ID</TableHead>
                      <TableHead className="text-right">STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-[9px] font-mono font-bold">2026-05-31 14:32</TableCell>
                      <TableCell className="text-[9px] font-black uppercase text-accent">Automated Vote (YES)</TableCell>
                      <TableCell className="text-[9px] font-mono">PROP-842</TableCell>
                      <TableCell className="text-right text-[9px] font-black text-success">LOCKED</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-[9px] font-mono font-bold">2026-05-30 09:15</TableCell>
                      <TableCell className="text-[9px] font-black uppercase">Policy Updated</TableCell>
                      <TableCell className="text-[9px] font-mono">--</TableCell>
                      <TableCell className="text-right text-[9px] font-black text-success">SYNCED</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-[9px] font-mono font-bold">2026-05-28 18:45</TableCell>
                      <TableCell className="text-[9px] font-black uppercase text-error">Manual Vote (NO)</TableCell>
                      <TableCell className="text-[9px] font-mono">PROP-839</TableCell>
                      <TableCell className="text-right text-[9px] font-black text-info">EXECUTED</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-5 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>DELEGATION</span>
                <SignalIcon className="w-3 h-3 text-success" />
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-[10px] font-black text-ink-light tracking-widest uppercase">Voting Power</span>
                      <span className="text-xl font-black text-ink tabular-nums">14.2%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-light rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: "14.2%" }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-light border border-accent/10 rounded-sm">
                      <p className="text-[9px] font-black text-ink-light uppercase tracking-widest mb-1">Delegate Uptime</p>
                      <p className="text-lg font-black text-success tabular-nums">99.98%</p>
                    </div>
                    <div className="p-4 bg-neutral-light border border-accent/10 rounded-sm">
                      <p className="text-[9px] font-black text-ink-light uppercase tracking-widest mb-1">Active Policies</p>
                      <p className="text-lg font-black text-ink tabular-nums">12</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-accent/10">
                    <p className="text-[10px] font-black text-ink uppercase tracking-widest">Active Delegates</p>
                    <div className="flex items-center justify-between p-2 border border-ghost rounded-sm">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-3 h-3 text-success" />
                        <span className="text-[10px] font-mono font-bold">0x4F...9E2A</span>
                      </div>
                      <span className="text-[9px] font-black text-accent uppercase">Primary</span>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-ghost rounded-sm">
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="w-3 h-3 text-success" />
                        <span className="text-[10px] font-mono font-bold">0x2B...7C19</span>
                      </div>
                      <span className="text-[9px] font-black text-ink-light uppercase">Backup</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="machined-card">
              <div className="machined-header">
                <span>ACCOUNT</span>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-accent/10 rounded-sm flex items-center justify-center">
                    <ScaleIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-ink-light uppercase tracking-widest">Signed In As</p>
                    <p className="text-xs font-mono font-black text-ink uppercase">SYS.ADMIN.0x8A...3F92</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
