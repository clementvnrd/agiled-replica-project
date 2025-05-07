
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface MCPConnection {
  id: string;
  name: string;
  url: string;
  status: string;
  description?: string;
  created_at: string;
}

export interface MCPConnectionsListProps {
  connectionsList: MCPConnection[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const MCPConnectionsList: React.FC<MCPConnectionsListProps> = ({ 
  connectionsList, 
  isLoading, 
  onRefresh,
  onDelete 
}) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'disconnected':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const renderTableContent = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
      ));
    }

    if (connectionsList.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucune connexion MCP configurée.</p>
            <Button 
              variant="outline" 
              onClick={onRefresh} 
              className="mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Rafraîchir
            </Button>
          </TableCell>
        </TableRow>
      );
    }

    return connectionsList.map(connection => (
      <TableRow key={connection.id}>
        <TableCell className="font-medium">{connection.name}</TableCell>
        <TableCell className="font-mono text-xs truncate max-w-[250px]">
          <a 
            href={connection.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:text-blue-600 hover:underline"
          >
            {connection.url}
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </TableCell>
        <TableCell className="max-w-[250px] truncate">
          {connection.description || <span className="text-gray-400 italic">Aucune description</span>}
        </TableCell>
        <TableCell>
          <Badge className={getStatusBadgeStyle(connection.status)}>
            {connection.status}
          </Badge>
        </TableCell>
        <TableCell>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(connection.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MCPConnectionsList;
