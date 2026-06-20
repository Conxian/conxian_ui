"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useApi } from "@/lib/api-client";
import StatusIndicator from "@/components/ui/StatusIndicator";
import { ApiResult } from "@/lib/contract-interactions";
import { logger } from "@/lib/logger";

interface DashboardMetrics {
  systemHealth: ApiResult<Record<string, unknown>>;
  aggregatedMetrics: ApiResult<Record<string, unknown>>;
  financialMetrics: ApiResult<Record<string, unknown>>;
}

export default function SystemStatus() {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const data = await api.getDashboardMetrics() as DashboardMetrics;
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch system metrics");
        logger.error("Failed to fetch system metrics", {
          module: "SystemStatus",
          error: err,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [api]);

  if (loading && !metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <div className="animate-pulse text-ink-light">Fetching telemetry...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-error font-bold">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const tvl = (metrics?.aggregatedMetrics?.data?.tvl as string) || "0.00";
  const activeVaults = (metrics?.systemHealth?.data?.["active-vaults"] as string | number) || "0";
  const apy = (metrics?.financialMetrics?.data?.["median-apy"] as string) || "0.00";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>System Status</CardTitle>
        <StatusIndicator
          status={metrics?.systemHealth?.success ? "operational" : "degraded"}
        />
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
        <div className="flex items-center">
          <div className="p-2 bg-ink/5 rounded-sm border border-accent/10">
            <CurrencyDollarIcon className="w-6 h-6 text-ink" />
          </div>
          <div className="ml-4">
            <div className="text-[10px] font-black text-ink-light uppercase tracking-widest">Total Value Locked</div>
            <div className="text-2xl font-black text-ink tabular-nums">${tvl}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="p-2 bg-accent/5 rounded-sm border border-accent/10">
            <ShieldCheckIcon className="w-6 h-6 text-accent" />
          </div>
          <div className="ml-4">
            <div className="text-[10px] font-black text-ink-light uppercase tracking-widest">Active Vaults</div>
            <div className="text-2xl font-black text-ink tabular-nums">
              {activeVaults}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="p-2 bg-success/5 rounded-sm border border-accent/10">
            <ArrowTrendingUpIcon className="w-6 h-6 text-success" />
          </div>
          <div className="ml-4">
            <div className="text-[10px] font-black text-ink-light uppercase tracking-widest">APY (Median)</div>
            <div className="text-2xl font-black text-ink text-success tabular-nums">{apy}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
