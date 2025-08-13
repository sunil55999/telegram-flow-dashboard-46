import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddPairModal } from "@/components/AddPairModal";
import { MobilePairCard } from "@/components/MobilePairCard";
import { Plus, Edit, Trash2, Play, Pause, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface ForwardingPair {
  id: string;
  name: string;
  sourceChannelId: string;
  destinationChannelId: string;
  status: "active" | "paused" | "error";
  advancedFilters: boolean;
}

export default function Pairs() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [pairs, setPairs] = useState<ForwardingPair[]>([
    {
      id: "1",
      name: "News → Private",
      sourceChannelId: "@newschannel",
      destinationChannelId: "@privatechannel",
      status: "active",
      advancedFilters: false,
    },
    {
      id: "2",
      name: "Updates Feed",
      sourceChannelId: "@updates",
      destinationChannelId: "@myupdates",
      status: "paused",
      advancedFilters: true,
    },
    {
      id: "3",
      name: "Tech News",
      sourceChannelId: "@technews",
      destinationChannelId: "@mytechnews",
      status: "active",
      advancedFilters: false,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; pairId?: string; pairName?: string }>({
    open: false
  });

  const filteredPairs = pairs.filter(pair => 
    pair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.sourceChannelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.destinationChannelId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPair = () => {
    setIsAddModalOpen(true);
  };

  const handleSavePair = (pairData: any) => {
    const newPair: ForwardingPair = {
      id: Date.now().toString(),
      name: pairData.name || `${pairData.sourceInput} → ${pairData.destinationInput}`,
      sourceChannelId: pairData.sourceInput,
      destinationChannelId: pairData.destinationInput,
      status: "active",
      advancedFilters: pairData.enableFilters,
    };
    
    setPairs(prev => [...prev, newPair]);
    toast({
      title: "Pair Created",
      description: `Successfully created forwarding pair "${newPair.name}"`,
    });
  };

  const handleEditPair = (pairId: string) => {
    navigate(`/pairs/${pairId}/edit`);
  };

  const handleToggleStatus = async (pairId: string) => {
    setPairs(prev => prev.map(pair => 
      pair.id === pairId 
        ? { ...pair, status: pair.status === "active" ? "paused" : "active" }
        : pair
    ));
    
    const pair = pairs.find(p => p.id === pairId);
    const newStatus = pair?.status === "active" ? "paused" : "active";
    
    toast({
      title: `Pair ${newStatus === "active" ? "Resumed" : "Paused"}`,
      description: `${pair?.name} is now ${newStatus}`,
    });
  };

  const handleDeletePair = (pairId: string) => {
    const pair = pairs.find(p => p.id === pairId);
    setDeleteConfirm({ 
      open: true, 
      pairId, 
      pairName: pair?.name 
    });
  };

  const confirmDelete = () => {
    if (deleteConfirm.pairId) {
      setPairs(prev => prev.filter(p => p.id !== deleteConfirm.pairId));
      toast({
        title: "Pair Deleted",
        description: `Successfully deleted "${deleteConfirm.pairName}"`,
      });
    }
    setDeleteConfirm({ open: false });
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Forwarding Pairs</h1>
          <p className="text-muted-foreground">
            Manage your telegram channel forwarding configurations
          </p>
        </div>
        <Button onClick={handleAddPair} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Pair
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search pairs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredPairs.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No pairs found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPairs.map((pair) => (
            <MobilePairCard
              key={pair.id}
              pair={pair}
              onEdit={handleEditPair}
              onDelete={handleDeletePair}
              onToggleStatus={handleToggleStatus}
            />
          ))
        )}
      </div>

      {/* Desktop Table */}
      <Card className="bg-card border-border hidden md:block">
        <CardHeader>
          <CardTitle className="text-base">Active Pairs ({filteredPairs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Pair Name</TableHead>
                <TableHead>Source Channel ID</TableHead>
                <TableHead>Destination Channel ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPairs.map((pair) => {
                const statusInfo = getStatusInfo(pair.status);
                return (
                  <TableRow 
                    key={pair.id} 
                    className="border-border hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="font-medium">{pair.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {pair.sourceChannelId}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {pair.destinationChannelId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.bgColor}`}></div>
                        <span className="capitalize text-sm">{statusInfo.label}</span>
                        {pair.advancedFilters && (
                          <Badge variant="outline" className="text-xs">
                            Filtered
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPair(pair.id)}
                              aria-label={`Edit pair ${pair.name}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit pair</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(pair.id)}
                              aria-label={`${pair.status === "active" ? "Pause" : "Resume"} pair ${pair.name}`}
                            >
                              {pair.status === "active" ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{pair.status === "active" ? "Pause" : "Resume"} pair</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePair(pair.id)}
                              aria-label={`Delete pair ${pair.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete pair</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Pair Modal */}
      <AddPairModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSavePair}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm({ open })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Forwarding Pair</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm.pairName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}