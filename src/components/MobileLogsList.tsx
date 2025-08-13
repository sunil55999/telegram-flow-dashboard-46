
import { useState } from "react";
import { MobileLogCard } from "@/components/MobileLogCard";
import { MobileFilterDrawer } from "@/components/MobileFilterDrawer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Filter } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  sourceId: string;
  destinationId: string;
  messageType: string;
  status: "success" | "failed" | "pending";
  errorMessage?: string;
}

interface MobileLogsListProps {
  logs: LogEntry[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  onClearFilters: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

export function MobileLogsList({
  logs,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  onClearFilters,
  onExport,
  onRefresh
}: MobileLogsListProps) {
  const [refreshing, setRefreshing] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.sourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destinationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.messageType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (dateFilter !== "all") count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Mobile Actions Bar */}
      <div className="flex items-center gap-2">
        <MobileFilterDrawer
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
          dateFilter={dateFilter}
          onDateChange={onDateChange}
          onClearFilters={onClearFilters}
        />
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="mobile-touch-target"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExport}
          className="mobile-touch-target"
        >
          <Download className="w-4 h-4" />
        </Button>
        
        {getActiveFiltersCount() > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
          </Badge>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Success</span>
            </div>
            <p className="text-lg sm:text-xl font-bold">
              {logs.filter(log => log.status === "success").length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Failed</span>
            </div>
            <p className="text-lg sm:text-xl font-bold">
              {logs.filter(log => log.status === "failed").length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="text-lg sm:text-xl font-bold">
              {logs.filter(log => log.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="text-lg sm:text-xl font-bold">{logs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Recent Activity ({filteredLogs.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
        
        {filteredLogs.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {logs.length === 0 
                  ? "No activity logs yet" 
                  : "No logs found matching your criteria"}
              </p>
              {getActiveFiltersCount() > 0 && (
                <Button variant="outline" onClick={onClearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <MobileLogCard key={log.id} log={log} />
            ))}
            
            {/* Load More Button for pagination */}
            {filteredLogs.length >= 20 && (
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Button variant="outline" className="w-full">
                    Load More Logs
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
