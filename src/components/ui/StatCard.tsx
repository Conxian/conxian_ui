import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
  tooltipText?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  subtext,
  tooltipText,
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div title={tooltipText}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-text">{value}</div>
      {subtext && <p className="text-xs text-text">{subtext}</p>}
    </CardContent>
  </Card>
);
