import { useState, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

/**
 * Hook pour gérer les credentials Supabase liés à un utilisateur Clerk.
 *
 * Returns:
 *   credentials (object | null): Les credentials { supabaseUrl, supabaseAnonKey } ou null.
 *   getCredentials (function): Récupère les credentials depuis la table centrale.
 *   saveCredentials (function): Sauvegarde les credentials dans la table centrale.
 *   loading (boolean): Indique si une requête est en cours.
 *   error (string | null): Message d'erreur éventuel.
 */
export function useUserSupabaseCredentials() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [credentials, setCredentials] = useState<{ supabaseUrl: string; supabaseAnonKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // À adapter selon ton backend/API REST pour la table centrale
  const API_URL = '/api/user-supabase-credentials'; // À créer côté backend

  // Récupère le JWT Clerk et l'inclut dans l'en-tête Authorization
  const getCredentials = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Erreur lors de la récupération des credentials');
      const data = await res.json();
      if (data && data.supabase_url && data.supabase_anon_key) {
        setCredentials({ supabaseUrl: data.supabase_url, supabaseAnonKey: data.supabase_anon_key });
      } else {
        setCredentials(null);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
      setCredentials(null);
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  const saveCredentials = useCallback(async (creds: { supabaseUrl: string; supabaseAnonKey: string }) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabase_url: creds.supabaseUrl,
          supabase_anon_key: creds.supabaseAnonKey,
        }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde des credentials');
      setCredentials(creds);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  return { credentials, getCredentials, saveCredentials, loading, error };
} 