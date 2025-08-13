
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { PlanProvider } from "@/contexts/PlanContext";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Pairs from "@/pages/Pairs";
import NewPair from "@/pages/NewPair";
import EditPair from "@/pages/EditPair";
import Sessions from "@/pages/Sessions";
import Filters from "@/pages/Filters";
import Settings from "@/pages/Settings";
import Logs from "@/pages/Logs";
import Subscription from "@/pages/Subscription";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlanProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/pairs" element={<Layout><Pairs /></Layout>} />
            <Route path="/pairs/new" element={<Layout><NewPair /></Layout>} />
            <Route path="/pairs/edit/:pairId" element={<Layout><EditPair /></Layout>} />
            <Route path="/sessions" element={<Layout><Sessions /></Layout>} />
            <Route path="/filters" element={<Layout><Filters /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="/logs" element={<Layout><Logs /></Layout>} />
            <Route path="/subscription" element={<Layout><Subscription /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </PlanProvider>
    </QueryClientProvider>
  );
}

export default App;
