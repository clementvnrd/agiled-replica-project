# Guide de Correction: Intégration Clerk & Supabase (Multi-Tenant)

## Introduction

Ce guide détaille les étapes pour corriger les problèmes d'authentification et d'accès aux données dans votre projet Agiled Replica. Le problème principal réside dans un conflit d'architecture : le projet tente de synchroniser l'authentification Clerk avec un client Supabase global (via JWT), tout en exigeant que chaque utilisateur se connecte à sa propre base de données Supabase distincte. Cette approche est contradictoire.

La solution proposée consiste à abandonner la synchronisation JWT avec le client Supabase global et à se concentrer sur la gestion des connexions Supabase spécifiques à chaque utilisateur, initiées après l'authentification Clerk.

## Problèmes Identifiés

1.  **Conflit d'Architecture :** Utilisation simultanée d'un client Supabase global (pour la synchronisation JWT Clerk et le stockage des credentials utilisateur) et d'une exigence de bases de données Supabase distinctes par utilisateur.
2.  **Synchronisation JWT Inappropriée :** La fonction `useClerkSupabaseAuth` tente de synchroniser le JWT Clerk avec le client Supabase *global*, ce qui est inutile et potentiellement source d'erreurs si le but est d'utiliser des bases de données *spécifiques* à l'utilisateur.
3.  **Stockage des Credentials :** Les credentials Supabase de l'utilisateur (URL, clé anon) sont stockés dans la base de données Supabase *globale* (`user_supabase_credentials`), ce qui est correct pour les récupérer, mais l'accès aux données *de l'utilisateur* doit se faire via un client initialisé avec *ces* credentials.
4.  **Accès aux Données Incorrect :** Les hooks comme `useRagDocuments` utilisent le client Supabase *global* pour récupérer les données, ce qui échouera si des politiques RLS (Row Level Security) sont en place sur les bases de données utilisateur ou si les données n'existent tout simplement pas dans la base globale.
5.  **Vérification JWT Insécurisée (Mineur) :** La fonction `verifyToken` dans `clerkJwt.ts` décode simplement le token sans vérification cryptographique réelle. Bien que ce fichier devienne probablement obsolète avec la nouvelle approche, c'est une faille de sécurité dans le code actuel.

## Prérequis

1.  **Compte Clerk :** Assurez-vous d'avoir un compte Clerk configuré pour votre application.
2.  **Compte Supabase (Global) :** Un projet Supabase principal (que nous appellerons "global") pour stocker les credentials Supabase des utilisateurs. C'est celui configuré via les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
3.  **Variables d'Environnement :** Un fichier `.env` à la racine du projet contenant au minimum :
    ```
    VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_SUPABASE_URL=https://<votre-ref-projet-global>.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-clé-anon-globale>
    ```
4.  **Structure de Table (Supabase Global) :** Une table `user_supabase_credentials` dans votre base de données Supabase globale avec les colonnes : `clerk_user_id` (texte, clé primaire), `supabase_url` (texte), `supabase_anon_key` (texte).

## Étapes de Correction

### Étape 1 : Simplifier l'Authentification Initiale (Clerk)

Assurez-vous que votre `main.tsx` (ou point d'entrée principal) initialise correctement Clerk.

```typescript
// src/main.tsx (ou équivalent)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assurez-vous que App gère le routing
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### Étape 2 : Supprimer la Synchronisation JWT Globale Inutile

Le hook `useClerkSupabaseAuth` tente de synchroniser le JWT Clerk avec le client Supabase *global*. Cette étape est contre-productive si chaque utilisateur a sa propre base de données. Nous allons le supprimer ou le commenter.

1.  **Supprimer/Commenter `src/hooks/useClerkSupabaseAuth.tsx` :** Vous n'avez plus besoin de ce fichier.
2.  **Supprimer/Commenter `src/lib/clerkJwt.ts` :** Ce fichier n'est plus nécessaire.
3.  **Mettre à jour `ProtectedRoute` :** Ce composant doit maintenant uniquement vérifier l'authentification Clerk, car la connexion Supabase est gérée séparément (voir Étape 4).

```typescript
// src/components/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { LoadingScreen } from './LoadingScreen'; // Assurez-vous que ce composant existe

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    // Rediriger vers la page de connexion Clerk
    // Note: Clerk gère souvent sa propre redirection via <SignIn/> ou des hooks.
    // Adaptez ceci si nécessaire ou utilisez les composants Clerk <SignedIn>/<SignedOut>.
    // Pour une redirection manuelle simple :
    return <Navigate to="/login" state={{ from: location }} replace />;
    // Ou mieux, laissez Clerk gérer cela via la configuration du provider ou les composants.
  }

  // Si l'utilisateur est connecté via Clerk, on continue.
  // La vérification de la connexion Supabase se fera via un contexte dédié (Étape 4).
  return <>{children}</>;
}
```

### Étape 3 : Gérer les Credentials Supabase Utilisateur

Le hook `useUserSupabaseCredentials` est correct dans son principe : il récupère les credentials spécifiques à l'utilisateur depuis la base de données *globale*. Assurez-vous qu'il utilise bien le client Supabase *global* (celui initialisé dans `supabaseClient.ts` avec les variables d'environnement).

```typescript
// src/hooks/useUserSupabaseCredentials.ts
// ... (le code existant est globalement correct)
// Vérifiez que l'import de `supabase` pointe bien vers le client global:
import { supabase } from '@/lib/supabaseClient'; // Client GLOBAL
// ... (le reste du hook)
```

La page `SupabaseCredentialsPage.tsx` et le formulaire `SupabaseCredentialsForm.tsx` semblent corrects pour permettre à l'utilisateur de saisir ses credentials, qui sont ensuite sauvegardés via `useUserSupabaseCredentials` dans la base *globale*.

### Étape 4 : Créer un Contexte pour le Client Supabase Dynamique

Nous avons besoin d'un moyen de rendre le client Supabase *dynamique* (spécifique à l'utilisateur) accessible dans toute l'application après que l'utilisateur ait fourni ses credentials.

1.  **Créer un Contexte :**

```typescript
// src/contexts/DynamicSupabaseContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/clerk-react';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import { createDynamicSupabaseClient } from '@/lib/createDynamicSupabaseClient';

interface DynamicSupabaseContextProps {
  dynamicSupabase: SupabaseClient | null;
  isLoading: boolean;
  error: string | null;
  hasCredentials: boolean;
  refreshCredentials: () => void;
}

const DynamicSupabaseContext = createContext<DynamicSupabaseContextProps | undefined>(undefined);

export const DynamicSupabaseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const { 
    credentials, 
    loading: credsLoading, 
    error: credsError, 
    getCredentials 
  } = useUserSupabaseCredentials();
  
  const [dynamicSupabase, setDynamicSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(credsLoading);
    setError(credsError);

    if (!credsLoading && !credsError) {
      if (credentials) {
        console.log("✨ Création du client Supabase dynamique avec les credentials:", credentials);
        const client = createDynamicSupabaseClient(credentials);
        setDynamicSupabase(client);
      } else {
        console.log("⏳ Pas de credentials Supabase trouvés pour l'utilisateur.");
        setDynamicSupabase(null); // Pas de client si pas de credentials
      }
    }
  }, [credentials, credsLoading, credsError]);

  // Re-fetch credentials when user changes
  useEffect(() => {
    if (user) {
      getCredentials();
    }
  }, [user, getCredentials]);

  const refreshCredentials = useCallback(() => {
    getCredentials();
  }, [getCredentials]);

  const value = {
    dynamicSupabase,
    isLoading: credsLoading,
    error: credsError,
    hasCredentials: !!credentials,
    refreshCredentials
  };

  return (
    <DynamicSupabaseContext.Provider value={value}>
      {children}
    </DynamicSupabaseContext.Provider>
  );
};

export const useDynamicSupabase = () => {
  const context = useContext(DynamicSupabaseContext);
  if (context === undefined) {
    throw new Error('useDynamicSupabase must be used within a DynamicSupabaseProvider');
  }
  return context;
};
```

2.  **Intégrer le Provider :** Enveloppez votre application (ou la partie qui nécessite l'accès aux données utilisateur) avec ce provider, *après* le `ClerkProvider`.

```typescript
// src/App.tsx (ou là où vous gérez le routing principal)
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { DynamicSupabaseProvider, useDynamicSupabase } from './contexts/DynamicSupabaseContext';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import SupabaseCredentialsPage from './pages/onboarding/SupabaseCredentialsPage';
import LoginPage from './pages/LoginPage'; // Créez une page simple pour le login si besoin
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import OnboardingWrapper from './components/routes/OnboardingWrapper';

function App() {
  return (
    <DynamicSupabaseProvider> { /* Enveloppe l'application */ }
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding/supabase" element={
          <ProtectedRoute>
            <SupabaseCredentialsPage />
          </ProtectedRoute>
        } />
        <Route path="/*" element={
          <ProtectedRoute>
            <OnboardingWrapper> { /* Vérifie si les credentials sont présents */ }
              <MainLayout>
                <Routes>
                  <Route index element={<DashboardPage />} />
                  {/* Ajoutez d'autres routes protégées ici */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </OnboardingWrapper>
          </ProtectedRoute>
        } />
      </Routes>
    </DynamicSupabaseProvider>
  );
}

export default App;
```

3.  **Créer `OnboardingWrapper` :** Ce composant vérifie si l'utilisateur a fourni ses credentials Supabase. Si non, il le redirige vers la page d'onboarding.

```typescript
// src/components/routes/OnboardingWrapper.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDynamicSupabase } from '@/contexts/DynamicSupabaseContext';
import { LoadingScreen } from './LoadingScreen';

const OnboardingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { hasCredentials, isLoading } = useDynamicSupabase();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasCredentials) {
    console.log("Onboarding requis : Redirection vers /onboarding/supabase");
    return <Navigate to="/onboarding/supabase" replace />;
  }

  return <>{children}</>;
};

export default OnboardingWrapper;
```

### Étape 5 : Mettre à Jour l'Accès aux Données

Modifiez tous les hooks ou composants qui accèdent aux données Supabase spécifiques à l'utilisateur pour utiliser le client dynamique fourni par le contexte.

```typescript
// src/hooks/supabase/useRagDocuments.ts
import { useState, useEffect } from 'react';
// N'utilisez PLUS le client global ici !
// import { supabase } from '@/lib/supabaseClient'; 
import { useDynamicSupabase } from '@/contexts/DynamicSupabaseContext'; // Utilisez le contexte
import { useUser } from '@clerk/clerk-react';

// ... (interface RagDocument)

export function useRagDocuments() {
  const { user } = useUser();
  const { dynamicSupabase, isLoading: isContextLoading } = useDynamicSupabase(); // Récupère le client dynamique
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Attendre que le contexte et l'utilisateur soient chargés ET que le client dynamique soit disponible
    if (!user || isContextLoading || !dynamicSupabase) {
      setIsLoading(isContextLoading);
      if (!isContextLoading && !dynamicSupabase && user) {
         // Gérer le cas où les credentials ne sont pas encore là (normalement géré par OnboardingWrapper)
         console.warn("useRagDocuments: Client Supabase dynamique non disponible.");
      }
      return;
    }

    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Utilisez dynamicSupabase !
        const { data, error: fetchError } = await dynamicSupabase
          .from('rag_documents')
          .select('*')
          .eq('user_id', user.id); // Assurez-vous que RLS est configuré sur la DB utilisateur si nécessaire

        if (fetchError) throw fetchError;
        setDocuments(data as RagDocument[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching RAG documents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user, dynamicSupabase, isContextLoading]); // Dépend du client dynamique

  // ... méthodes addDocument, deleteDocument (doivent aussi utiliser dynamicSupabase)
  const addDocument = async (content: string, metadata: Record<string, any> = {}) => {
    if (!user || !dynamicSupabase) return null;
    // ... utilise dynamicSupabase.from('rag_documents').insert(...)
  };

  const deleteDocument = async (id: string) => {
    if (!dynamicSupabase) return false;
    // ... utilise dynamicSupabase.from('rag_documents').delete(...)
  };

  return {
    documents,
    isLoading,
    error,
    addDocument,
    deleteDocument
  };
}
```

**Répétez ce processus pour tous les hooks/composants accédant aux données utilisateur.**

### Étape 6 : Configuration Supabase (Base Utilisateur)

Pour chaque base de données Supabase *utilisateur* :

1.  **Row Level Security (RLS) :** Activez RLS sur les tables contenant des données utilisateur (ex: `rag_documents`). Créez des politiques qui autorisent les opérations SELECT, INSERT, UPDATE, DELETE uniquement si l'ID de l'utilisateur authentifié (provenant du JWT implicitement géré par `supabase-js` après `createDynamicSupabaseClient`) correspond à `user_id` dans la table.
    *Exemple de politique SELECT sur `rag_documents` :*
    ```sql
    CREATE POLICY 

    "Allow user to read their own documents" 
    ON rag_documents 
    FOR SELECT 
    USING (auth.uid() = user_id);
    ```
    *Ajoutez des politiques similaires pour INSERT, UPDATE, DELETE.*

2.  **Authentification JWT (Optionnel mais recommandé) :** Bien que nous n'utilisions plus le *client global* avec le JWT Clerk, il est bon de configurer la validation JWT dans les paramètres d'authentification de *chaque* base Supabase utilisateur si vous prévoyez d'utiliser les fonctions d'authentification intégrées de Supabase (par exemple, pour RLS basé sur `auth.uid()`). Configurez-le pour utiliser votre JWKS Clerk. Cela garantit que même si un utilisateur obtient la clé anon, il ne peut agir qu'en son propre nom via RLS.

### Étape 7 : Nettoyage et Test

1.  **Supprimer le Code Inutilisé :** Supprimez les fichiers `useClerkSupabaseAuth.tsx` et `clerkJwt.ts` s'ils ne sont plus importés nulle part.
2.  **Vérifier les Imports :** Assurez-vous que tous les accès aux données utilisateur utilisent `useDynamicSupabase` et non le client global `supabase`.
3.  **Tester le Flux :**
    *   Connectez-vous avec Clerk.
    *   Vous devriez être redirigé vers `/onboarding/supabase` si vous n'avez pas encore fourni de credentials.
    *   Entrez des credentials Supabase (d'un projet de test que vous contrôlez).
    *   Vous devriez être redirigé vers le dashboard (`/`).
    *   Les composants qui utilisent `useDynamicSupabase` (comme `useRagDocuments`) devraient maintenant fonctionner et interagir avec la base de données utilisateur spécifiée.
    *   Testez la déconnexion/reconnexion. Les credentials devraient être récupérés automatiquement.
    *   Testez la suppression des credentials (si vous implémentez cette fonctionnalité).

## Conclusion

Cette approche recentre l'architecture sur la gestion explicite des connexions Supabase par utilisateur après l'authentification Clerk. Elle élimine la confusion causée par la tentative de synchronisation JWT avec un client global tout en nécessitant des bases de données distinctes. Le `DynamicSupabaseProvider` devient la source de vérité pour l'accès aux données spécifiques à l'utilisateur.

N'oubliez pas de configurer correctement RLS sur les bases de données Supabase utilisateur pour garantir la sécurité et l'isolation des données.
