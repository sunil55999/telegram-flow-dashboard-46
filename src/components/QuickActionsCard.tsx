import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Smartphone, CreditCard, RefreshCcw } from "lucide-react";

interface QuickActionsCardProps {
  onAddPair: () => void;
  onViewPairs: () => void;
  onManageSessions: () => void;
  onUpgradePlan: () => void;
}

export function QuickActionsCard({ 
  onAddPair, 
  onViewPairs, 
  onManageSessions, 
  onUpgradePlan 
}: QuickActionsCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={onAddPair}
          aria-label="Add new forwarding pair"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pair
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={onViewPairs}
          aria-label="View all forwarding pairs"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          View Pairs
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={onManageSessions}
          aria-label="Manage telegram sessions"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Manage Sessions
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={onUpgradePlan}
          aria-label="Upgrade subscription plan"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
}