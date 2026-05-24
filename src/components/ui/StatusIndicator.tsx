"use client";

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "operational" | "degraded" | "error";
  label?: string;
  className?: string;
}

export default function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const dotColor = {
    operational: "bg-success",
    degraded: "bg-warning",
    error: "bg-error",
  }[status];

  const textColor = {
    operational: "text-success",
    degraded: "text-warning",
    error: "text-error",
  }[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("h-1.5 w-1.5 rounded-full", dotColor, status === "operational" && "animate-pulse")} />
      <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", textColor)}>
        {label || status}
      </span>
    </div>
  );
}
