
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { MobileHeader } from "@/components/MobileHeader";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/pairs":
        return "Forwarding Pairs";
      case "/sessions":
        return "Sessions";
      case "/logs":
        return "Logs";
      case "/settings":
        return "Settings";
      case "/subscription":
        return "Subscription";
      default:
        if (location.pathname.includes("/pairs/") && location.pathname.includes("/edit")) {
          return "Edit Pair";
        }
        return "Dashboard";
    }
  };

  const showSearch = location.pathname === "/pairs" || location.pathname === "/logs";

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background w-full">
        {/* Mobile Header */}
        <MobileHeader title={getPageTitle()} showSearch={showSearch} />
        
        {/* Main Content */}
        <main className="flex-1 p-4 mobile-safe-bottom overflow-y-auto">
          {children}
        </main>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <AppSidebar />
        </Sidebar>
        
        <SidebarInset className="flex-1">
          {/* Desktop Header */}
          <TopNavbar />
          
          {/* Main Content */}
          <main className="flex-1 p-6 pb-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
