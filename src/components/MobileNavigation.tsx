import { useLocation, useNavigate } from "react-router-dom";
import { Home, Settings, List, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: List, label: "Pairs", path: "/pairs" },
  { icon: Activity, label: "Logs", path: "/logs" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function MobileNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
        <div className="grid grid-cols-4 h-16">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center h-full space-y-1 rounded-none",
                isActive(item.path) 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Floating Add Button */}
      <Button
        onClick={() => navigate("/pairs")}
        size="icon"
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full shadow-lg md:hidden"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </>
  );
}