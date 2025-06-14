
// Migration : utilisation du client Supabase global (plus de logique multi-instance)
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
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
 * Hook to manage MCP connections for the current user.
 */
export function useMcpConnections() {
  const { user } = useUser();
  const [connections, setConnections] = useState<McpConnection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConnections = async () => {
    if (!user) {
      setConnections([]);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase
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
    fetchConnections();
  }, [user]);

  const addConnection = async (name: string, url: string, description?: string) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
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
    try {
      const { error } = await supabase
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
    const connection = connections.find(c => c.id === id);
    if (!connection) return false;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { error } = await supabase
        .from('mcp_connections')
        .update({ status: 'connected' })
        .eq('id', id);
      if (error) throw new Error(error.message);
      setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'connected' } : c));
      toast.success('Test de connexion MCP réussi');
      return true;
    } catch (err) {
      ErrorHandler.handleError(err, 'Failed to test MCP connection');
      await supabase
        .from('mcp_connections')
        .update({ status: 'error' })
        .eq('id', id);
      setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'error' } : c));
      toast.error('Échec du test de connexion MCP');
      return false;
    }
  };

  return {
    connections,
    isLoading,
    error,
    addConnection,
    deleteConnection,
    testConnection,
    refreshConnections: fetchConnections
  };
}
