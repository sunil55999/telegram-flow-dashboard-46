import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Clock, MessageSquare, AlertCircle } from "lucide-react";
import { useState } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  sourceId: string;
  destinationId: string;
  messageType: string;
  status: "success" | "failed" | "pending";
  errorMessage?: string;
}

interface MobileLogCardProps {
  log: LogEntry;
}

export function MobileLogCard({ log }: MobileLogCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "success":
        return { 
          color: "text-green-500", 
          bgColor: "bg-green-500/10", 
          borderColor: "border-green-500/20",
          label: "Success",
          icon: "✓"
        };
      case "failed":
        return { 
          color: "text-red-500", 
          bgColor: "bg-red-500/10", 
          borderColor: "border-red-500/20",
          label: "Failed",
          icon: "✗"
        };
      case "pending":
        return { 
          color: "text-yellow-500", 
          bgColor: "bg-yellow-500/10", 
          borderColor: "border-yellow-500/20",
          label: "Pending",
          icon: "●"
        };
      default:
        return { 
          color: "text-gray-500", 
          bgColor: "bg-gray-500/10", 
          borderColor: "border-gray-500/20",
          label: "Unknown",
          icon: "?"
        };
    }
  };

  const statusInfo = getStatusInfo(log.status);
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  className={`${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} text-xs`}
                >
                  {statusInfo.icon} {statusInfo.label}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {log.messageType}
                </Badge>
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatTime(log.timestamp)}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium truncate">
                  {log.sourceId} → {log.destinationId}
                </p>
                {log.errorMessage && (
                  <div className="flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-500 line-clamp-2">
                      {log.errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-4 space-y-3 pt-3 border-t border-border">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Full Timestamp:</span>
                <p className="font-mono mt-1">{log.timestamp}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Message ID:</span>
                <p className="font-mono mt-1">{log.id}</p>
              </div>
            </div>
            
            <div className="text-xs">
              <span className="text-muted-foreground">Flow:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span className="font-mono">{log.sourceId}</span>
                </div>
                <span className="text-muted-foreground">→</span>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span className="font-mono">{log.destinationId}</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}