import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PlanProvider } from "@/contexts/PlanContext";
import Dashboard from "./pages/Dashboard";
import Pairs from "./pages/Pairs";
import EditPair from "./pages/EditPair";
import Sessions from "./pages/Sessions";
import Subscription from "./pages/Subscription";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import Filters from "./pages/Filters";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlanProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pairs" element={<Pairs />} />
              <Route path="/pairs/:pairId/edit" element={<EditPair />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/filters" element={<Filters />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </PlanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
