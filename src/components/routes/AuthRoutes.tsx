
import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import AuthLayout from '../auth/AuthLayout';
import SupabaseAuth from '../auth/SupabaseAuth';
import PasswordRecovery from '../auth/PasswordRecovery';
import { Card } from '@/components/ui/card';
import AuthConfirmation from '../auth/AuthConfirmation';

export function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'recovery'>('signin');
  const location = useLocation();
  const { isAuthenticated } = useSupabaseAuth();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  // Rediriger si déjà connecté
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  if (mode === 'recovery') {
    return (
      <AuthLayout>
        <PasswordRecovery onBack={() => setMode('signin')} />
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout>
      <SupabaseAuth onAuthSuccess={() => window.location.href = from} />
    </AuthLayout>
  );
}

export function SignupPage() {
  const location = useLocation();
  const { isAuthenticated } = useSupabaseAuth();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  // Rediriger si déjà connecté
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  return (
    <AuthLayout>
      <SupabaseAuth onAuthSuccess={() => window.location.href = from} />
    </AuthLayout>
  );
}

export function VerifyEmail() {
  const { user } = useSupabaseAuth();
  const email = user?.email || 'votre adresse email';
  
  return (
    <AuthLayout>
      <AuthConfirmation 
        type="email"
        email={email}
      />
    </AuthLayout>
  );
}

export function ResetPassword() {
  return (
    <AuthLayout>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Réinitialiser votre mot de passe</h2>
        <p className="mb-4">Créez un nouveau mot de passe sécurisé.</p>
        <p className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}

// Composant qui redirige les utilisateurs déjà authentifiés
export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSupabaseAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}
