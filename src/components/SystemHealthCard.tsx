import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface SystemHealthCardProps {
  status: "operational" | "degraded" | "down";
  message: string;
}

export function SystemHealthCard({ status, message }: SystemHealthCardProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "operational":
        return { color: "text-green-500", bgColor: "bg-green-500", label: "Operational" };
      case "degraded":
        return { color: "text-yellow-500", bgColor: "bg-yellow-500", label: "Degraded" };
      case "down":
        return { color: "text-red-500", bgColor: "bg-red-500", label: "Down" };
      default:
        return { color: "text-gray-500", bgColor: "bg-gray-500", label: "Unknown" };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusInfo.bgColor}`}></div>
          <span className="text-sm font-medium">{statusInfo.label}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{message}</p>
      </CardContent>
    </Card>
  );
}