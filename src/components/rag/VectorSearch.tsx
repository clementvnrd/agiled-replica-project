
// Migration : utilisation du client Supabase global (plus de logique multi-instance)
import { supabase } from '@/integrations/supabase/client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

interface RagDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
  // Add the similarity property which might be returned from vector search
  similarity?: number;
}

const VectorSearch: React.FC = () => {
  const { user } = useUser();
  const dynamicSupabase = supabase;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RagDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !dynamicSupabase || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call the Supabase Edge Function for vector search
      const { data, error: searchError } = await dynamicSupabase.functions.invoke('vector_search', {
        body: { query, userId: user.id, limit: 5 }
      });
      
      if (searchError) throw new Error(searchError.message);
      
      setResults(data || []);
    } catch (err: any) {
      console.error('Vector search error:', err);
      setError(err.message || 'An error occurred during vector search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recherche Sémantique</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Entrez votre requête de recherche..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow"
            />
            <Button 
              type="submit" 
              disabled={loading || !query.trim() || !dynamicSupabase}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Rechercher</span>
            </Button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Résultats ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((doc) => (
                <div key={doc.id} className="p-4 border rounded-md hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {doc.metadata?.title || 'Document sans titre'}
                    </h3>
                    {doc.similarity !== undefined && (
                      <span className="text-sm text-gray-500">
                        Pertinence: {(doc.similarity * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{doc.content}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {query && !loading && results.length === 0 && (
        <div className="text-center p-8 border rounded-md bg-slate-50">
          <p className="text-gray-500">Aucun résultat trouvé pour votre recherche.</p>
        </div>
      )}
    </div>
  );
};

export default VectorSearch;
