import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Hook pour gérer les credentials Supabase liés à un utilisateur Clerk.
 * Version persistante : stocke les credentials dans la table user_supabase_credentials de Supabase (maître).
 */
export function useUserSupabaseCredentials() {
  const { user } = useUser();
  const [credentials, setCredentials] = useState<{ supabaseUrl: string; supabaseAnonKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère les credentials depuis la table Supabase
  useEffect(() => {
    if (!user) return;
    getCredentials();
    // eslint-disable-next-line
  }, [user]);

  const getCredentials = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_supabase_credentials')
        .select('supabase_url, supabase_anon_key')
        .eq('clerk_user_id', user.id)
        .single();
      if (fetchError) {
        if (fetchError.code === 'PGRST116' || fetchError.message?.toLowerCase().includes('no rows')) { // Not found
          setCredentials(null);
          return;
        } else {
          setError(fetchError.message);
          return;
        }
      }
      if (data) {
        setCredentials({
          supabaseUrl: data.supabase_url,
          supabaseAnonKey: data.supabase_anon_key
        });
      } else {
        setCredentials(null);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des credentials');
      setCredentials(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveCredentials = useCallback(async (creds: { supabaseUrl: string; supabaseAnonKey: string }) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Upsert (insert or update)
      const { error: upsertError } = await supabase
        .from('user_supabase_credentials')
        .upsert({
          clerk_user_id: user.id,
          supabase_url: creds.supabaseUrl,
          supabase_anon_key: creds.supabaseAnonKey
        }, { onConflict: 'clerk_user_id' });
      if (upsertError) {
        setError(upsertError.message);
        return false;
      }
      setCredentials(creds);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde des credentials');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearCredentials = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { error: delError } = await supabase
        .from('user_supabase_credentials')
        .delete()
        .eq('clerk_user_id', user.id);
      if (delError) {
        setError(delError.message);
      }
      setCredentials(null);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression des credentials');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { credentials, getCredentials, saveCredentials, clearCredentials, loading, error };
}
