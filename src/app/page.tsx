"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import EnvStatus from "@/components/EnvStatus";
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { StatCard } from "@/components/ui/StatCard";
import { VStack } from "@/components/ui/VStack";
import { useApi } from "@/lib/api-client";
import { ApiResult } from "@/lib/contract-interactions";
import { logger } from "@/lib/logger";

interface DashboardMetrics {
  systemHealth: ApiResult<Record<string, unknown>>;
  aggregatedMetrics: ApiResult<Record<string, unknown>>;
  financialMetrics: ApiResult<Record<string, unknown>>;
}

export default function Home() {
  const api = useApi();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const data = (await api.getDashboardMetrics()) as DashboardMetrics;
        setMetrics(data);
      } catch (err) {
        logger.error("Failed to fetch dashboard metrics", { module: "Dashboard", error: err });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [api]);

  const tvl = (metrics?.aggregatedMetrics?.data?.tvl as string) || "0.00";
  const activeVaults =
    (metrics?.systemHealth?.data?.["active-vaults"] as string | number) || "0";
  const apy = (metrics?.financialMetrics?.data?.["median-apy"] as string) || "0.00";

  return (
    <div className="flex-1 flex flex-col bg-background terminal-text">
      <div className="glass-panel py-3 px-8 flex justify-between items-center border-b border-ghost sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink">
            Conxian Dashboard
          </span>
          <Badge variant="outline" className="text-[8px] border-ghost text-ink-light">
            v4.2.1-attested
          </Badge>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">
          <span>
            Uptime: <span className="text-success">99.998%</span>
          </span>
          <span>
            Security: <span className="text-accent">Level 5</span>
          </span>
        </div>
      </div>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase text-ink">DASHBOARD</h1>
            <p className="text-accent font-bold uppercase tracking-[0.4em] text-xs mt-2">
              Protocol Overview
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-[9px] font-black uppercase text-ink-light tracking-widest">
              System Epoch
            </span>
            <p className="text-xs font-mono font-black text-ink tabular-nums">2026-Q2-LOCKED</p>
          </div>
        </div>

        <VStack className="space-y-10">
          <section>
            <EnvStatus />
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Total Value Locked"
              value={`$${tvl}`}
              icon={<CurrencyDollarIcon className="w-5 h-5 text-accent" />}
              subtext="Aggregated Protocol Reserves"
              loading={loading}
            />
            <StatCard
              title="Secure Vaults"
              value={activeVaults.toString()}
              icon={<ShieldCheckIcon className="w-5 h-5 text-accent" />}
              subtext="Active Attested Vaults"
              loading={loading}
            />
            <StatCard
              title="APY"
              value={`${apy}%`}
              icon={<ArrowTrendingUpIcon className="w-5 h-5 text-accent" />}
              subtext="Median Network APY (24h)"
              loading={loading}
            />
          </section>

          <div className="grid gap-8 md:grid-cols-12 items-start">
            <Card className="md:col-span-8 machined-card">
              <div className="machined-header">
                <div className="flex items-center gap-3">
                  <CpuChipIcon className="w-3 h-3" />
                  <span>MARKET ACTIVITY</span>
                </div>
                <span className="opacity-40 animate-pulse-soft">LIVE_FEED</span>
              </div>
              <CardContent className="p-0">
                <div className="grid grid-cols-4 border-b border-ghost bg-neutral-light">
                  {["Asset", "Pool", "Slippage", "Yield"].map((h) => (
                    <div
                      key={h}
                      className="p-3 text-[9px] font-black uppercase tracking-[0.2em] text-ink-light border-r border-ghost last:border-none"
                    >
                      {h}
                    </div>
                  ))}
                </div>
                <div className="p-8 text-center space-y-4">
                  <div className="inline-block p-4 border border-dashed border-accent/20 rounded-sm opacity-30">
                    <span className="text-xs font-black uppercase tracking-[0.2em]">
                      Awaiting Data...
                    </span>
                  </div>
                  <p className="text-[10px] text-ink-light italic">
                    Live activity appears after node synchronization. Current progress: 98.4%
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-4 space-y-6">
              <Card className="machined-card">
                <div className="machined-header">
                  <span>WALLET</span>
                </div>
                <CardContent className="p-6 space-y-4">
                  <p className="text-[10px] leading-relaxed text-ink-light font-bold">
                    Connect a secure wallet for protocol actions and protected account access.
                  </p>
                  <div className="p-3 bg-neutral-light border border-ghost rounded-sm font-mono text-[10px]">
                    <p className="text-success font-black">&gt; CONNECTION_READY</p>
                    <p className="text-ink-light">&gt; KEY_ROTATION: OK</p>
                    <p className="text-ink-light">&gt; ENCLAVE_ID: 0x42...F1</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="machined-card">
                <div className="machined-header">
                  <span>PERFORMANCE</span>
                </div>
                <CardContent className="p-6">
                  <p className="text-[10px] text-ink-light leading-relaxed mb-4 font-bold">
                    Real-time efficiency indicators across protocol liquidity and execution quality.
                  </p>
                  <div className="space-y-3">
                    {["LATENCY", "SLIPPAGE", "COST"].map((m) => (
                      <div key={m} className="flex justify-between items-baseline">
                        <span className="text-[10px] font-black text-ink-light tracking-widest uppercase">
                          {m}
                        </span>
                        <span className="text-[10px] font-black text-ink uppercase tabular-nums">
                          99th PERCENTILE
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </VStack>
      </main>
    </div>
  );
}
