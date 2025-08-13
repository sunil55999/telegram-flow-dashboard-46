
import { MobileStatsCard } from "@/components/MobileStatsCard";
import { 
  RefreshCcw, 
  Smartphone, 
  Activity, 
  CreditCard,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export function MobileDashboardStats() {
  const stats = [
    {
      title: "Active Pairs",
      value: "12",
      description: "5 running, 7 paused",
      icon: RefreshCcw,
      trend: { value: "+2 this week", isPositive: true }
    },
    {
      title: "Messages Today",
      value: "1,247",
      description: "Successfully forwarded",
      icon: MessageSquare,
      trend: { value: "↑ 12% from yesterday", isPositive: true }
    },
    {
      title: "Active Sessions",
      value: "3",
      description: "All connected",
      icon: Smartphone,
      trend: { value: "All healthy", isPositive: true }
    },
    {
      title: "Subscription",
      value: "Pro Plan",
      description: "Expires Dec 2024",
      icon: CreditCard,
    },
    {
      title: "Success Rate",
      value: "98.5%",
      description: "Last 24 hours",
      icon: CheckCircle,
      trend: { value: "↑ 0.3% from yesterday", isPositive: true }
    },
    {
      title: "Avg Response",
      value: "1.2s",
      description: "Message processing time",
      icon: Clock,
      trend: { value: "↓ 0.2s faster", isPositive: true }
    },
    {
      title: "Errors",
      value: "3",
      description: "Require attention",
      icon: AlertCircle,
      trend: { value: "2 resolved today", isPositive: true }
    },
    {
      title: "Uptime",
      value: "99.9%",
      description: "System availability",
      icon: Activity,
      trend: { value: "Last 30 days", isPositive: true }
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <MobileStatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
