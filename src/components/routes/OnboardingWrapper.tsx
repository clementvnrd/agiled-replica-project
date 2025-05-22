import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
// import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials'; // Désactivé : logique multi-instance Supabase supprimée
import AuthLayout from '../auth/AuthLayout';
import { LoadingScreen } from './ProtectedRoute';
import { toast } from "sonner";
import { ErrorHandler } from '@/utils/errorHandler';

// Désactivé : toute la logique d'onboarding Supabase individuel (multi-instance)
// Ce composant ne fait plus que vérifier l'utilisateur Clerk et rendre les enfants
export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  // Si pas d'utilisateur Clerk, ne rien afficher
  if (!user) {
    return null;
  }

  // Onboarding Supabase désactivé : on rend toujours les enfants
  return <>{children}</>;
}
