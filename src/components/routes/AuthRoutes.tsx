import React, { useState } from 'react';
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../auth/AuthLayout';
import PasswordRecovery from '../auth/PasswordRecovery';
import { Card } from '@/components/ui/card';
import AuthConfirmation from '../auth/AuthConfirmation';

export function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'recovery'>('signin');
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  
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
        <SignIn redirectUrl={from} />
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

export function SignupPage() {
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  
  return (
    <AuthLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <SignIn redirectUrl={from} />
      </div>
    </AuthLayout>
  );
}

export function VerifyEmail() {
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

export function ResetPassword() {
  return (
    <AuthLayout>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Réinitialiser votre mot de passe</h2>
        <p className="mb-4">Créez un nouveau mot de passe sécurisé.</p>
        {/* Formulaire de réinitialisation de mot de passe à implémenter */}
      </Card>
    </AuthLayout>
  );
}

// Composant qui redirige les utilisateurs déjà authentifiés
export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
      <SignedOut>
        {children}
      </SignedOut>
    </>
  );
}
