
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Configuration par défaut pour les clients Supabase, avec des options d'auth standard
const defaultOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
};

/**
 * Crée un client Supabase avec les credentials fournis
 * 
 * @param credentials Objet contenant les credentials Supabase (URL et clé anonyme)
 * @returns Instance du client Supabase
 */
export function createDynamicSupabaseClient(credentials: { supabaseUrl: string; supabaseAnonKey: string }) {
  // Vérifier que les credentials sont présents
  if (!credentials.supabaseUrl || !credentials.supabaseAnonKey) {
    console.warn('Credentials Supabase incomplets ou manquants');
    return createEmptyClient();
  }

  try {
    return createClient<Database>(
      credentials.supabaseUrl,
      credentials.supabaseAnonKey,
      defaultOptions
    );
  } catch (error) {
    console.error('Erreur lors de la création du client Supabase:', error);
    return createEmptyClient();
  }
}

/**
 * Crée un client Supabase vide qui ne fait rien
 * Utilisé quand les credentials ne sont pas disponibles
 */
function createEmptyClient() {
  // Créer un proxy qui intercepte toutes les méthodes
  // et retourne des valeurs par défaut sécurisées
  return new Proxy({} as ReturnType<typeof createClient<Database>>, {
    get(target, prop) {
      // Si la propriété est une fonction ou un objet, retourner un proxy
      if (typeof prop === 'string') {
        // Pour les méthodes d'authentification
        if (prop === 'auth') {
          return new Proxy({}, {
            get: () => () => ({ data: {}, error: null })
          });
        }
        
        // Pour les méthodes de requête (from, rpc, etc.)
        if (['from', 'rpc', 'storage', 'functions'].includes(prop)) {
          return () => ({
            select: () => ({ data: [], error: { message: 'Supabase non configuré' } }),
            insert: () => ({ data: null, error: { message: 'Supabase non configuré' } }),
            update: () => ({ data: null, error: { message: 'Supabase non configuré' } }),
            delete: () => ({ data: null, error: { message: 'Supabase non configuré' } }),
            invoke: () => ({ data: null, error: { message: 'Supabase non configuré' } }),
            catch: (fn: any) => fn({ message: 'Supabase non configuré' })
          });
        }
      }
      
      // Pour tout le reste, retourner une fonction vide
      return () => ({ data: null, error: { message: 'Supabase non configuré' } });
    }
  });
}
