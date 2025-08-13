import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";
import { MobileLogCard } from "@/components/MobileLogCard";
import { MobileFilterDrawer } from "@/components/MobileFilterDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogEntry {
  id: string;
  timestamp: string;
  sourceId: string;
  destinationId: string;
  messageType: string;
  status: "success" | "failed" | "pending";
  errorMessage?: string;
}

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const isMobile = useIsMobile();

  const logs: LogEntry[] = [
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      sourceId: "@newschannel",
      destinationId: "@privatechannel",
      messageType: "text",
      status: "success",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:29:18",
      sourceId: "@updates",
      destinationId: "@myupdates",
      messageType: "photo",
      status: "success",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:28:45",
      sourceId: "@technews",
      destinationId: "@mytechnews",
      messageType: "text",
      status: "failed",
      errorMessage: "Rate limit exceeded",
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:27:12",
      sourceId: "@newschannel",
      destinationId: "@privatechannel",
      messageType: "video",
      status: "success",
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:26:03",
      sourceId: "@updates",
      destinationId: "@myupdates",
      messageType: "document",
      status: "pending",
    },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.sourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destinationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.messageType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Success</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="mobile-flex-stack items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Forwarding Logs</h1>
          <p className="text-muted-foreground mobile-text-size">
            Monitor message forwarding activity and troubleshoot issues
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isMobile && (
            <MobileFilterDrawer
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
              onClearFilters={handleClearFilters}
            />
          )}
          <Button variant="outline" className="mobile-button-full">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Desktop Filters */}
      {!isMobile && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleClearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-muted-foreground">Success</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {logs.filter(log => log.status === "success").length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-muted-foreground">Failed</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {logs.filter(log => log.status === "failed").length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-1">
              {logs.filter(log => log.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs sm:text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-lg sm:text-2xl font-bold mt-1">{logs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Log Cards */}
      {isMobile ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Recent Activity ({filteredLogs.length})
            </h2>
          </div>
          {filteredLogs.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No logs found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <MobileLogCard key={log.id} log={log} />
            ))
          )}
        </div>
      ) : (
        /* Desktop Logs Table */
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">
              Recent Activity ({filteredLogs.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Source ID</TableHead>
                  <TableHead>Destination ID</TableHead>
                  <TableHead>Message Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-border">
                    <TableCell className="font-mono text-sm">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.sourceId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.destinationId}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.messageType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.errorMessage || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No logs found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}