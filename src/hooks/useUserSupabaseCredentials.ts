import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react'; // Import useAuth
import { createClient } from '@supabase/supabase-js'; // Import createClient
import { supabase } from '@/lib/supabaseClient'; // Gardez l'import du client global pour getCredentials

// Ajout de l'interface UserSupabaseCredentials
export interface UserSupabaseCredentials {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

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

      // 2. Créer un client Supabase temporaire AUTHENTIFIÉ pour l'écriture
      // Utilise l'URL/Clé Anon GLOBALE mais surcharge l'en-tête Authorization
      const tempSupabaseClient = createClient(
        import.meta.env.VITE_SUPABASE_URL!, // URL Globale
        import.meta.env.VITE_SUPABASE_ANON_KEY!, // Clé Anon Globale
        {
          global: {
            headers: { Authorization: `Bearer ${supabaseToken}` }, // Injecte le JWT Clerk
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

  useEffect(() => {
    if (user) {
      getCredentials();
    } else {
      // Si l'utilisateur se déconnecte, réinitialiser
      setCredentials(null);
      setLoading(false);
      setError(null);
    }
  }, [user, getCredentials]);

  return { credentials, loading, error, saveCredentials, getCredentials, clearCredentials };
}
