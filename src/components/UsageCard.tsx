import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UsageItem {
  label: string;
  current: number;
  max: number;
  color?: string;
}

interface UsageCardProps {
  title: string;
  items: UsageItem[];
}

export function UsageCard({ title, items }: UsageCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="text-foreground">
                {item.current} / {item.max}
              </span>
            </div>
            <Progress 
              value={(item.current / item.max) * 100} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}