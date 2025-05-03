
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LazyLoad } from '@/utils/lazyImport';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import SupabaseCredentialsForm from '../SupabaseCredentialsForm';
import AuthLayout from '../auth/AuthLayout';
import { LoadingScreen } from './ProtectedRoute';

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { credentials, getCredentials, saveCredentials, loading } = useUserSupabaseCredentials();
  
  // Récupère les credentials à chaque login
  useEffect(() => {
    if (user) getCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  // Si pas connecté Clerk, rien
  if (!user) return null;
  // Si loading, spinner
  if (loading) return <LoadingScreen />;
  
  // Fonction pour ignorer la configuration Supabase
  const handleSkip = () => {
    navigate('/');
  };
  
  // Si pas de credentials, afficher le formulaire amélioré
  if (!credentials) {
    return (
      <LazyLoad>
        <AuthLayout title="Configuration requise">
          <SupabaseCredentialsForm 
            onSave={saveCredentials} 
            onSkip={handleSkip}
          />
        </AuthLayout>
      </LazyLoad>
    );
  }
  
  // Si credentials présents, afficher l'application
  return <>{children}</>;
}
