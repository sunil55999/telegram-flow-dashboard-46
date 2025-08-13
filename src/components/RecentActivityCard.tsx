import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ActivityEvent {
  id: string;
  type: "success" | "error" | "paused" | "info";
  message: string;
  timestamp: Date;
  pairName?: string;
}

interface RecentActivityCardProps {
  events: ActivityEvent[];
}

export function RecentActivityCard({ events }: RecentActivityCardProps) {
  const [filter, setFilter] = useState<"all" | "success" | "error" | "paused">("all");

  const filteredEvents = events.filter(event => 
    filter === "all" || event.type === filter
  );

  const getEventBadgeVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "paused":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <div className="flex gap-2 mt-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={filter === "success" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("success")}
            className="text-xs"
          >
            Success
          </Button>
          <Button
            variant={filter === "error" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("error")}
            className="text-xs"
          >
            Error
          </Button>
          <Button
            variant={filter === "paused" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("paused")}
            className="text-xs"
          >
            Paused
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredEvents.slice(0, 10).map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Badge variant={getEventBadgeVariant(event.type)} className="text-xs">
                {event.type}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{event.message}</p>
                {event.pairName && (
                  <p className="text-xs text-muted-foreground">Pair: {event.pairName}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No {filter !== "all" ? filter : ""} events found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}