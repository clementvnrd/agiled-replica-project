
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useClerkSupabaseAuth } from '@/hooks/useClerkSupabaseAuth';

// Composant pour afficher un écran de chargement générique
export function LoadingScreen() {
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
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
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
