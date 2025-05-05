
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import AuthLayout from '../auth/AuthLayout';
import { LoadingScreen } from './ProtectedRoute';
import { toast } from "sonner";

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  // Hooks
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { credentials, getCredentials, loading, error } = useUserSupabaseCredentials();

  // Effet pour récupérer les credentials
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
    
    // N'exécute la redirection que si:
    // 1. Pas de chargement en cours
    // 2. Pas d'erreur
    // 3. Utilisateur connecté
    // 4. Pas de credentials configurés
    // 5. Pas déjà sur une page d'onboarding
    if (!loading && !error && user && !credentials && 
        location.pathname !== '/onboarding/supabase') {
      
      // Affiche un toast pour informer l'utilisateur
      toast.info("Configuration de Supabase requise pour continuer", {
        description: "Veuillez configurer vos informations Supabase pour profiter de toutes les fonctionnalités.",
        duration: 5000,
      });
      
      console.log('OnboardingWrapper: Redirecting to /onboarding/supabase');
      navigate('/onboarding/supabase');
    }
  }, [user, credentials, loading, error, navigate, location]);

  // Logique de rendu
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
          <div className="mt-4">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/onboarding/supabase')}
            >
              Reconfigurer Supabase
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }
  
  // Si on est déjà sur la page d'onboarding, on laisse le composant enfant s'afficher
  if (!credentials && location.pathname === '/onboarding/supabase') {
    console.log('OnboardingWrapper: Already on onboarding page, allowing child render');
    return <>{children}</>;
  } 
  
  // Si pas de credentials et pas sur la page onboarding, afficher loading pendant la redirection
  if (!credentials) {
    console.log('OnboardingWrapper: No credentials found, waiting for redirect effect');
    return <LoadingScreen />;
  }

  console.log('OnboardingWrapper: Credentials found, rendering children');
  return <>{children}</>;
}
