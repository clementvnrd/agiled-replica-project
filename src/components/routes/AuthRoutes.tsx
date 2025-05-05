
import React, { useState } from 'react';
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../auth/AuthLayout';
import PasswordRecovery from '../auth/PasswordRecovery';
import { Card } from '@/components/ui/card';
import AuthConfirmation from '../auth/AuthConfirmation';

export function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'recovery'>('signin');
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
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
        <h1 className="text-2xl font-bold mb-4 text-center">Connectez-vous</h1>
        <SignIn redirectUrl={from} />
        <div className="mt-6 text-center space-y-2">
          <button 
            onClick={() => setMode('recovery')}
            className="text-sm text-blue-600 hover:underline block w-full"
          >
            Mot de passe oublié ?
          </button>
          <div className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export function SignupPage() {
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  return (
    <AuthLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Créez votre compte</h1>
        <SignIn redirectUrl={from} />
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Se connecter
            </Link>
          </div>
        </div>
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
  return (
    <>
      <SignedIn>
        <Navigate to="/dashboard" replace />
      </SignedIn>
      <SignedOut>
        {children}
      </SignedOut>
    </>
  );
}
