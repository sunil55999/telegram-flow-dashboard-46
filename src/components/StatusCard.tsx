import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  status?: "success" | "warning" | "error" | "default";
  icon?: React.ReactNode;
}

export function StatusCard({ 
  title, 
  value, 
  subtitle, 
  action, 
  status = "default",
  icon 
}: StatusCardProps) {
  const statusColors = {
    success: "text-green-500",
    warning: "text-yellow-500", 
    error: "text-red-500",
    default: "text-foreground"
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className={cn("text-2xl font-bold", statusColors[status])}>
              {value}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <Button size="sm" variant="outline" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}