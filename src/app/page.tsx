"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import EnvStatus from "@/components/EnvStatus";
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { StatCard } from "@/components/ui/StatCard";
import { VStack } from "@/components/ui/VStack";
import { useApi } from "@/lib/api-client";
import { ApiResult } from "@/lib/contract-interactions";

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
        const data = await api.getDashboardMetrics() as DashboardMetrics;
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, [api]);

  const tvl = (metrics?.aggregatedMetrics?.data?.tvl as string) || "0.00";
  const activeVaults = (metrics?.systemHealth?.data?.["active-vaults"] as string | number) || "0";
  const apy = (metrics?.financialMetrics?.data?.["median-apy"] as string) || "0.00";

  return (
    <div className="space-y-8 bg-background min-h-screen">
      {/* High-Trust Readiness Banner */}
      <div className="bg-primary-dark text-primary-foreground py-2 px-4 rounded-md flex justify-between items-center border border-accent/20">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Conxian System Ready</span>
        </div>
        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest opacity-70">
          <span>Latency: <span className="text-accent">0.8ms</span></span>
          <span>Block: <span className="text-accent">#84,321</span></span>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-text tracking-widest uppercase">Dashboard</h1>
        <p className="mt-2 text-sm text-text-secondary">
          An overview of the Conxian ecosystem and real-time protocol telemetry.
        </p>
      </div>

      <VStack className="mt-8">
        <section>
          <EnvStatus />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="TVL"
            value={`$${tvl}`}
            icon={<CurrencyDollarIcon className="w-5 h-5 text-text" />}
            subtext="Across Conxian protocols"
            tooltipText="Total Value Locked: The total value of assets currently held across all Conxian smart contracts."
            loading={loading}
          />
          <StatCard
            title="Active Vaults"
            value={activeVaults.toString()}
            icon={<ShieldCheckIcon className="w-5 h-5 text-text" />}
            subtext="Configured & healthy"
            tooltipText="The number of vaults that are currently active and operating within normal parameters."
            loading={loading}
          />
          <StatCard
            title="APY (Median)"
            value={`${apy}%`}
            icon={<ArrowTrendingUpIcon className="w-5 h-5 text-text" />}
            subtext="Real-time yield"
            tooltipText="Annual Percentage Yield: The median return on investment across all active staking and liquidity pools."
            loading={loading}
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Vaults</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm text-text font-medium border-b border-accent/10 pb-2">
                <div>Name</div>
                <div>Asset</div>
                <div className="text-right">APY</div>
              </div>
              <div className="mt-4 text-sm text-text-secondary">
                No vaults available yet. Telemetry syncing...
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Staking</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-background-light p-4 border border-accent/10">
                <div className="text-sm text-text-secondary mb-2 uppercase tracking-tight font-medium">Total Staked</div>
                <div className="text-xl font-bold text-text">0.00</div>
              </div>
              <div className="rounded-lg bg-background-light p-4 border border-accent/10">
                <div className="text-sm text-text-secondary mb-2 uppercase tracking-tight font-medium">My Staked</div>
                <div className="text-xl font-bold text-text">0.00</div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary leading-relaxed">
                Automated benchmarking against top DeFi, CeFi, and traditional enterprise finance.
                Primary KPIs: APY spreads, slippage efficiency, and hardware-attested latency targets.
              </p>
            </CardContent>
          </Card>
        </section>
      </VStack>
    </div>
  );
}
