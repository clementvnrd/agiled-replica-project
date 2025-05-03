import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LazyLoad } from '@/utils/lazyImport';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import AuthLayout from '../auth/AuthLayout';
import { LoadingScreen } from './ProtectedRoute';

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { credentials, getCredentials, saveCredentials, loading, error } = useUserSupabaseCredentials();
  
  // Récupère les credentials à chaque login
  useEffect(() => {
    if (user) getCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  // Si pas connecté Clerk, rien
  if (!user) return null;
  // Si loading, spinner
  if (loading) return <LoadingScreen />;

  // Gestion d'erreur visible
  if (error) {
    return (
      <AuthLayout title="Erreur de connexion à Supabase">
        <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded text-red-900">
          <h2 className="font-bold mb-2 text-base">Impossible de se connecter à Supabase</h2>
          <p className="mb-4">{error}</p>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => getCredentials()}
          >
            Réessayer
          </button>
        </div>
      </AuthLayout>
    );
  }
  
  // Si pas de credentials, redirige vers la page d'onboarding Supabase
  if (!credentials) {
    navigate('/onboarding/supabase');
    return null;
  }
  
  // Fonction pour ignorer la configuration Supabase
  const handleSkip = () => {
    navigate('/');
  };
  
  // Si credentials présents, afficher l'application
  return <>{children}</>;
}
