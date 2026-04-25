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
      <div className={cn("h-2 w-2 rounded-full", dotColor, status === "operational" && "animate-pulse")} />
      <span className={cn("text-[10px] font-bold uppercase tracking-widest", textColor)}>
        {label || status}
      </span>
    </div>
  );
}
