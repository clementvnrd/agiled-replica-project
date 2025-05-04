import React, { createContext, useContext, useMemo } from 'react';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import { createDynamicSupabaseClient } from '@/lib/createDynamicSupabaseClient';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

/**
 * Context type for the dynamic Supabase client.
 */
interface DynamicSupabaseContextType {
  supabase: SupabaseClient<Database>;
  loading: boolean;
  error: string | null;
}

const DynamicSupabaseContext = createContext<DynamicSupabaseContextType | undefined>(undefined);

/**
 * Provider that fetches the user's Supabase credentials and provides a dynamic Supabase client.
 *
 * Args:
 *   children (React.ReactNode): The children components.
 *
 * Returns:
 *   React.ReactElement: The provider wrapping children with the dynamic Supabase client context.
 */
export function DynamicSupabaseProvider({ children }: { children: React.ReactNode }) {
  const { credentials, loading, error } = useUserSupabaseCredentials();

  // Memoize the client to avoid unnecessary re-instantiations
  const supabase = useMemo(() => {
    if (credentials) {
      return createDynamicSupabaseClient(credentials);
    }
    return createDynamicSupabaseClient({ supabaseUrl: '', supabaseAnonKey: '' });
  }, [credentials]);

  // Optionally, you can show a loading spinner or error UI here
  // For now, just provide the context regardless

  return (
    <DynamicSupabaseContext.Provider value={{ supabase, loading, error }}>
      {children}
    </DynamicSupabaseContext.Provider>
  );
}

/**
 * Hook to access the dynamic Supabase client from context.
 *
 * Returns:
 *   DynamicSupabaseContextType: The dynamic Supabase client, loading, and error state.
 *
 * Raises:
 *   Error: If used outside of DynamicSupabaseProvider.
 */
export function useDynamicSupabase() {
  const context = useContext(DynamicSupabaseContext);
  if (!context) {
    throw new Error('useDynamicSupabase must be used within a DynamicSupabaseProvider');
  }
  return context;
} 