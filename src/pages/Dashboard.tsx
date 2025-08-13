
import { MetricCard } from "@/components/MetricCard";
import { SystemHealthCard } from "@/components/SystemHealthCard";
import { QuickActionsCard } from "@/components/QuickActionsCard";
import { RecentActivityCard } from "@/components/RecentActivityCard";
import { MobileDashboardStats } from "@/components/MobileDashboardStats";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  RefreshCcw, 
  Smartphone, 
  Activity, 
  CreditCard,
  MessageSquare
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
    navigate("/pairs");
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
            value={12}
            label="Active Pairs"
            subtitle="5 running, 7 paused"
          />
          
          <MetricCard
            icon={<Smartphone className="w-5 h-5" />}
            value={3}
            label="Active Sessions"
            subtitle="All connected"
          />
          
          <MetricCard
            icon={<MessageSquare className="w-5 h-5" />}
            value="1,247"
            label="Messages Today"
            subtitle="↑ 12% from yesterday"
          />
          
          <MetricCard
            icon={<CreditCard className="w-5 h-5" />}
            value="Pro Plan"
            label="Subscription"
            subtitle="Expires Dec 2024"
          />
        </div>
      )}

      {/* System Health Card - Desktop only */}
      {!isMobile && (
        <div className="max-w-sm">
          <SystemHealthCard
            status="operational"
            message="All workers active"
          />
        </div>
      )}

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActionsCard
            onAddPair={handleAddPair}
            onViewPairs={handleViewPairs}
            onManageSessions={handleManageSessions}
            onUpgradePlan={handleUpgradePlan}
          />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivityCard events={recentEvents} />
        </div>
      </div>
    </div>
  );
}
