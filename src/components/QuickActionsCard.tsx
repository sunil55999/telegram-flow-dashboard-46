
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone, CreditCard, RefreshCcw, TrendingUp, Settings, Filter, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsCardProps {
  onAddPair: () => void;
  onViewPairs: () => void;
  onManageSessions: () => void;
  onUpgradePlan: () => void;
  onManageFilters?: () => void;
  canCreatePair: boolean;
  canManageFilters: boolean;
}

export function QuickActionsCard({ 
  onAddPair, 
  onViewPairs, 
  onManageSessions, 
  onUpgradePlan,
  onManageFilters,
  canCreatePair,
  canManageFilters
}: QuickActionsCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="mobile-form-spacing">
        <div className="grid grid-cols-1 gap-2 sm:gap-3">
          <Button 
            className="w-full justify-start text-sm sm:text-base mobile-touch-target" 
            variant="outline"
            onClick={onAddPair}
            disabled={!canCreatePair}
            aria-label="Add new forwarding pair"
          >
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Add Pair</span>
            {!canCreatePair && <Lock className="w-4 h-4 ml-auto" />}
          </Button>
          
          <Button 
            className="w-full justify-start text-sm sm:text-base mobile-touch-target" 
            variant="outline"
            onClick={onViewPairs}
            aria-label="View all forwarding pairs"
          >
            <RefreshCcw className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>View Pairs</span>
          </Button>
          
          <Button 
            className="w-full justify-start text-sm sm:text-base mobile-touch-target" 
            variant="outline"
            onClick={onManageSessions}
            aria-label="Manage telegram sessions"
          >
            <Smartphone className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Manage Sessions</span>
          </Button>

          {canManageFilters ? (
            <Button 
              className="w-full justify-start text-sm sm:text-base mobile-touch-target" 
              variant="outline"
              onClick={onManageFilters}
              aria-label="Manage message filters"
            >
              <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Manage Filters</span>
            </Button>
          ) : (
            <Button 
              className="w-full justify-start text-sm sm:text-base mobile-touch-target opacity-50" 
              variant="outline"
              disabled
              aria-label="Manage filters - requires Plus plan"
            >
              <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Manage Filters</span>
              <Lock className="w-4 h-4 ml-auto" />
            </Button>
          )}
          
          <Button 
            className="w-full justify-start text-sm sm:text-base mobile-touch-target" 
            variant="outline"
            onClick={() => navigate("/logs")}
            aria-label="View activity logs"
          >
            <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>View Logs</span>
          </Button>
          
          <Button 
            className="w-full justify-start text-sm sm:text-base mobile-touch-target" 
            variant="outline"
            onClick={() => navigate("/settings")}
            aria-label="Open settings"
          >
            <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Settings</span>
          </Button>
          
          <Button 
            className="w-full justify-start text-sm sm:text-base mobile-touch-target" 
            variant="outline"
            onClick={onUpgradePlan}
            aria-label="Upgrade subscription plan"
          >
            <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Upgrade Plan</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
