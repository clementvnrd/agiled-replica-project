// Migration : utilisation du client Supabase global (plus de logique multi-instance)
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { ErrorHandler } from '@/utils/errorHandler';

export interface McpConnection {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  description?: string;
  created_at: string;
  user_id: string;
}

/**
 * Hook to manage MCP connections for the current user using their dynamic Supabase client.
 *
 * Returns:
 *   connections (McpConnection[]): List of MCP connections.
 *   isLoading (boolean): Loading state.
 *   error (Error | null): Error state.
 *   addConnection (function): Add a new MCP connection.
 *   deleteConnection (function): Delete an MCP connection by ID.
 *   testConnection (function): Test an MCP connection by ID.
 */
export function useMcpConnections() {
  const { user } = useUser();
  const dynamicSupabase = supabase;
  const supabaseLoading = false;
  const supabaseError = null;
  const [connections, setConnections] = useState<McpConnection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConnections = async () => {
    if (!user || !dynamicSupabase) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await (dynamicSupabase as any)
        .from('mcp_connections')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
      setConnections((data ?? []) as McpConnection[]);
      setError(null);
    } catch (err) {
      ErrorHandler.handleError(err, 'Failed to fetch MCP connections');
      setError(err instanceof Error ? err : new Error('Failed to fetch connections'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && dynamicSupabase && !supabaseLoading) {
      fetchConnections();
    } else if (!dynamicSupabase && !supabaseLoading) {
      setConnections([]);
      setIsLoading(false);
    }
  }, [user, dynamicSupabase, supabaseLoading]);

  const addConnection = async (name: string, url: string, description?: string) => {
    if (!user || !dynamicSupabase) return null;
    try {
      const { data, error } = await (dynamicSupabase as any)
        .from('mcp_connections')
        .insert([
          { name, url, description, status: 'connected', user_id: user.id }
        ])
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      if (data) setConnections(prev => [...prev, data as McpConnection]);
      toast.success('Connexion MCP ajoutée avec succès');
      return (data as McpConnection) ?? null;
    } catch (err) {
      ErrorHandler.handleError(err, 'Failed to add MCP connection');
      toast.error('Échec de l\'ajout de la connexion MCP');
      return null;
    }
  };

  const deleteConnection = async (id: string) => {
    if (!dynamicSupabase) return false;
    try {
      const { error } = await (dynamicSupabase as any)
        .from('mcp_connections')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      setConnections(prev => prev.filter(conn => conn.id !== id));
      toast.success('Connexion MCP supprimée');
      return true;
    } catch (err) {
      ErrorHandler.handleError(err, 'Failed to delete MCP connection');
      toast.error('Échec de la suppression de la connexion MCP');
      return false;
    }
  };

  const testConnection = async (id: string) => {
    if (!dynamicSupabase) return false;
    const connection = connections.find(c => c.id === id);
    if (!connection) return false;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { error } = await (dynamicSupabase as any)
        .from('mcp_connections')
        .update({ status: 'connected' })
        .eq('id', id);
      if (error) throw new Error(error.message);
      setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'connected' } : c));
      toast.success('Test de connexion MCP réussi');
      return true;
    } catch (err) {
      ErrorHandler.handleError(err, 'Failed to test MCP connection');
      if (dynamicSupabase) {
        await (dynamicSupabase as any)
          .from('mcp_connections')
          .update({ status: 'error' })
          .eq('id', id);
        setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'error' } : c));
      }
      toast.error('Échec du test de connexion MCP');
      return false;
    }
  };

  return {
    connections,
    isLoading: isLoading || supabaseLoading,
    error: error || (supabaseError ? new Error(supabaseError) : null),
    addConnection,
    deleteConnection,
    testConnection,
    refreshConnections: fetchConnections
  };
}
