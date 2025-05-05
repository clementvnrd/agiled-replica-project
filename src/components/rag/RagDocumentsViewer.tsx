
import React, { useState, useEffect } from 'react';
import { useDynamicSupabase } from '@/providers/DynamicSupabaseProvider';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, FileText, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { RagDocument } from '@/types';

const RagDocumentsViewer: React.FC = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { supabase, loading: supabaseLoading, error: supabaseError } = useDynamicSupabase();

  if (supabaseLoading) return <div>Chargement Supabase...</div>;
  if (supabaseError) return <div>Erreur Supabase : {supabaseError}</div>;

  useEffect(() => {
    if (user && !supabaseLoading && !supabaseError) {
      fetchDocuments();
    }
  }, [user, supabase, supabaseLoading, supabaseError]);

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
    try {
      const { data, error } = await supabase
        .from('rag_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Convertir explicitement le type et s'assurer que chaque document a un ID
      const processedData = (data || []).map(doc => ({
        ...doc,
        id: doc.id || crypto.randomUUID() // Utiliser l'ID existant ou en générer un
      }));
      
      setDocuments(processedData as RagDocument[]);
      setFilteredDocuments(processedData as RagDocument[]);
    } catch (err) {
      console.error('Erreur lors de la récupération des documents:', err);
      toast.error("Erreur lors de la récupération des documents");
    } finally {
      setIsLoading(false);
    }
  };

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
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          {searchQuery ? (
            <>
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium text-gray-600">Aucun résultat trouvé</h3>
              <p className="text-sm text-gray-500">
                Essayez d'autres termes de recherche
              </p>
            </>
          ) : (
            <>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium text-gray-600">Aucun document</h3>
              <p className="text-sm text-gray-500">
                Votre base de connaissances est vide
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map(doc => (
            <Card key={doc.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-2">
                <CardTitle className="text-base truncate">
                  {doc.metadata?.title || 'Sans titre'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-xs text-gray-500 mb-2">
                  {doc.created_at ? new Date(doc.created_at).toLocaleString() : ''}
                </div>
                <p className="text-sm line-clamp-4">{doc.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RagDocumentsViewer;
