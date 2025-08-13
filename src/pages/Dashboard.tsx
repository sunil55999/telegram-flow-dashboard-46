
import { MetricCard } from "@/components/MetricCard";
import { SystemHealthCard } from "@/components/SystemHealthCard";
import { QuickActionsCard } from "@/components/QuickActionsCard";
import { RecentActivityCard } from "@/components/RecentActivityCard";
import { MobileDashboardStats } from "@/components/MobileDashboardStats";
import { PlanSummaryCard } from "@/components/PlanSummaryCard";
import { FeatureLock } from "@/components/FeatureLock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight
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
      navigate("/pairs/new");
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

  const getUsagePercentage = (used: number, max: number) => {
    if (max === -1) return 0;
    return Math.min((used / max) * 100, 100);
  };

  // Enhanced stats for better dashboard
  const enhancedStats = [
    {
      title: "Active Pairs",
      value: getUsageDisplay(limits.pairsUsed, features.maxPairs),
      icon: RefreshCcw,
      trend: "+2 this week",
      isPositive: true,
      progress: getUsagePercentage(limits.pairsUsed, features.maxPairs),
      subtitle: features.maxPairs === -1 ? "Unlimited" : `${limits.pairsUsed} of ${features.maxPairs} used`
    },
    {
      title: "Messages Today",
      value: "1,247",
      icon: MessageSquare,
      trend: "↑ 12%",
      isPositive: true,
      subtitle: "Successfully forwarded"
    },
    {
      title: "Success Rate",
      value: "98.5%",
      icon: CheckCircle2,
      trend: "↑ 0.3%",
      isPositive: true,
      subtitle: "Last 24 hours"
    },
    {
      title: "Active Sessions",
      value: "3",
      icon: Smartphone,
      subtitle: "All connected",
      status: "healthy"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mobile-text-size">
            Here's what's happening with your Telegram forwarding
          </p>
        </div>
        
        {/* Plan Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={currentPlan === 'pro' ? 'default' : 'secondary'} className="capitalize">
            {currentPlan} Plan
          </Badge>
          {currentPlan !== 'pro' && (
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleUpgradePlan}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Upgrade
            </Badge>
          )}
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      {isMobile ? (
        <MobileDashboardStats />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {enhancedStats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </span>
                  </div>
                  {stat.status === 'healthy' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
                
                <div className="mb-1">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  {stat.trend && (
                    <span className={`ml-2 text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {stat.subtitle}
                </p>
                
                {stat.progress !== undefined && stat.progress > 0 && (
                  <Progress value={stat.progress} className="h-1" />
                )}
              </CardContent>
              
              {/* Subtle gradient overlay for visual interest */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 pointer-events-none" />
            </Card>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column - Plan & Quick Actions */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <PlanSummaryCard />
          
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

        {/* Right Column - Activity & System Health */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {/* System Health - Enhanced for desktop */}
          {!isMobile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SystemHealthCard
                status="operational"
                message="All workers active"
              />
              
              {/* Performance Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Response</span>
                    <span className="text-sm font-medium">1.2s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Errors Today</span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                      3
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <RecentActivityCard events={recentEvents} />
        </div>
      </div>

      {/* Feature Previews for Free/Basic Users */}
      {(currentPlan === 'free' || currentPlan === 'basic') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Unlock More Features</h2>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={handleUpgradePlan}
            >
              <ArrowUpRight className="w-3 h-3 mr-1" />
              See All Plans
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlan === 'free' && (
              <>
                <FeatureLock
                  requiredPlan="basic"
                  title="Advanced Pair Management"
                  description="Edit, delete, and clone your forwarding pairs with enhanced controls"
                />
                <FeatureLock
                  requiredPlan="plus"
                  title="Message Scheduling"
                  description="Schedule when messages should be forwarded with time-based rules"
                />
              </>
            )}
            
            {currentPlan === 'basic' && (
              <>
                <FeatureLock
                  requiredPlan="plus"
                  title="Message Transformation"
                  description="Modify messages before forwarding with custom templates and rules"
                />
                <FeatureLock
                  requiredPlan="pro"
                  title="Advanced Analytics"
                  description="Detailed insights, user filtering, and premium features"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
