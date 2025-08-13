
import { MetricCard } from "@/components/MetricCard";
import { SystemHealthCard } from "@/components/SystemHealthCard";
import { QuickActionsCard } from "@/components/QuickActionsCard";
import { RecentActivityCard } from "@/components/RecentActivityCard";
import { MobileDashboardStats } from "@/components/MobileDashboardStats";
import { PlanSummaryCard } from "@/components/PlanSummaryCard";
import { FeatureLock } from "@/components/FeatureLock";
import { usePlan } from "@/contexts/PlanContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  RefreshCcw, 
  Smartphone, 
  Activity, 
  CreditCard,
  MessageSquare,
  Users,
  Zap
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { currentPlan, features, limits, canCreatePair } = usePlan();
  
  // Mock recent activity data
  const recentEvents = [
    {
      id: "1",
      type: "success" as const,
      message: "Message forwarded successfully",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      pairName: "News → Private"
    },
    {
      id: "2", 
      type: "success" as const,
      message: "Pair created and activated",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      pairName: "Tech Updates"
    },
    {
      id: "3",
      type: "error" as const,
      message: "Failed to forward: destination unreachable",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      pairName: "Breaking News"
    },
    {
      id: "4",
      type: "paused" as const,
      message: "Pair paused by user",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      pairName: "Updates Feed"
    }
  ];

  const handleAddPair = () => {
    if (canCreatePair()) {
      navigate("/pairs");
    }
  };

  const handleViewPairs = () => {
    navigate("/pairs");
  };

  const handleManageSessions = () => {
    navigate("/sessions");
  };

  const handleUpgradePlan = () => {
    navigate("/subscription");
  };

  const handleManageFilters = () => {
    if (features.filters) {
      navigate("/filters");
    }
  };

  const getUsageDisplay = (used: number, max: number) => {
    return max === -1 ? `${used}` : `${used}/${max}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mobile-text-size">
          Monitor your Telegram forwarding activity and system health
        </p>
      </div>

      {/* Mobile Stats Grid */}
      {isMobile ? (
        <MobileDashboardStats />
      ) : (
        /* Desktop Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={<RefreshCcw className="w-5 h-5" />}
            value={getUsageDisplay(limits.pairsUsed, features.maxPairs)}
            label="Active Pairs"
            subtitle={features.maxPairs === -1 ? "Unlimited" : `${limits.pairsUsed} of ${features.maxPairs} used`}
          />
          
          <MetricCard
            icon={<Smartphone className="w-5 h-5" />}
            value={3}
            label="Active Sessions"
            subtitle="All connected"
          />
          
          {currentPlan !== 'free' && (
            <MetricCard
              icon={<Users className="w-5 h-5" />}
              value={getUsageDisplay(limits.redirectionsUsed, features.maxRedirections)}
              label="Redirections"
              subtitle={features.maxRedirections === -1 ? "Unlimited" : `${limits.redirectionsUsed} of ${features.maxRedirections} used`}
            />
          )}
          
          {currentPlan !== 'free' ? (
            <MetricCard
              icon={<Zap className="w-5 h-5" />}
              value={getUsageDisplay(limits.multiSetupsUsed, features.maxMultiSetups)}
              label="Multi Setups"
              subtitle={features.maxMultiSetups === -1 ? "Unlimited" : `${limits.multiSetupsUsed} of ${features.maxMultiSetups} used`}
            />
          ) : (
            <MetricCard
              icon={<CreditCard className="w-5 h-5" />}
              value="Free Plan"
              label="Subscription"
              subtitle="Upgrade for more features"
            />
          )}
        </div>
      )}

      {/* Plan Summary & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Plan Summary */}
        <div className="lg:col-span-1">
          <PlanSummaryCard />
        </div>

        {/* System Health - Desktop only */}
        {!isMobile && (
          <div className="lg:col-span-1">
            <SystemHealthCard
              status="operational"
              message="All workers active"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActionsCard
            onAddPair={handleAddPair}
            onViewPairs={handleViewPairs}
            onManageSessions={handleManageSessions}
            onUpgradePlan={handleUpgradePlan}
            onManageFilters={features.filters ? handleManageFilters : undefined}
            canCreatePair={canCreatePair()}
            canManageFilters={features.filters}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1">
        <RecentActivityCard events={recentEvents} />
      </div>

      {/* Feature Previews for Free Users */}
      {currentPlan === 'free' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureLock
            requiredPlan="basic"
            title="Advanced Filtering"
            description="Filter messages by keywords, media type, and custom rules"
          />
          <FeatureLock
            requiredPlan="plus"
            title="Message Transformation"
            description="Modify messages before forwarding with custom templates"
          />
        </div>
      )}
    </div>
  );
}
