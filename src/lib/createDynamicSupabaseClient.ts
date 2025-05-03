
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

/**
 * Crée un client Supabase avec les credentials fournis
 */
export function createDynamicSupabaseClient(credentials: { supabaseUrl: string; supabaseAnonKey: string }) {
  return createClient<Database>(credentials.supabaseUrl, credentials.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}
