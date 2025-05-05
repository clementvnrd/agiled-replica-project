
import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react'; // Import useAuth
import { createClient } from '@supabase/supabase-js'; // Import createClient
import { supabase } from '@/lib/supabaseClient'; // Gardez l'import du client global pour getCredentials
import { toast } from 'sonner';

// Ajout de l'interface UserSupabaseCredentials
export interface UserSupabaseCredentials {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * Custom hook to manage per-user Supabase credentials.
 *
 * - Uses .env Supabase URL/anon key ONLY for the upsert (saveCredentials) to store user credentials.
 * - For all user-specific operations, exposes a helper to create a Supabase client with the user's own credentials.
 *
 * Returns:
 *   credentials: The user's Supabase credentials (from DB)
 *   loading: Loading state
 *   error: Error state
 *   saveCredentials: Function to upsert credentials (uses .env Supabase instance)
 *   getCredentials: Refetch credentials from DB
 *   clearCredentials: Clear credentials from state
 *   createUserSupabaseClient: Returns a Supabase client using the user's credentials (or null if not set)
 */
export function useUserSupabaseCredentials() {
  const { user } = useUser();
  const { getToken } = useAuth(); // Obtenir la fonction getToken de Clerk
  const [credentials, setCredentials] = useState<UserSupabaseCredentials | null | undefined>(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCredentials = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    setLoading(true);
    setError(null);
    try {
      // Utilise le client global (anonyme) pour lire, car RLS SELECT est sur la base utilisateur
      // ou nous avons désactivé RLS SELECT sur la base globale pour la lecture initiale
      const { data, error: fetchError } = await supabase
        .from('user_supabase_credentials')
        .select('supabase_url, supabase_anon_key')
        .eq('clerk_user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setCredentials({
          supabaseUrl: data.supabase_url,
          supabaseAnonKey: data.supabase_anon_key
        });
      } else {
        setCredentials(null);
      }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des credentials:', err);
      setError(err.message || 'Impossible de récupérer les credentials Supabase.');
      setCredentials(null); // Assurez-vous que credentials est null en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveCredentials = useCallback(async (newCredentials: UserSupabaseCredentials): Promise<boolean> => {
    if (!user) {
      toast.error("Erreur d'authentification", { 
        description: "Vous devez être connecté pour enregistrer vos credentials." 
      });
      return false;
    }
    
    const userId = user.id;
    setLoading(true); // Indiquer le chargement pendant la sauvegarde
    setError(null);

    try {
      // 1. Obtenir le jeton Supabase depuis Clerk
      const supabaseToken = await getToken({ template: 'supabase' }).catch(err => {
        console.error("Erreur lors de l'obtention du token Clerk:", err);
        return null;
      });
      
      if (!supabaseToken) {
        throw new Error("Impossible d'obtenir le jeton Supabase depuis Clerk.");
      }

      // Vérifie que l'URL est bien disponible
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Variables d'environnement Supabase manquantes.");
      }

      // Créer un client Supabase temporaire avec authentification
      const tempSupabaseClient = createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          global: {
            headers: { Authorization: `Bearer ${supabaseToken}` },
          },
        }
      );

      // 3. Effectuer l'upsert avec le client authentifié
      const { error: saveError } = await tempSupabaseClient
        .from('user_supabase_credentials')
        .upsert({
          clerk_user_id: userId,
          supabase_url: newCredentials.supabaseUrl,
          supabase_anon_key: newCredentials.supabaseAnonKey,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'clerk_user_id',
        });

      if (saveError) {
        console.error('Erreur Supabase lors de la sauvegarde:', saveError);
        throw new Error(saveError.message || 'Erreur Supabase inconnue lors de la sauvegarde.');
      }

      // Mettre à jour l'état local SEULEMENT si la sauvegarde réussit
      setCredentials(newCredentials);
      return true;

    } catch (err: any) {
      console.error('Erreur générale lors de la sauvegarde des credentials:', err);
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde.');
      // Ne pas mettre à jour setCredentials si la sauvegarde échoue
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, getToken]); // Ajouter getToken aux dépendances

  // Ajout de clearCredentials
  const clearCredentials = useCallback(() => {
    setCredentials(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Helper to create a Supabase client using the user's credentials from state.
   * Returns null if credentials are not loaded.
   */
  const createUserSupabaseClient = useCallback(() => {
    if (!credentials) {
      return null;
    }
    
    try {
      return createClient(credentials.supabaseUrl, credentials.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } catch (error) {
      console.error("Erreur lors de la création du client utilisateur:", error);
      return null;
    }
  }, [credentials]);

  useEffect(() => {
    if (!user) return;
    
    getCredentials().catch(err => {
      console.error("Erreur lors de la récupération initiale des credentials:", err);
      setError("Erreur lors du chargement des credentials");
      setLoading(false);
    });
  }, [user, getCredentials]);

  return { credentials, loading, error, saveCredentials, getCredentials, clearCredentials, createUserSupabaseClient };
}
