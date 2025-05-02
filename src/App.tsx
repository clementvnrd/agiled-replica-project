import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import { UserProvider } from './components/UserContext';

// Business modules
import CRMDashboard from "./pages/business/crm/CRMDashboard";
import ProductivityDashboard from "./pages/business/productivity/ProductivityDashboard";
import FinanceDashboard from "./pages/business/finance/FinanceDashboard";

// Personal modules
import PersonalDashboard from "./pages/personal/PersonalDashboard";
import StudiesDashboard from "./pages/personal/studies/StudiesDashboard";
import FitnessDashboard from "./pages/personal/fitness/FitnessDashboard";

// Agent / AI interface
import AgentManager from "./pages/ai/AgentManager";

// Settings & Configuration
import MCPManager from "./pages/settings/MCPManager";
import Profil from "./pages/profil";
import SettingsPage from './pages/settings/SettingsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              
              {/* Business Routes */}
              <Route path="/crm" element={<CRMDashboard />} />
              <Route path="/productivity" element={<ProductivityDashboard />} />
              <Route path="/finance" element={<FinanceDashboard />} />
              
              {/* Personal Routes */}
              <Route path="/personal" element={<PersonalDashboard />} />
              <Route path="/studies" element={<StudiesDashboard />} />
              <Route path="/fitness" element={<FitnessDashboard />} />
              
              {/* AI Routes */}
              <Route path="/agent" element={<AgentManager />} />
              
              {/* Settings Routes */}
              <Route path="/mcp" element={<MCPManager />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Profil Route */}
              <Route path="/profil" element={<Profil />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
