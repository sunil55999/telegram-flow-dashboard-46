
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, Zap } from "lucide-react";
import { usePlan, PlanType } from "@/contexts/PlanContext";
import { useNavigate } from "react-router-dom";

interface FeatureLockProps {
  feature?: string;
  requiredPlan: PlanType;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'card' | 'inline' | 'overlay';
}

const planIcons: Record<PlanType, React.ReactNode> = {
  free: <Zap className="w-4 h-4" />,
  basic: <Crown className="w-4 h-4" />,
  plus: <Crown className="w-4 h-4" />,
  pro: <Crown className="w-4 h-4" />,
};

const planColors: Record<PlanType, string> = {
  free: 'bg-gray-500',
  basic: 'bg-blue-500',
  plus: 'bg-purple-500',
  pro: 'bg-gold-500',
};

export function FeatureLock({
  feature,
  requiredPlan,
  title,
  description,
  children,
  className = "",
  variant = 'card'
}: FeatureLockProps) {
  const { currentPlan, isFeatureAvailable } = usePlan();
  const navigate = useNavigate();

  const isAvailable = feature ? isFeatureAvailable(feature as any) : 
    getPlanLevel(currentPlan) >= getPlanLevel(requiredPlan);

  if (isAvailable) {
    return <>{children}</>;
  }

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 p-2 rounded-md bg-muted/50 border ${className}`}>
        <Lock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground flex-1">{title}</span>
        <Badge variant="outline" className="text-xs">
          {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
        </Badge>
        <Button size="sm" variant="outline" onClick={handleUpgrade}>
          Upgrade
        </Button>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={`relative ${className}`}>
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
          <div className="text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <h4 className="font-medium mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
            <Button size="sm" onClick={handleUpgrade}>
              {planIcons[requiredPlan]}
              Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`bg-muted/30 border-dashed ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={handleUpgrade} className="w-full">
          {planIcons[requiredPlan]}
          Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}
        </Button>
      </CardContent>
    </Card>
  );
}

function getPlanLevel(plan: PlanType): number {
  const levels = { free: 0, basic: 1, plus: 2, pro: 3 };
  return levels[plan];
}
