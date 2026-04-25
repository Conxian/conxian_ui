"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { getStatus, CoreStatus } from "@/lib/core-api";
import { AppConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export default function EnvStatus() {
  const [status, setStatus] = useState<CoreStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const s = await getStatus();
        setStatus(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 bg-background-light p-3 rounded-lg border border-accent/20" role="status" title={status?.ok ? "Operational" : "Degraded"}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Network</span>
        <Badge variant="outline" className="font-mono text-[10px] bg-accent/5">
          {AppConfig.network.toUpperCase()}
        </Badge>
      </div>

      <div className="h-4 w-px bg-accent/20" />

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Core API</span>
        {loading ? (
          <div className="h-2 w-2 rounded-full bg-neutral-light animate-pulse" />
        ) : (
          <div className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", status?.ok ? "bg-success" : "bg-error")} />
            <span className={cn("text-[10px] font-bold uppercase", status?.ok ? "text-success" : "text-error")}>
              {status?.ok ? "Connected" : "Disconnected"}
            </span>
          </div>
        )}
      </div>

      <div className="hidden sm:flex flex-1 justify-end items-center gap-2">
         <span className="text-[10px] font-mono text-text-muted truncate max-w-[200px]" title={AppConfig.coreApiUrl}>
           {AppConfig.coreApiUrl}
         </span>
      </div>
    </div>
  );
}
