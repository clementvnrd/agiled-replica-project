
import React from 'react';
import { useUser } from '@clerk/clerk-react';

// Wrapper simplifié qui ne fait plus d'onboarding Supabase
// Les utilisateurs connectés via Clerk arrivent directement sur le dashboard
export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  // Si Clerk n'a pas encore chargé, on affiche un loading
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur Clerk, ne rien afficher (sera géré par ProtectedRoute)
  if (!user) {
    return null;
  }

  // Utilisateur connecté : on rend directement les enfants (dashboard)
  return <>{children}</>;
}
