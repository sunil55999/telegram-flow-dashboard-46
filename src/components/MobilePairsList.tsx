
import { useState } from "react";
import { MobilePairCard } from "@/components/MobilePairCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SortAsc, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ForwardingPair {
  id: string;
  name: string;
  sourceChannelId: string;
  destinationChannelId: string;
  status: "active" | "paused" | "error";
  advancedFilters: boolean;
}

interface MobilePairsListProps {
  pairs: ForwardingPair[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onAdd: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function MobilePairsList({
  pairs,
  onEdit,
  onDelete,
  onToggleStatus,
  onAdd,
  searchTerm,
  onSearchChange
}: MobilePairsListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const filteredPairs = pairs
    .filter(pair => {
      const matchesSearch = 
        pair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pair.sourceChannelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pair.destinationChannelId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || pair.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "recent":
          return b.id.localeCompare(a.id); // Assuming newer IDs are larger
        default:
          return 0;
      }
    });

  const handleClearFilters = () => {
    onSearchChange("");
    setStatusFilter("all");
    setSortBy("name");
  };

  return (
    <div className="space-y-4">
      {/* Mobile Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search pairs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mobile-touch-target">
              <Filter className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh] bg-card border-border">
            <SheetHeader>
              <SheetTitle>Filter & Sort</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-500">
              {pairs.filter(p => p.status === "active").length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding text-center">
            <div className="text-lg sm:text-2xl font-bold text-yellow-500">
              {pairs.filter(p => p.status === "paused").length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Paused</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="mobile-card-padding text-center">
            <div className="text-lg sm:text-2xl font-bold text-red-500">
              {pairs.filter(p => p.status === "error").length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">Error</div>
          </CardContent>
        </Card>
      </div>

      {/* Pairs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Pairs ({filteredPairs.length})
          </h2>
          <Button onClick={onAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        
        {filteredPairs.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {pairs.length === 0 
                  ? "No forwarding pairs created yet" 
                  : "No pairs found matching your criteria"}
              </p>
              {pairs.length === 0 && (
                <Button onClick={onAdd} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Pair
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPairs.map((pair) => (
            <MobilePairCard
              key={pair.id}
              pair={pair}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
