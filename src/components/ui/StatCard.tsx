import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
  tooltipText?: string;
  loading?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  subtext,
  tooltipText,
  loading = false,
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-xs font-bold text-text-secondary uppercase tracking-widest">{title}</CardTitle>
      <div title={tooltipText} className="text-text-secondary">{icon}</div>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="h-8 w-24 bg-neutral-light animate-pulse rounded" />
      ) : (
        <div className="text-2xl font-bold text-text tracking-tight tabular-nums">{value}</div>
      )}
      {subtext && (
        <p className={cn(
          "mt-1 text-xs font-medium",
          loading ? "text-transparent bg-neutral-light animate-pulse rounded w-32 h-3" : "text-text-secondary"
        )}>
          {subtext}
        </p>
      )}
    </CardContent>
  </Card>
);
