
import React, { useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { RagDocument } from '@/types';
import { toast } from 'sonner';
import { ErrorHandler } from '@/utils/errorHandler';

interface VectorSearchProps {
  supabase: SupabaseClient;
  userId: string;
  onResultSelected?: (doc: RagDocument) => void;
}

const VectorSearch: React.FC<VectorSearchProps> = ({ supabase, userId, onResultSelected }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RagDocument[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Veuillez entrer une requête de recherche");
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Appel à la fonction Edge qui va gérer l'embedding et la recherche vectorielle
      const { data, error } = await supabase.functions.invoke('vector_search', {
        body: { query, userId }
      });
      
      if (error) throw error;
      
      // Formatage des résultats
      const formattedResults = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id || `result-${crypto.randomUUID()}`,
        user_id: item.user_id,
        content: item.content,
        metadata: item.metadata || {},
        created_at: item.created_at,
        similarity: item.similarity
      })) : [];
      
      setSearchResults(formattedResults);
      
      if (formattedResults.length === 0) {
        toast.info("Aucun résultat trouvé pour cette recherche");
      }
    } catch (err) {
      ErrorHandler.handleError(err, 'vector_search');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (doc: RagDocument) => {
    if (onResultSelected) {
      onResultSelected(doc);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recherche Vectorielle RAG</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans votre base de connaissances..."
            className="flex-1"
            disabled={isSearching}
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>
        
        {hasSearched && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-500">
              {isSearching 
                ? "Recherche en cours..." 
                : `${searchResults.length} résultat(s) trouvé(s)`}
            </h3>
            
            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(doc)}
                  >
                    <div className="font-medium">{doc.metadata?.title || 'Sans titre'}</div>
                    <div className="text-sm text-gray-600 line-clamp-2 mt-1">{doc.content}</div>
                    {doc.similarity !== undefined && (
                      <div className="text-xs text-gray-400 mt-1">
                        Similarité: {Math.round((doc.similarity as number) * 100)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        La recherche utilise des embeddings vectoriels pour trouver des résultats sémantiquement proches.
      </CardFooter>
    </Card>
  );
};

export default VectorSearch;
