
import { cn } from "@/lib/utils";

type Status = "operational" | "degraded" | "outage";

const statusStyles: Record<Status, string> = {
  operational: "bg-green-600",
  degraded: "bg-yellow-600",
  outage: "bg-red-600",
};

export default function StatusIndicator({ status }: { status: Status }) {
  return (
    <div className="flex items-center">
      <div className={cn("w-3 h-3 rounded-full", statusStyles[status])} />
      <span className="ml-2 text-sm text-text capitalize">
        {status}
      </span>
    </div>
  );
}
