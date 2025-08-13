import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureLock } from "@/components/FeatureLock";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  RefreshCcw,
  Search,
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  Lock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlan } from "@/contexts/PlanContext";

interface Pair {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: 'active' | 'paused' | 'error';
}

function getStatusVariant(status: Pair['status']) {
  switch (status) {
    case 'active': return "default";
    case 'paused': return "secondary";
    case 'error': return "destructive";
    default: return "outline";
  }
}

interface MobilePairsListProps {
  pairs: Pair[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onClone?: (id: string) => void;
  onAdd: () => void;
  canAdd: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

function MobilePairsList({
  pairs,
  onEdit,
  onDelete,
  onToggleStatus,
  onClone,
  onAdd,
  canAdd,
  searchTerm,
  onSearchChange
}: MobilePairsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Pairs ({pairs.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {pairs.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCcw className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No pairs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Try adjusting your search."
                : "Create your first forwarding pair to get started."
              }
            </p>
            {canAdd && (
              <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Pair
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pairs.map((pair) => (
              <div
                key={pair.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={pair.status === 'active'}
                      onCheckedChange={() => onToggleStatus(pair.id)}
                    />
                    <div>
                      <h4 className="font-medium">{pair.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {pair.source} → {pair.destination}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant={getStatusVariant(pair.status)}>
                    {pair.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {onClone && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClone(pair.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(pair.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(pair.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Logs</DropdownMenuItem>
                      <DropdownMenuItem>Export Config</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Pairs() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { canCreatePair, canEditDeletePair, canClonePair, features, limits } = usePlan();
  
  const [pairs, setPairs] = useState<Pair[]>([
    {
      id: "1",
      name: "Telegram Channel to Discord",
      source: "Telegram Channel A",
      destination: "Discord Channel B",
      status: 'active'
    },
    {
      id: "2",
      name: "Telegram Group to Slack",
      source: "Telegram Group C",
      destination: "Slack Channel D",
      status: 'paused'
    },
    {
      id: "3",
      name: "Telegram Alerts to Email",
      source: "Telegram Alerts Channel",
      destination: "alerts@example.com",
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Pair["status"]>("all");

  const handleEdit = (pairId: string) => {
    if (!canEditDeletePair()) {
      toast({
        title: "Feature Locked",
        description: "Editing pairs requires Basic plan or higher",
        variant: "destructive"
      });
      return;
    }
    navigate(`/pairs/edit/${pairId}`);
  };

  const handleDelete = (pairId: string) => {
    if (!canEditDeletePair()) {
      toast({
        title: "Feature Locked",
        description: "Deleting pairs requires Basic plan or higher",
        variant: "destructive"
      });
      return;
    }
    
    setPairs(prev => prev.filter(p => p.id !== pairId));
    toast({
      title: "Pair deleted",
      description: "The forwarding pair has been removed."
    });
  };

  const handleClone = (pairId: string) => {
    if (!canClonePair()) {
      toast({
        title: "Feature Locked",
        description: "Cloning pairs requires Basic plan or higher",
        variant: "destructive"
      });
      return;
    }

    const pairToClone = pairs.find(p => p.id === pairId);
    if (!pairToClone) return;

    if (!canCreatePair()) {
      toast({
        title: "Limit Reached",
        description: `You've reached the maximum number of pairs (${features.maxPairs})`,
        variant: "destructive"
      });
      return;
    }

    const clonedPair = {
      ...pairToClone,
      id: Date.now().toString(),
      name: `${pairToClone.name} (Copy)`,
      status: 'paused' as const
    };

    setPairs(prev => [...prev, clonedPair]);
    toast({
      title: "Pair cloned successfully",
      description: `Created "${clonedPair.name}" from original pair`
    });
  };

  const handleToggleStatus = (pairId: string) => {
    setPairs(prev => prev.map(pair =>
      pair.id === pairId
        ? { ...pair, status: pair.status === 'active' ? 'paused' : 'active' }
        : pair
    ));
  };

  const handleAdd = () => {
    navigate("/pairs/new");
  };

  const filteredPairs = pairs.filter(pair => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      pair.name.toLowerCase().includes(searchTermLower) ||
      pair.source.toLowerCase().includes(searchTermLower) ||
      pair.destination.toLowerCase().includes(searchTermLower);

    const matchesStatus = statusFilter === "all" || pair.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const canEdit = canEditDeletePair();
  const canDelete = canEditDeletePair();
  const canClone = canClonePair();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Forwarding Pairs</h1>
          <p className="text-muted-foreground mobile-text-size">
            Manage your message forwarding configurations
          </p>
        </div>
        <Button 
          onClick={handleAdd}
          disabled={!canCreatePair()}
          className="mobile-button-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pair
          {!canCreatePair() && <Lock className="w-4 h-4 ml-2" />}
        </Button>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pairs</p>
                <p className="text-2xl font-bold">{pairs.length}</p>
              </div>
              <RefreshCcw className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {features.maxPairs === -1 
                  ? "Unlimited" 
                  : `${pairs.length} / ${features.maxPairs} used`
                }
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {pairs.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paused</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pairs.filter(p => p.status === 'paused').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search pairs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: "all" | Pair["status"]) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pairs List */}
      {isMobile ? (
        <MobilePairsList
          pairs={filteredPairs}
          onEdit={canEdit ? handleEdit : () => {}}
          onDelete={canDelete ? handleDelete : () => {}}
          onToggleStatus={handleToggleStatus}
          onAdd={handleAdd}
          onClone={canClone ? handleClone : undefined}
          canAdd={canCreatePair()}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Pairs ({filteredPairs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPairs.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCcw className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No pairs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? "Try adjusting your search or filter criteria."
                    : "Create your first forwarding pair to get started."
                  }
                </p>
                {canCreatePair() && (
                  <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Pair
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPairs.map((pair) => (
                  <div
                    key={pair.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={pair.status === 'active'}
                          onCheckedChange={() => handleToggleStatus(pair.id)}
                        />
                        <div>
                          <h4 className="font-medium">{pair.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pair.source} → {pair.destination}
                          </p>
                        </div>
                      </div>
                      
                      <Badge variant={getStatusVariant(pair.status)}>
                        {pair.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {canClone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClone(pair.id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {canEdit ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(pair.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="opacity-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {canDelete ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(pair.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Logs</DropdownMenuItem>
                          <DropdownMenuItem>Export Config</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Free Plan Upgrade Prompt */}
      {!canEditDeletePair() && (
        <FeatureLock
          requiredPlan="basic"
          title="Enhanced Pair Management"
          description="Upgrade to Basic plan to edit, delete, and clone your forwarding pairs."
          className="mt-6"
        />
      )}
    </div>
  );
}
