"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheckIcon, CpuChipIcon, GlobeAltIcon, ClockIcon } from "@heroicons/react/24/outline";

export function ReadinessDashboard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-06-01T00:00:00Z");

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });

      if (difference < 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary-dark border-accent/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ClockIcon className="w-12 h-12 text-accent" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Genesis Countdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-baseline text-primary-foreground">
              <span className="text-3xl font-bold tabular-nums">{timeLeft.days}</span>
              <span className="text-[10px] font-medium uppercase opacity-60">Days</span>
              <span className="text-3xl font-bold tabular-nums">{timeLeft.hours}</span>
              <span className="text-[10px] font-medium uppercase opacity-60">H</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Hardware Attestation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-bold text-text tabular-nums">SGX-V3 ACTIVE</span>
            </div>
            <p className="text-[10px] text-text-muted mt-1 font-mono uppercase">Node ID: 0x2E40...3B1A</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Security Pillar</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-success" />
                <span className="text-sm font-bold text-text">98.2% READY</span>
             </div>
             <p className="text-[10px] text-text-muted mt-1 font-mono uppercase">Audit: Halborn v1.4</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Network Load</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4 text-info" />
                <span className="text-sm font-bold text-text tabular-nums">1.2ms LATENCY</span>
             </div>
             <p className="text-[10px] text-text-muted mt-1 font-mono uppercase">Region: US-EAST-1</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-text-secondary">Institutional Readiness Pillars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <div className="flex items-start gap-3">
                   <div className="mt-1"><CpuChipIcon className="w-5 h-5 text-accent" /></div>
                   <div>
                      <h4 className="text-sm font-bold text-text uppercase tracking-tight">Computational Integrity</h4>
                      <p className="text-xs text-text-secondary mt-1">Conxian nodes utilize Intel SGX and TEE to ensure transaction isolation and privacy, even from node operators.</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <div className="mt-1"><ShieldCheckIcon className="w-5 h-5 text-accent" /></div>
                   <div>
                      <h4 className="text-sm font-bold text-text uppercase tracking-tight">Compliance Infrastructure</h4>
                      <p className="text-xs text-text-secondary mt-1">Built-in support for institutional grade RBAC and AML/KYC hooks without compromising decentralized core values.</p>
                   </div>
                </div>
             </div>
             <div className="bg-neutral-light p-4 rounded border border-accent/10">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Live Telemetry Feed</h4>
                <div className="space-y-2 font-mono text-[10px] text-text-secondary">
                   <div className="flex justify-between border-b border-accent/5 pb-1">
                      <span>[SYSLOG] Consensus Reach:</span>
                      <span className="text-success">MATCH</span>
                   </div>
                   <div className="flex justify-between border-b border-accent/5 pb-1">
                      <span>[ATTEST] TEE Pulse:</span>
                      <span className="text-success">OK (0.1ms)</span>
                   </div>
                   <div className="flex justify-between border-b border-accent/5 pb-1">
                      <span>[POLICY] Oracle Sync:</span>
                      <span className="text-success">UP-TO-DATE</span>
                   </div>
                   <div className="flex justify-between">
                      <span>[ALGO] Yield Opt:</span>
                      <span className="text-info">TUNING...</span>
                   </div>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
