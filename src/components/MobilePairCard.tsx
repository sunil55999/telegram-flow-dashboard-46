import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Edit, Trash2, ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ForwardingPair {
  id: string;
  name: string;
  sourceChannelId: string;
  destinationChannelId: string;
  status: "active" | "paused" | "error";
  advancedFilters: boolean;
}

interface MobilePairCardProps {
  pair: ForwardingPair;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function MobilePairCard({ pair, onEdit, onDelete, onToggleStatus }: MobilePairCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return { color: "text-green-500", bgColor: "bg-green-500", label: "Active" };
      case "paused":
        return { color: "text-yellow-500", bgColor: "bg-yellow-500", label: "Paused" };
      case "error":
        return { color: "text-red-500", bgColor: "bg-red-500", label: "Error" };
      default:
        return { color: "text-gray-500", bgColor: "bg-gray-500", label: "Unknown" };
    }
  };

  const statusInfo = getStatusInfo(pair.status);

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{pair.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {pair.sourceChannelId} → {pair.destinationChannelId}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${statusInfo.bgColor}`}></div>
                <span className="text-sm capitalize">{statusInfo.label}</span>
                {pair.advancedFilters && (
                  <Badge variant="outline" className="text-xs">
                    Filtered
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Switch
                checked={pair.status === "active"}
                onCheckedChange={() => onToggleStatus(pair.id)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={() => onEdit(pair.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(pair.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="mt-4 space-y-2 pt-2 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Last Activity:</span>
                <p>2 minutes ago</p>
              </div>
              <div>
                <span className="text-muted-foreground">Messages Today:</span>
                <p>127</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p>Dec 15, 2024</p>
              </div>
              <div>
                <span className="text-muted-foreground">Filters:</span>
                <p>{pair.advancedFilters ? "Enabled" : "Disabled"}</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}