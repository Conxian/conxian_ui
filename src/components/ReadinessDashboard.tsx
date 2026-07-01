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
        <Card className="bg-neutral-light border-accent/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ClockIcon className="w-12 h-12 text-accent" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">
              Mainnet Countdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-baseline text-ink">
              <span className="text-3xl font-black tabular-nums">{timeLeft.days}</span>
              <span className="text-[10px] font-black uppercase opacity-60">Days</span>
              <span className="text-3xl font-black tabular-nums">{timeLeft.hours}</span>
              <span className="text-[10px] font-black uppercase opacity-60">H</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-ink uppercase tracking-[0.2em]">
              Hardware Attestation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-black text-ink tabular-nums">SGX-V3 ACTIVE</span>
            </div>
            <p className="text-[10px] text-ink-light mt-1 font-mono uppercase font-black">Node ID: 0x2E40...3B1A</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-ink uppercase tracking-[0.2em]">
              Security Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-success" />
              <span className="text-sm font-black text-ink">98.2% READY</span>
            </div>
            <p className="text-[10px] text-ink-light mt-1 font-mono uppercase font-black">Audit: Halborn v1.4</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-ink uppercase tracking-[0.2em]">
              Network Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="w-4 h-4 text-info" />
              <span className="text-sm font-black text-ink tabular-nums">1.2ms LATENCY</span>
            </div>
            <p className="text-[10px] text-ink-light mt-1 font-mono uppercase font-black">Region: US-EAST-1</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-ink">
            Protocol Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CpuChipIcon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-ink uppercase tracking-tight">Computational Integrity</h4>
                  <p className="text-xs text-ink-light mt-1 font-bold">
                    Conxian nodes use Intel SGX and TEE protections to strengthen transaction isolation and privacy.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <ShieldCheckIcon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-ink uppercase tracking-tight">Compliance Support</h4>
                  <p className="text-xs text-ink-light mt-1 font-bold">
                    Built-in support for role-based access control and compliance hooks without changing the decentralized protocol core.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-neutral-light p-4 rounded-sm border border-accent/20">
              <h4 className="text-[10px] font-black text-ink-light mb-3 uppercase tracking-widest">Live Status Feed</h4>
              <div className="space-y-2 font-mono text-[10px] text-ink-light">
                <div className="flex justify-between border-b border-accent/10 pb-1">
                  <span>[SYSLOG] Consensus Reach:</span>
                  <span className="text-success font-black">MATCH</span>
                </div>
                <div className="flex justify-between border-b border-accent/10 pb-1">
                  <span>[ATTEST] TEE Pulse:</span>
                  <span className="text-success font-black">OK (0.1ms)</span>
                </div>
                <div className="flex justify-between border-b border-accent/10 pb-1">
                  <span>[POLICY] Oracle Sync:</span>
                  <span className="text-success font-black">UP-TO-DATE</span>
                </div>
                <div className="flex justify-between">
                  <span>[ALGO] Yield Opt:</span>
                  <span className="text-info font-black">TUNING...</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
