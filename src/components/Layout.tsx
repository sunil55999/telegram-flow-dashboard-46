import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { MobileHeader } from "@/components/MobileHeader";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <AppSidebar />
        </Sidebar>
        
        <SidebarInset className="flex-1">
          {/* Desktop Header */}
          <div className="hidden md:block">
            <TopNavbar />
          </div>
          
          {/* Mobile Header */}
          <MobileHeader 
            title={getPageTitle()} 
            showSearch={location.pathname === "/pairs" || location.pathname === "/logs"}
          />
          
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </main>
        </SidebarInset>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </SidebarProvider>
  );
}