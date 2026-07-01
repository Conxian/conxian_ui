"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { getStatus, CoreStatus } from "@/lib/core-api";
import { AppConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

export default function EnvStatus() {
  const [status, setStatus] = useState<CoreStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const s = await getStatus();
        setStatus(s);
      } catch (err) {
        logger.error("INFRASTRUCTURE connectivity check failed", { module: 'EnvStatus', error: err });
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 bg-neutral-light p-3 rounded-sm border border-accent/20" role="status" title={status?.ok ? "Operational" : "Degraded"}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-ink uppercase tracking-widest">INFRASTRUCTURE</span>
        <Badge variant="outline" className="font-mono text-[9px] bg-accent/5 tracking-widest text-ink-light">
          {AppConfig.network.toUpperCase()}
        </Badge>
      </div>

      <div className="h-4 w-px bg-accent/20" />

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-ink uppercase tracking-widest">GATEWAY_SYNC</span>
        {loading ? (
          <div className="h-1.5 w-1.5 rounded-full bg-accent/20 animate-pulse" />
        ) : (
          <div className="flex items-center gap-1.5">
            <div className={cn("h-1.5 w-1.5 rounded-full", status?.ok ? "bg-success" : "bg-error")} />
            <span className={cn("text-[9px] font-black uppercase tracking-widest", status?.ok ? "text-success" : "text-error")}>
              {status?.ok ? "Connected" : "Disconnected"}
            </span>
          </div>
        )}
      </div>

      <div className="hidden sm:flex flex-1 justify-end items-center gap-2">
         <span className="text-[9px] font-mono text-ink-light truncate max-w-[200px] font-black" title={AppConfig.coreApiUrl}>
           {AppConfig.coreApiUrl}
         </span>
      </div>
    </div>
  );
}
