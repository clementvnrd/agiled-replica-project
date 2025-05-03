import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

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
import SettingsPage from '@/pages/settings/SettingsPage';
import SupabaseCredentialsForm from './components/SupabaseCredentialsForm';
import { useUserSupabaseCredentials } from './hooks/useUserSupabaseCredentials';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const queryClient = new QueryClient();

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Synchronise Clerk et Supabase : connecte Supabase avec le JWT Clerk
function useSyncClerkSupabaseAuth() {
  const { isSignedIn, getToken } = useAuth();
  React.useEffect(() => {
    let isMounted = true;
    async function sync() {
      if (isSignedIn) {
        const token = await getToken({ template: 'supabase' });
        console.log('Clerk JWT:', token);
        if (token && isMounted) {
          await supabase.auth.setSession({ access_token: token, refresh_token: token });
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
  const [supabaseClient, setSupabaseClient] = React.useState<any>(null);

  // Récupère les credentials à chaque login
  useEffect(() => {
    if (user) getCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Initialise dynamiquement le client Supabase dès que les credentials sont là
  useEffect(() => {
    if (credentials) {
      setSupabaseClient(createClient(credentials.supabaseUrl, credentials.supabaseAnonKey));
    }
  }, [credentials]);

  // Si pas connecté Clerk, rien
  if (!user) return null;
  // Si loading, spinner
  if (loading) return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  // Si pas de credentials, afficher le formulaire
  if (!credentials) {
    return (
      <SupabaseCredentialsForm onSave={saveCredentials} />
    );
  }
  // Si credentials présents, fournir le client Supabase dynamiquement (via context ou prop drilling si besoin)
  // Ici, on passe juste children, mais tu peux adapter pour fournir le client
  return <>{children}</>;
}

function AppProviders({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  useSyncClerkSupabaseAuth();
  return (
    <ClerkProvider
      publishableKey={clerkKey}
      routerPush={to => navigate(to)}
      routerReplace={to => navigate(to, { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
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
