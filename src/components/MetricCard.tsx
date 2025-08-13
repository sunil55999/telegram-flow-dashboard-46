import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  subtitle?: string;
  className?: string;
}

export function MetricCard({ icon, value, label, subtitle, className }: MetricCardProps) {
  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-semibold text-foreground">{value}</div>
            <div className="text-sm font-medium text-foreground">{label}</div>
            {subtitle && (
              <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}