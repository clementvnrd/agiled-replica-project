
import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const LOCAL_STORAGE_KEY = 'supabase_credentials';

/**
 * Hook pour gérer les credentials Supabase liés à un utilisateur Clerk.
 * Cette version stocke les credentials dans localStorage pour simplifier.
 */
export function useUserSupabaseCredentials() {
  const { user } = useUser();
  const [credentials, setCredentials] = useState<{ supabaseUrl: string; supabaseAnonKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère les credentials du localStorage
  useEffect(() => {
    if (!user) return;
    
    try {
      const storedCreds = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${user.id}`);
      if (storedCreds) {
        setCredentials(JSON.parse(storedCreds));
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des credentials:", err);
    }
  }, [user]);

  const getCredentials = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const storedCreds = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${user.id}`);
      if (storedCreds) {
        const parsedCreds = JSON.parse(storedCreds);
        setCredentials(parsedCreds);
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
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.id}`, JSON.stringify(creds));
      setCredentials(creds);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde des credentials');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearCredentials = useCallback(() => {
    if (!user) return;
    
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_${user.id}`);
    setCredentials(null);
  }, [user]);

  return { credentials, getCredentials, saveCredentials, clearCredentials, loading, error };
}
