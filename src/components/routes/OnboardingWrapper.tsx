import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import AuthLayout from '../auth/AuthLayout';
import { LoadingScreen } from './ProtectedRoute';

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  // Hooks
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { credentials, getCredentials, loading, error } = useUserSupabaseCredentials();

  // Effet pour récupérer les credentials (inchangé)
  useEffect(() => {
    if (user) {
      console.log('OnboardingWrapper: User detected, calling getCredentials');
      getCredentials();
    }
  }, [user, getCredentials]);

  // Effet pour gérer la redirection
  useEffect(() => {
    console.log('OnboardingWrapper: Redirect effect check', { 
      loading, 
      error, 
      user: !!user, 
      credentials: !!credentials, 
      pathname: location.pathname 
    });
    
    // AJOUTEZ la vérification de location.pathname
    if (!loading && !error && user && !credentials && location.pathname !== '/onboarding/supabase') {
      console.log('OnboardingWrapper: Redirecting to /onboarding/supabase');
      navigate('/onboarding/supabase');
    }
  // AJOUTEZ location aux dépendances
  }, [user, credentials, loading, error, navigate, location]);

  // Logique de rendu (inchangée)
  if (!user) {
    console.log('OnboardingWrapper: No user yet');
    return null;
  }
  if (loading) {
    console.log('OnboardingWrapper: Loading credentials...');
    return <LoadingScreen />;
  }
  if (error) {
    console.error('OnboardingWrapper: Error loading credentials:', error);
    return (
      <AuthLayout title="Erreur de connexion à Supabase">
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      </AuthLayout>
    );
  }
  if (!credentials) {
     // Si on est déjà sur la page d'onboarding, on ne veut pas afficher LoadingScreen indéfiniment
     // Si le chemin EST /onboarding/supabase, on laisse le composant enfant (SupabaseCredentialsPage) s'afficher
     if (location.pathname === '/onboarding/supabase') {
       console.log('OnboardingWrapper: Already on onboarding page, allowing child render');
       // Attention: Ceci suppose que SupabaseCredentialsPage est bien l'enfant direct
       // Si ce n'est pas le cas, cette logique pourrait devoir être ajustée
       // ou il faudrait que SupabaseCredentialsPage n'ait pas besoin de OnboardingWrapper
       // Pour l'instant, on laisse passer pour voir si ça débloque
       return <>{children}</>; 
     } else {
       // Sinon (on n'est pas sur la page d'onboarding), on attend la redirection
       console.log('OnboardingWrapper: No credentials found, waiting for redirect effect');
       return <LoadingScreen />;
     }
  }

  console.log('OnboardingWrapper: Credentials found, rendering children');
  return <>{children}</>;
}
