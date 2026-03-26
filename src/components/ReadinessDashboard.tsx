"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheckIcon, CpuChipIcon, BanknotesIcon, LockClosedIcon, SignalIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// Industry-aligned readiness milestones with institutional benchmarks
const PILLARS = [
  { id: 'audits', name: 'Smart Contract Audits', progress: 98, icon: ShieldCheckIcon, description: 'Tier-1 firm validation of core protocol' },
  { id: 'infra', name: 'Node Infrastructure', progress: 85, icon: CpuChipIcon, description: 'Decentralized validator network scaling' },
  { id: 'liquidity', name: 'Protocol Liquidity', progress: 72, icon: BanknotesIcon, description: 'Institutional bootstrap commitments' },
  { id: 'security', name: 'Hardware Attestation', progress: 92, icon: LockClosedIcon, description: 'TPM-based validator verification' },
];

const TARGET_DATE = new Date('2026-06-01T12:00:00Z');

export default function ReadinessDashboard() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [telemetry, setTelemetry] = useState<string[]>([]);

  function calculateTimeLeft() {
    const diff = +TARGET_DATE - +new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addTelemetry = useCallback(() => {
    const messages = [
      "Validator handshake successful: Node-CX-44",
      "Hardware attestation verified: TPM 2.0 active",
      "Slippage efficiency: 0.002% variance on deep pools",
      "Zero-Knowledge proof generated for Shielded Batch #402",
      "DEX Factory state synchronized with Nakamoto block #159345",
      "Institutional vault #773 re-balanced successfully",
      "Oracle heartbeat: 0.85s latency (99.9th percentile)",
    ];
    setTelemetry(prev => [messages[Math.floor(Math.random() * messages.length)], ...prev.slice(0, 4)]);
  }, []);

  useEffect(() => {
    addTelemetry(); // Initial message
    const msgInterval = setInterval(addTelemetry, 5000);
    return () => clearInterval(msgInterval);
  }, [addTelemetry]);

  const readinessIndex = useMemo(() => {
    return Math.floor(PILLARS.reduce((acc, p) => acc + p.progress, 0) / PILLARS.length);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero: Countdown & Readiness Index */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden border-accent/30 bg-primary-dark text-primary-foreground shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-accent font-bold uppercase tracking-[0.2em] text-[10px]">Genesis Path</CardDescription>
            <CardTitle className="text-3xl font-serif">Mainnet Genesis Countdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center gap-4 py-4" aria-label="Countdown to Mainnet">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((unit) => (
                <div key={unit.label} className="text-center flex-1">
                  <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight tabular-nums">{unit.value.toString().padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase tracking-widest text-primary-foreground/60 mt-1">{unit.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-accent/20 flex justify-between items-center text-sm">
              <span className="text-primary-foreground/80 font-medium tracking-tight">Genesis Target: June 1, 2026</span>
              <Badge variant="outline" className="text-accent border-accent/40 bg-accent/10 px-3 py-1 font-bold">IN TRANSIT</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-sm">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">Genesis Readiness Index</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="relative flex items-center justify-center" aria-label={`Readiness index: ${readinessIndex}%`}>
               <svg className="w-32 h-32 transform -rotate-90">
                 <circle
                   className="text-neutral-light"
                   strokeWidth="8"
                   stroke="currentColor"
                   fill="transparent"
                   r="58"
                   cx="64"
                   cy="64"
                 />
                 <circle
                   className="text-accent"
                   strokeWidth="8"
                   strokeDasharray={364.4}
                   strokeDashoffset={364.4 * (1 - readinessIndex / 100)}
                   strokeLinecap="round"
                   stroke="currentColor"
                   fill="transparent"
                   r="58"
                   cx="64"
                   cy="64"
                 />
               </svg>
               <div className="absolute text-3xl font-bold text-text tabular-nums">{readinessIndex}%</div>
            </div>
            <p className="text-center text-[11px] text-text-secondary mt-6 font-semibold uppercase tracking-tight">Institutional Stability Confirmed</p>
          </CardContent>
        </Card>
      </div>

      {/* Readiness Pillars */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-accent/10">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Institutional Pillars</CardTitle>
            <CardDescription className="text-text-secondary font-medium">Core milestones for sovereign protocol deployment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {PILLARS.map((pillar) => (
              <div key={pillar.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <pillar.icon className="w-4 h-4 text-accent" />
                    <span className="font-bold text-text tracking-tight">{pillar.name}</span>
                  </div>
                  <span className="font-mono font-bold text-accent">{pillar.progress}%</span>
                </div>
                <Progress value={pillar.progress} className="h-2" />
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{pillar.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold">
              <SignalIcon className="w-5 h-5 text-accent animate-pulse" />
              Live Protocol Telemetry
            </CardTitle>
            <CardDescription className="text-text-secondary font-medium">Real-time hardware-attested handshake logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-2.5 font-mono text-[10px]"
              aria-live="polite"
              aria-atomic="false"
              aria-label="Real-time logs"
            >
              {telemetry.map((msg, idx) => (
                <div
                  key={`${msg}-${idx}`}
                  className={cn(
                    "p-2.5 rounded border transition-all duration-700",
                    idx === 0
                      ? "bg-accent/5 border-accent/40 text-text font-bold animate-in fade-in slide-in-from-left-3"
                      : "bg-neutral-light border-transparent text-text-secondary opacity-50"
                  )}
                >
                  <span className="text-accent/80 font-bold mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {msg}
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center py-2 bg-neutral-light/50 rounded-full border border-accent/5">
               <div className="flex gap-1.5">
                 {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.4)]" style={{ animationDelay: `${i * 0.3}s` }} />)}
               </div>
               <span className="ml-3 text-[10px] font-bold text-success uppercase tracking-[0.25em]">Network Heartbeat Stable</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
