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
        console.error(err);
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
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <div className="animate-pulse text-text-secondary">Fetching telemetry...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-error font-medium">{error}</div>
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
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">System Status</CardTitle>
        <StatusIndicator
          status={metrics?.systemHealth?.success ? "operational" : "degraded"}
        />
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CurrencyDollarIcon className="w-8 h-8 text-primary" />
          </div>
          <div className="ml-4">
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Total Value Locked</div>
            <div className="text-2xl font-bold text-text tabular-nums">${tvl}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="p-2 bg-accent/10 rounded-lg">
            <ShieldCheckIcon className="w-8 h-8 text-accent" />
          </div>
          <div className="ml-4">
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">Active Vaults</div>
            <div className="text-2xl font-bold text-text tabular-nums">
              {activeVaults}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="p-2 bg-success/10 rounded-lg">
            <ArrowTrendingUpIcon className="w-8 h-8 text-success" />
          </div>
          <div className="ml-4">
            <div className="text-xs font-medium text-text-secondary uppercase tracking-wider">APY (Median)</div>
            <div className="text-2xl font-bold text-text tabular-nums text-success">{apy}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
