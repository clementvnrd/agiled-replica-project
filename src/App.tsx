
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, SignIn, useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { LazyLoad } from '@/utils/lazyImport.tsx';
import MainLayout from "./layouts/MainLayout";
import { useClerkSupabaseAuth } from './hooks/useClerkSupabaseAuth';
import PasswordRecovery from './components/auth/PasswordRecovery';
import AuthConfirmation from './components/auth/AuthConfirmation';
import AuthLayout from './components/auth/AuthLayout';

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

// Composant pour afficher un écran de chargement générique
function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement en cours...</p>
      </div>
    </div>
  );
}

// Wrapper pour protéger les routes avec authentification
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useClerkSupabaseAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    // Rediriger vers la page de connexion, en mémorisant la page demandée
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Composant qui synchronise Clerk/Supabase et englobe l'app
function ClerkSupabaseSync({ children }: { children: React.ReactNode }) {
  useClerkSupabaseAuth();
  return <>{children}</>;
}

function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { credentials, getCredentials, saveCredentials, loading, error } = useUserSupabaseCredentials();
  
  // Récupère les credentials à chaque login
  React.useEffect(() => {
    if (user) getCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  // Si pas connecté Clerk, rien
  if (!user) return null;
  // Si loading, spinner
  if (loading) return <LoadingScreen />;
  // Si pas de credentials, afficher le formulaire amélioré
  if (!credentials) {
    return (
      <LazyLoad>
        <AuthLayout title="Configuration requise">
          <SupabaseCredentialsForm onSave={saveCredentials} />
        </AuthLayout>
      </LazyLoad>
    );
  }
  
  // Si credentials présents, afficher l'application
  return <>{children}</>;
}

function LoginPage() {
  const [mode, setMode] = React.useState<'signin' | 'recovery'>('signin');
  
  if (mode === 'recovery') {
    return (
      <AuthLayout>
        <PasswordRecovery onBack={() => setMode('signin')} />
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <SignIn signUpUrl="/signup" />
        <div className="mt-4 text-center">
          <button 
            onClick={() => setMode('recovery')}
            className="text-sm text-blue-600 hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

function VerifyEmail() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || 'votre adresse email';
  
  return (
    <AuthLayout>
      <AuthConfirmation 
        type="email"
        email={email}
      />
    </AuthLayout>
  );
}

const App = () => (
  <ClerkProvider
    publishableKey={clerkKey}
    navigateAfterSignIn={(to) => `/verify-email?to=${encodeURIComponent(to || '/')}`}
    navigateAfterSignUp={(to) => `/verify-email?to=${encodeURIComponent(to || '/')}`}
  >
    <ClerkSupabaseSync>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Routes authentifiées */}
              <Route path="/" element={
                <SignedIn>
                  <OnboardingWrapper>
                    <MainLayout />
                  </OnboardingWrapper>
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
              </Route>
              
              {/* Routes d'authentification */}
              <Route path="/login" element={
                <SignedOut>
                  <LoginPage />
                </SignedOut>
              } />
              <Route path="/signup" element={
                <SignedOut>
                  <AuthLayout>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <SignIn signUpMode />
                    </div>
                  </AuthLayout>
                </SignedOut>
              } />
              <Route path="/verify-email" element={
                <SignedIn>
                  <VerifyEmail />
                </SignedIn>
              } />
              <Route path="/reset-password" element={
                <AuthLayout>
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Réinitialiser votre mot de passe</h2>
                    <p className="mb-4">Créez un nouveau mot de passe sécurisé.</p>
                    {/* Formulaire de réinitialisation de mot de passe à implémenter */}
                  </Card>
                </AuthLayout>
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
    </ClerkSupabaseSync>
  </ClerkProvider>
);

export default App;
