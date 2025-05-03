
import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { toast } from "sonner";

/**
 * Hook pour synchroniser l'authentification entre Clerk et Supabase
 * et gérer les informations de session utilisateur.
 */
export function useClerkSupabaseAuth() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Synchronise Clerk et Supabase auth
  const syncAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isSignedIn && user) {
        // Récupère le JWT Clerk au format Supabase
        const token = await getToken({ template: 'supabase' });
        
        if (token) {
          // Met à jour la session Supabase avec le token Clerk
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token
          });
          
          if (sessionError) {
            throw new Error(`Erreur de synchronisation: ${sessionError.message}`);
          }
          
          setSupabaseSession(data.session);
          console.log("🔐 Authentification synchronisée avec Supabase");
        }
      } else {
        // Déconnecte Supabase si l'utilisateur n'est pas connecté à Clerk
        await supabase.auth.signOut();
        setSupabaseSession(null);
      }
    } catch (err: any) {
      console.error("Erreur d'authentification:", err);
      setError(err.message || "Erreur de synchronisation des authentifications");
      toast.error("Problème de connexion à Supabase. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, user, getToken]);

  // Synchronise à chaque changement d'état d'authentification
  useEffect(() => {
    syncAuth();
    
    // Écoute les changements d'état d'authentification Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSupabaseSession(session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [syncAuth]);

  // Fonction pour forcer une re-synchronisation
  const refreshAuth = useCallback(() => {
    syncAuth();
  }, [syncAuth]);

  return { 
    isAuthenticated: !!supabaseSession, 
    supabaseSession, 
    refreshAuth, 
    loading, 
    error 
  };
}
