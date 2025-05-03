
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { LazyLoad } from '@/utils/lazyImport';
import MainLayout from "./layouts/MainLayout";

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

// Hooks
import { useUserSupabaseCredentials } from './hooks/useUserSupabaseCredentials';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Synchronise Clerk et Supabase : connecte Supabase avec le JWT Clerk
function useSyncClerkSupabaseAuth() {
  const { isSignedIn, getToken } = useAuth();
  
  useEffect(() => {
    let isMounted = true;
    
    async function sync() {
      if (isSignedIn) {
        try {
          const token = await getToken({ template: 'supabase' });
          if (token && isMounted) {
            await supabase.auth.setSession({ access_token: token, refresh_token: token });
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation Clerk-Supabase:', error);
        }
      } else {
        await supabase.auth.signOut();
      }
    }
    
    sync();
    return () => { isMounted = false; };
  }, [isSignedIn, getToken]);
}

// Composant qui synchronise Clerk/Supabase et englobe l'app
function ClerkSupabaseSync({ children }: { children: React.ReactNode }) {
  useSyncClerkSupabaseAuth();
  return <>{children}</>;
}

function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { credentials, getCredentials, saveCredentials, loading, error } = useUserSupabaseCredentials();

  // Récupère les credentials à chaque login
  useEffect(() => {
    if (user) getCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Si pas connecté Clerk, rien
  if (!user) return null;
  // Si loading, spinner
  if (loading) return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  // Si pas de credentials, afficher le formulaire
  if (!credentials) {
    return (
      <LazyLoad>
        <SupabaseCredentialsForm onSave={saveCredentials} />
      </LazyLoad>
    );
  }
  // Si credentials présents, afficher l'application
  return <>{children}</>;
}

const App = () => (
  <ClerkProvider
    publishableKey={clerkKey}
    routerPush={to => window.history.pushState({}, '', to)}
    routerReplace={to => window.history.replaceState({}, '', to)}
  >
    <ClerkSupabaseSync>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SignedIn>
              <OnboardingWrapper>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={
                      <LazyLoad>
                        <DashboardPage />
                      </LazyLoad>
                    } />
                    {/* Business Routes */}
                    <Route path="/crm" element={
                      <LazyLoad>
                        <CRMDashboard />
                      </LazyLoad>
                    } />
                    <Route path="/productivity" element={
                      <LazyLoad>
                        <ProductivityDashboard />
                      </LazyLoad>
                    } />
                    <Route path="/finance" element={
                      <LazyLoad>
                        <FinanceDashboard />
                      </LazyLoad>
                    } />
                    {/* Personal Routes */}
                    <Route path="/personal" element={
                      <LazyLoad>
                        <PersonalDashboard />
                      </LazyLoad>
                    } />
                    <Route path="/studies" element={
                      <LazyLoad>
                        <StudiesDashboard />
                      </LazyLoad>
                    } />
                    <Route path="/fitness" element={
                      <LazyLoad>
                        <FitnessDashboard />
                      </LazyLoad>
                    } />
                    {/* AI Routes */}
                    <Route path="/agent" element={
                      <LazyLoad>
                        <AgentManager />
                      </LazyLoad>
                    } />
                    {/* Settings Routes */}
                    <Route path="/mcp" element={
                      <LazyLoad>
                        <MCPManager />
                      </LazyLoad>
                    } />
                    <Route path="/settings" element={
                      <LazyLoad>
                        <SettingsPage />
                      </LazyLoad>
                    } />
                    {/* Profil Route */}
                    <Route path="/profil" element={
                      <LazyLoad>
                        <Profil />
                      </LazyLoad>
                    } />
                  </Route>
                  <Route path="*" element={
                    <LazyLoad>
                      <NotFound />
                    </LazyLoad>
                  } />
                </Routes>
              </OnboardingWrapper>
            </SignedIn>
            <SignedOut>
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SignIn signUpUrl="/sign-up" />
              </div>
            </SignedOut>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkSupabaseSync>
  </ClerkProvider>
);

export default App;
