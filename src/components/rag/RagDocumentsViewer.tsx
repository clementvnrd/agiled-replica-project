
import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, ServerCrash } from 'lucide-react';
import { toast } from "sonner";
import { RagDocument } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const RagDocumentsViewer: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

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

  const fetchDocuments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('rag_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      const processedData = (data || []).map((doc: any) => ({
        ...doc,
        id: doc.id || `doc-${crypto.randomUUID()}`
      })) as RagDocument[];
      
      setDocuments(processedData);
      setFilteredDocuments(processedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      console.error('Erreur lors de la récupération des documents:', err);
      setError(errorMessage);
      toast.error("Erreur lors de la récupération des documents");
    } finally {
      setIsLoading(false);
    }
  };

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
        <p className="text-sm mb-4">{error}</p>
        <Button onClick={fetchDocuments}>Réessayer</Button>
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
          onClick={fetchDocuments}
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
