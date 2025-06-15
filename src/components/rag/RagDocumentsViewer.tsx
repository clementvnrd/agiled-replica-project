
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, ServerCrash } from 'lucide-react';
import { RagDocument } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRagDocuments } from '@/hooks/supabase/useRagDocuments';

const RagDocumentsViewer: React.FC = () => {
  const { documents, isLoading, error, refetch } = useRagDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState<RagDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDocuments(documents);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredDocuments(
        documents.filter(doc => 
          (doc.content?.toLowerCase() || '').includes(query) || 
          (doc.metadata?.title && doc.metadata.title.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, documents]);

  const getVectorStatus = (doc: RagDocument) => {
    if (doc.embedding) {
      if (Array.isArray(doc.embedding)) {
        return `Présent (${doc.embedding.length} dims)`;
      }
      return 'Présent';
    }
    return 'Absent';
  };

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 text-red-700 rounded-md flex flex-col items-center justify-center">
        <ServerCrash className="h-12 w-12 mx-auto mb-2" />
        <h3 className="font-medium">Erreur lors du chargement</h3>
        <p className="text-sm mb-4">{error.message}</p>
        <Button onClick={() => refetch()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans les documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rafraîchir"}
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Titre</TableHead>
                  <TableHead className="w-[45%]">Contenu</TableHead>
                  <TableHead className="w-[20%]">Date</TableHead>
                  <TableHead className="w-[15%]">Vecteur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {searchQuery ? 'Aucun résultat pour votre recherche.' : 'Aucun document dans votre base de connaissances.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium align-top">
                        {doc.metadata?.title || 'Sans titre'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground align-top">
                        <p className="line-clamp-4">{doc.content}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground align-top">
                        {doc.created_at ? new Date(doc.created_at).toLocaleString() : ''}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={doc.embedding ? "secondary" : "outline"}>
                          {getVectorStatus(doc)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RagDocumentsViewer;
