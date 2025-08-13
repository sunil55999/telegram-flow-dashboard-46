import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "2 Sessions",
      "5 Forwarding Pairs",
      "1,000 Messages/month",
      "Basic Support",
    ],
    limitations: [
      "No advanced filters",
      "No custom delays",
    ],
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    popular: true,
    features: [
      "10 Sessions",
      "50 Forwarding Pairs",
      "100,000 Messages/month",
      "Advanced Filters",
      "Custom Delays",
      "Priority Support",
    ],
  },
  {
    name: "Elite",
    price: "$29.99",
    period: "per month",
    features: [
      "Unlimited Sessions",
      "Unlimited Pairs",
      "1,000,000 Messages/month",
      "All Pro Features",
      "API Access",
      "Dedicated Support",
      "Custom Integrations",
    ],
  },
];

export default function Subscription() {
  const currentPlan = "Free";
  const usage = {
    sessions: { current: 3, max: 10 },
    pairs: { current: 12, max: 50 },
    messages: { current: 24750, max: 100000 },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your plan and monitor usage limits
          </p>
        </div>
        <Button>
          <Crown className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
      </div>

      {/* Current Plan and Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Plan
              <Badge variant="outline">{currentPlan}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sessions</span>
                <span>{usage.sessions.current} / {usage.sessions.max}</span>
              </div>
              <Progress value={(usage.sessions.current / usage.sessions.max) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Pairs</span>
                <span>{usage.pairs.current} / {usage.pairs.max}</span>
              </div>
              <Progress value={(usage.pairs.current / usage.pairs.max) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Messages (Monthly)</span>
                <span>{usage.messages.current.toLocaleString()} / {usage.messages.max.toLocaleString()}</span>
              </div>
              <Progress value={(usage.messages.current / usage.messages.max) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Plan</span>
              <span className="font-medium">{currentPlan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Billing</span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="pt-4">
              <Button variant="outline" className="w-full">
                View Billing History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Comparison */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-lg border ${
                  plan.popular 
                    ? "border-primary bg-primary/5" 
                    : "border-border bg-muted/50"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-4 h-4 flex-shrink-0">✗</span>
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.name === currentPlan ? "outline" : "default"}
                  disabled={plan.name === currentPlan}
                >
                  {plan.name === currentPlan ? "Current Plan" : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Comparison Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Pro</th>
                  <th className="text-center py-3 px-4">Elite</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Sessions</td>
                  <td className="text-center py-3 px-4">2</td>
                  <td className="text-center py-3 px-4">10</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Forwarding Pairs</td>
                  <td className="text-center py-3 px-4">5</td>
                  <td className="text-center py-3 px-4">50</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Monthly Messages</td>
                  <td className="text-center py-3 px-4">1,000</td>
                  <td className="text-center py-3 px-4">100,000</td>
                  <td className="text-center py-3 px-4">1,000,000</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">Advanced Filters</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">API Access</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✗</td>
                  <td className="text-center py-3 px-4">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}