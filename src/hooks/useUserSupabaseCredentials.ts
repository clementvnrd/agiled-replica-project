import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react'; // Import useAuth
import { createClient } from '@supabase/supabase-js'; // Import createClient
import { supabase } from '@/lib/supabaseClient'; // Gardez l'import du client global pour getCredentials

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

  console.log('[DEBUG][useUserSupabaseCredentials] Clerk user:', user);

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
    if (!user) return false;
    const userId = user.id;
    setLoading(true); // Indiquer le chargement pendant la sauvegarde
    setError(null);

    try {
      // 1. Obtenir le jeton Supabase depuis Clerk
      const supabaseToken = await getToken({ template: 'supabase' });
      if (!supabaseToken) {
        throw new Error("Impossible d'obtenir le jeton Supabase depuis Clerk.");
      }

      // LOG pour debug
      console.log("SUPABASE URL utilisée pour l'upsert:", import.meta.env.VITE_SUPABASE_URL);

      // Vérifie que l'URL est bien celle de TON projet Supabase personnel
      const tempSupabaseClient = createClient(
        import.meta.env.VITE_SUPABASE_URL!,
        import.meta.env.VITE_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: { Authorization: `Bearer ${supabaseToken}` },
          },
        }
      );

      // 3. Effectuer l'upsert avec le client authentifié
      const { error: saveError } = await tempSupabaseClient // Utilise le client temporaire
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
        // Log spécifique pour les erreurs Supabase
        console.error('Erreur Supabase lors de la sauvegarde:', saveError);
        throw new Error(saveError.message || 'Erreur Supabase inconnue lors de la sauvegarde.');
      }

      // Mettre à jour l'état local SEULEMENT si la sauvegarde réussit
      setCredentials(newCredentials);
      console.log('Credentials sauvegardés avec succès');
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
      console.error('[DEBUG][useUserSupabaseCredentials] No credentials found for user:', user?.id);
      return null;
    }
    console.log('[DEBUG][useUserSupabaseCredentials] Creating dynamic Supabase client with:', credentials.supabaseUrl, credentials.supabaseAnonKey);
    return createClient(credentials.supabaseUrl, credentials.supabaseAnonKey);
  }, [credentials, user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Log le début du SELECT
    console.log('[DEBUG][useUserSupabaseCredentials] SELECT credentials for user:', user.id);
    supabase
      .from('user_supabase_credentials')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single()
      .then(({ data, error }) => {
        // Si aucune ligne trouvée, ce n'est PAS une erreur bloquante : on affiche le formulaire
        if (error && error.code === 'PGRST116') {
          // "The result contains 0 rows" (aucun credentials pour ce user)
          console.log('[DEBUG][useUserSupabaseCredentials] Aucun credentials trouvés pour ce user, formulaire à afficher.');
          setCredentials(null);
          setError(null);
        } else if (error) {
          // Vraie erreur Supabase
          console.error('[DEBUG][useUserSupabaseCredentials] Error fetching credentials:', error);
          setError(error.message);
        } else {
          // On mappe les champs snake_case -> camelCase
          if (data) {
            const mapped = {
              ...data,
              supabaseUrl: data.supabase_url,
              supabaseAnonKey: data.supabase_anon_key,
            };
            console.log('[DEBUG][useUserSupabaseCredentials] Credentials fetched:', mapped);
            setCredentials(mapped);
          } else {
            setCredentials(null);
          }
        }
        setLoading(false);
      });
  }, [user]);

  return { credentials, loading, error, saveCredentials, getCredentials, clearCredentials, createUserSupabaseClient };
}
