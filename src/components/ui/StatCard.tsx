import { Card, CardContent } from "@/components/ui/Card";


interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
  loading?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  subtext,
  loading = false,
}: StatCardProps) => (
  <Card className="machined-card group hover:border-accent transition-all duration-300">
    <div className="machined-header">
       <span>{title}</span>
       <div className="opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
    </div>
    <CardContent className="p-6">
      {loading ? (
        <div className="h-10 w-32 bg-ink/5 animate-pulse rounded-sm" />
      ) : (
        <div className="text-4xl font-black text-ink tracking-tighter tabular-nums">{value}</div>
      )}
      {subtext && (
        <div className="mt-3 flex items-center gap-2">
           <div className="h-1 w-1 rounded-full bg-accent" />
           <p className="text-[9px] font-black text-ink/40 uppercase tracking-[0.2em]">{subtext}</p>
        </div>
      )}
    </CardContent>
  </Card>
);
