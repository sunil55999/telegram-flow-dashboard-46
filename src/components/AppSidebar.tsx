import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  RefreshCcw, 
  Smartphone, 
  CreditCard, 
  FileText, 
  Settings,
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Pairs", url: "/pairs", icon: RefreshCcw },
  { title: "Sessions", url: "/sessions", icon: Smartphone },
  { title: "Subscription", url: "/subscription", icon: CreditCard },
  { title: "Logs", url: "/logs", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={cn("border-r border-border", collapsed ? "w-14" : "w-60")}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <>
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <RefreshCcw className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-sm">AutoForwardX</h1>
                <p className="text-xs text-muted-foreground">Telegram Dashboard</p>
              </div>
            </>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center mx-auto">
              <RefreshCcw className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn("transition-colors")}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                        )
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}