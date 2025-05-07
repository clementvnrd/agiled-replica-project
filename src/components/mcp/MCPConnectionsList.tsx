
import React, { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Loader2, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ErrorHandler } from '@/utils/errorHandler';

interface MCPConnection {
  id: string;
  name: string;
  url: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  last_accessed: string | null;
}

interface MCPConnectionsListProps {
  userId: string | undefined;
  supabase: SupabaseClient;
}

const MCPConnectionsList: React.FC<MCPConnectionsListProps> = ({ userId, supabase }) => {
  const [connections, setConnections] = useState<MCPConnection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchConnections = async () => {
      try {
        const { data, error } = await supabase
          .from('mcp_connections')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setConnections(data || []);
      } catch (err) {
        ErrorHandler.handleSupabaseError(err, 'fetchConnections');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnections();
  }, [userId, supabase]);

  const handleDeleteConnection = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette connexion ?')) return;
    
    try {
      const { error } = await supabase
        .from('mcp_connections')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setConnections(connections.filter(conn => conn.id !== id));
      toast.success('Connexion supprimée avec succès');
    } catch (err) {
      ErrorHandler.handleSupabaseError(err, 'deleteConnection');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="font-medium text-gray-700 text-lg mb-2">Aucun connecteur MCP trouvé</h3>
        <p className="text-gray-500 mb-4">
          Vous n'avez pas encore configuré de connecteurs Multi-Channel Provider.
        </p>
        <Button variant="outline" onClick={() => document.querySelector("[value='add']")?.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        )}>
          Configurer votre premier connecteur
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableCaption>Liste de vos connecteurs MCP</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernière utilisation</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow key={connection.id}>
              <TableCell className="font-medium">{connection.name}</TableCell>
              <TableCell>{connection.type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(connection.status)}`}>
                  {connection.status}
                </span>
              </TableCell>
              <TableCell>
                {connection.last_accessed 
                  ? new Date(connection.last_accessed).toLocaleDateString() 
                  : 'Jamais'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={connection.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Ouvrir</span>
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteConnection(connection.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MCPConnectionsList;
