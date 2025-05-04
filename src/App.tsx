import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn } from '@clerk/clerk-react';
import { LazyLoad } from '@/utils/lazyImport.tsx';
import MainLayout from "./layouts/MainLayout";
import { DynamicSupabaseProvider } from '@/providers/DynamicSupabaseProvider';

// Auth Components
import { LoginPage, SignupPage, VerifyEmail, ResetPassword, RedirectIfAuthenticated } from './components/routes/AuthRoutes';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import OnboardingWrapper from './components/routes/OnboardingWrapper';

// Lazy loading pour les pages
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Business modules - lazy loaded
const CRMDashboard = React.lazy(() => import('./pages/business/crm/CRMDashboard'));
const ProductivityDashboard = React.lazy(() => import('./pages/business/productivity/ProductivityDashboard'));
const FinanceDashboard = React.lazy(() => import('./pages/business/finance/FinanceDashboard'));

// Personal modules - lazy loaded
const PersonalDashboard = React.lazy(() => import('./pages/personal/PersonalDashboard'));
const StudiesDashboard = React.lazy(() => import('./pages/personal/studies/StudiesDashboard'));
const FitnessDashboard = React.lazy(() => import('./pages/personal/fitness/FitnessDashboard'));

// Agent / AI interface - lazy loaded
const AgentManager = React.lazy(() => import('./pages/ai/AgentManager'));

// Settings & Configuration - lazy loaded
const MCPManager = React.lazy(() => import('./pages/settings/MCPManager'));
const Profil = React.lazy(() => import('./pages/profil'));
const SettingsPage = React.lazy(() => import('@/pages/settings/SettingsPage'));
const SupabaseCredentialsForm = React.lazy(() => import('./components/SupabaseCredentialsForm'));
const RagManagementPage = React.lazy(() => import('./pages/rag/RagManagementPage'));
const SupabaseCredentialsPage = React.lazy(() => import('./pages/onboarding/SupabaseCredentialsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes authentifiées */}
          <Route path="/" element={
            <SignedIn>
              {/* Provide dynamic Supabase client to all authenticated routes */}
              <DynamicSupabaseProvider>
                <OnboardingWrapper>
                  <MainLayout />
                </OnboardingWrapper>
              </DynamicSupabaseProvider>
            </SignedIn>
          }>
            <Route index element={
              <ProtectedRoute>
                <LazyLoad>
                  <DashboardPage />
                </LazyLoad>
              </ProtectedRoute>
            } />
            
            {/* Business Routes */}
            <Route path="/crm" element={
              <ProtectedRoute>
                <LazyLoad>
                  <CRMDashboard />
                </LazyLoad>
              </ProtectedRoute>
            } />
            <Route path="/productivity" element={
              <ProtectedRoute>
                <LazyLoad>
                  <ProductivityDashboard />
                </LazyLoad>
              </ProtectedRoute>
            } />
            <Route path="/finance" element={
              <ProtectedRoute>
                <LazyLoad>
                  <FinanceDashboard />
                </LazyLoad>
              </ProtectedRoute>
            } />
            
            {/* Personal Routes */}
            <Route path="/personal" element={
              <ProtectedRoute>
                <LazyLoad>
                  <PersonalDashboard />
                </LazyLoad>
              </ProtectedRoute>
            } />
            <Route path="/studies" element={
              <ProtectedRoute>
                <LazyLoad>
                  <StudiesDashboard />
                </LazyLoad>
              </ProtectedRoute>
            } />
            <Route path="/fitness" element={
              <ProtectedRoute>
                <LazyLoad>
                  <FitnessDashboard />
                </LazyLoad>
              </ProtectedRoute>
            } />
            
            {/* AI Routes */}
            <Route path="/agent" element={
              <ProtectedRoute>
                <LazyLoad>
                  <AgentManager />
                </LazyLoad>
              </ProtectedRoute>
            } />
            
            {/* RAG System Routes */}
            <Route path="/rag" element={
              <ProtectedRoute>
                <LazyLoad>
                  <RagManagementPage />
                </LazyLoad>
              </ProtectedRoute>
            } />
            
            {/* Settings Routes */}
            <Route path="/mcp" element={
              <ProtectedRoute>
                <LazyLoad>
                  <MCPManager />
                </LazyLoad>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <LazyLoad>
                  <SettingsPage />
                </LazyLoad>
              </ProtectedRoute>
            } />
            
            {/* Profil Route */}
            <Route path="/profil" element={
              <ProtectedRoute>
                <LazyLoad>
                  <Profil />
                </LazyLoad>
              </ProtectedRoute>
            } />
            <Route path="/onboarding/supabase" element={
              <ProtectedRoute>
                <LazyLoad>
                  <SupabaseCredentialsPage />
                </LazyLoad>
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Routes d'authentification */}
          <Route path="/login" element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          } />
          <Route path="/signup" element={
            <RedirectIfAuthenticated>
              <SignupPage />
            </RedirectIfAuthenticated>
          } />
          <Route path="/verify-email" element={
            <SignedIn>
              <VerifyEmail />
            </SignedIn>
          } />
          <Route path="/reset-password" element={
            <ResetPassword />
          } />
          
          {/* Fallback */}
          <Route path="*" element={
            <LazyLoad>
              <NotFound />
            </LazyLoad>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
