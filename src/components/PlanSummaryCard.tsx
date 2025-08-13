
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crown, Users, RefreshCw, Zap, Calendar, TrendingUp, Smartphone } from "lucide-react";
import { usePlan, PlanType } from "@/contexts/PlanContext";
import { useNavigate } from "react-router-dom";

const planDetails: Record<PlanType, { 
  name: string; 
  color: string; 
  icon: React.ReactNode;
  description: string;
}> = {
  free: {
    name: "Free Plan",
    color: "bg-gray-500",
    icon: <Zap className="w-4 h-4" />,
    description: "Basic forwarding features"
  },
  basic: {
    name: "Basic Plan", 
    color: "bg-blue-500",
    icon: <Crown className="w-4 h-4" />,
    description: "Enhanced features & no ads"
  },
  plus: {
    name: "Plus Plan",
    color: "bg-purple-500", 
    icon: <Crown className="w-4 h-4" />,
    description: "Unlimited with advanced tools"
  },
  pro: {
    name: "Pro Plan",
    color: "bg-amber-500",
    icon: <Crown className="w-4 h-4" />,
    description: "All features & premium support"
  }
};

export function PlanSummaryCard() {
  const { currentPlan, features, limits } = usePlan();
  const navigate = useNavigate();
  const plan = planDetails[currentPlan];
  
  const formatUsage = (used: number, max: number) => {
    if (max === -1) return "Unlimited";
    return `${used} / ${max}`;
  };

  const getUsagePercentage = (used: number, max: number) => {
    if (max === -1) return 0;
    return (used / max) * 100;
  };

  const isPlanMaxed = currentPlan === 'pro';

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md ${plan.color} text-white`}>
              {plan.icon}
            </div>
            <div>
              <CardTitle className="text-base">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
          </div>
          {!isPlanMaxed && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate('/subscription')}
              className="shrink-0"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Expiry Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Expires</span>
          </div>
          <span className="text-sm font-medium">Dec 31, 2024</span>
        </div>

        {/* Usage Counters */}
        <div className="space-y-3">
          {/* Pairs Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span>Pairs</span>
              </div>
              <span className="font-medium">
                {formatUsage(limits.pairsUsed, features.maxPairs)}
              </span>
            </div>
            {features.maxPairs !== -1 && (
              <Progress 
                value={getUsagePercentage(limits.pairsUsed, features.maxPairs)} 
                className="h-2"
              />
            )}
          </div>

          {/* Telegram Accounts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span>Telegram Accounts</span>
              </div>
              <span className="font-medium">
                {formatUsage(limits.telegramAccountsUsed, features.maxTelegramAccounts)}
              </span>
            </div>
            {features.maxTelegramAccounts !== -1 && (
              <Progress 
                value={getUsagePercentage(limits.telegramAccountsUsed, features.maxTelegramAccounts)} 
                className="h-2"
              />
            )}
          </div>

          {/* Redirections Usage - Basic+ */}
          {currentPlan !== 'free' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Redirections</span>
                </div>
                <span className="font-medium">
                  {formatUsage(limits.redirectionsUsed, features.maxRedirections)}
                </span>
              </div>
              {features.maxRedirections !== -1 && (
                <Progress 
                  value={getUsagePercentage(limits.redirectionsUsed, features.maxRedirections)} 
                  className="h-2"
                />
              )}
            </div>
          )}

          {/* Multi Setups - Basic+ */}
          {currentPlan !== 'free' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span>Multi Setups</span>
                </div>
                <span className="font-medium">
                  {formatUsage(limits.multiSetupsUsed, features.maxMultiSetups)}
                </span>
              </div>
              {features.maxMultiSetups !== -1 && (
                <Progress 
                  value={getUsagePercentage(limits.multiSetupsUsed, features.maxMultiSetups)} 
                  className="h-2"
                />
              )}
            </div>
          )}
        </div>

        {/* Free Plan Upgrade Message */}
        {currentPlan === 'free' && (
          <div className="p-3 rounded-md bg-muted/50 border-l-4 border-primary">
            <p className="text-sm text-muted-foreground">
              Upgrade for edit/delete pairs, cloning, and advanced features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
