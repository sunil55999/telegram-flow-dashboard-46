
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FeatureLock } from "@/components/FeatureLock";
import { usePlan } from "@/contexts/PlanContext";
import { Filter, Plus, Trash2, Search, Type, Image, Video, File, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FilterRule {
  id: string;
  name: string;
  type: 'keyword' | 'media' | 'url' | 'custom';
  condition: string;
  action: 'block' | 'allow' | 'modify';
  enabled: boolean;
}

export default function Filters() {
  const { toast } = useToast();
  const { features } = usePlan();
  
  const [filters, setFilters] = useState<FilterRule[]>([
    {
      id: "1",
      name: "Block Spam Keywords",
      type: "keyword",
      condition: "spam, advertisement, crypto",
      action: "block",
      enabled: true
    },
    {
      id: "2", 
      name: "Allow Only Images",
      type: "media",
      condition: "images",
      action: "allow",
      enabled: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newFilter, setNewFilter] = useState({
    name: "",
    type: "keyword" as FilterRule['type'],
    condition: "",
    action: "block" as FilterRule['action']
  });

  if (!features.filters) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Message Filters</h1>
          <p className="text-muted-foreground">
            Advanced filtering requires Plus plan or higher
          </p>
        </div>

        <FeatureLock
          requiredPlan="plus"
          title="Message Filters"
          description="Create custom rules to filter, block, or modify messages before forwarding. Available with Plus and Pro plans."
          className="max-w-2xl"
        />
      </div>
    );
  }

  const filteredFilters = filters.filter(filter =>
    filter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filter.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFilter = () => {
    if (!newFilter.name || !newFilter.condition) {
      toast({
        title: "Missing Information",
        description: "Please provide filter name and condition",
        variant: "destructive"
      });
      return;
    }

    const filter: FilterRule = {
      id: Date.now().toString(),
      ...newFilter,
      enabled: true
    };

    setFilters(prev => [...prev, filter]);
    setNewFilter({
      name: "",
      type: "keyword",
      condition: "",
      action: "block"
    });

    toast({
      title: "Filter Added",
      description: `Created filter rule "${filter.name}"`
    });
  };

  const handleDeleteFilter = (filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
    toast({
      title: "Filter Deleted",
      description: "Filter rule has been removed"
    });
  };

  const handleToggleFilter = (filterId: string) => {
    setFilters(prev => prev.map(filter =>
      filter.id === filterId
        ? { ...filter, enabled: !filter.enabled }
        : filter
    ));
  };

  const getFilterIcon = (type: FilterRule['type']) => {
    switch (type) {
      case 'keyword': return <Type className="w-4 h-4" />;
      case 'media': return <Image className="w-4 h-4" />;
      case 'url': return <Link className="w-4 h-4" />;
      default: return <Filter className="w-4 h-4" />;
    }
  };

  const getActionBadge = (action: FilterRule['action']) => {
    const colors = {
      block: 'bg-red-500',
      allow: 'bg-green-500', 
      modify: 'bg-blue-500'
    };
    return (
      <Badge variant="outline" className={`${colors[action]} text-white border-0`}>
        {action}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Message Filters</h1>
        <p className="text-muted-foreground">
          Create custom rules to control message forwarding behavior
        </p>
      </div>

      {/* Add New Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filter Name</Label>
              <Input
                placeholder="e.g., Block Spam Messages"
                value={newFilter.name}
                onChange={(e) => setNewFilter(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Filter Type</Label>
              <select
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                value={newFilter.type}
                onChange={(e) => setNewFilter(prev => ({ ...prev, type: e.target.value as FilterRule['type'] }))}
              >
                <option value="keyword">Keyword</option>
                <option value="media">Media Type</option>
                <option value="url">URL/Link</option>
                <option value="custom">Custom Rule</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Condition</Label>
            <Textarea
              placeholder="Enter keywords separated by commas, or custom condition..."
              value={newFilter.condition}
              onChange={(e) => setNewFilter(prev => ({ ...prev, condition: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label>Action</Label>
              <select
                className="px-3 py-2 rounded-md border border-input bg-background"
                value={newFilter.action}
                onChange={(e) => setNewFilter(prev => ({ ...prev, action: e.target.value as FilterRule['action'] }))}
              >
                <option value="block">Block Message</option>
                <option value="allow">Allow Only</option>
                <option value="modify">Modify Message</option>
              </select>
            </div>
            
            <Button onClick={handleAddFilter}>
              <Plus className="w-4 h-4 mr-2" />
              Add Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search filters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Filters ({filteredFilters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFilters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No filters found</p>
              {searchTerm && (
                <p className="text-sm">Try adjusting your search terms</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFilters.map((filter, index) => (
                <div key={filter.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getFilterIcon(filter.type)}
                        <div>
                          <h4 className="font-medium">{filter.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {filter.condition}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getActionBadge(filter.action)}
                        <Badge variant="outline" className="capitalize">
                          {filter.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={filter.enabled}
                        onCheckedChange={() => handleToggleFilter(filter.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFilter(filter.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {index < filteredFilters.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm">Blocked Messages</span>
            </div>
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm">Allowed Messages</span>
            </div>
            <p className="text-2xl font-bold">3,892</p>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm">Modified Messages</span>
            </div>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
