import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useDynamicSupabase } from '@/providers/DynamicSupabaseProvider';
import { RagDocument } from '@/types';

/**
 * Hook to manage RAG documents for the current user using their dynamic Supabase client.
 *
 * Returns:
 *   documents (RagDocument[]): List of RAG documents.
 *   isLoading (boolean): Loading state.
 *   error (Error | null): Error state.
 *   addDocument (function): Add a new RAG document.
 *   deleteDocument (function): Delete a RAG document by ID.
 */
export function useRagDocuments() {
  const { user } = useUser();
  const { supabase, loading: supabaseLoading, error: supabaseError } = useDynamicSupabase();
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;
    if (supabaseLoading) return;
    if (supabaseError) {
      setError(new Error(supabaseError));
      setIsLoading(false);
      return;
    }
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('rag_documents')
          .select('*')
          .eq('user_id', user.id);
        if (error) throw error;
        
        // Convertir explicitement le type et s'assurer que chaque document a un ID
        const processedData = (data || []).map(doc => ({
          ...doc,
          id: doc.id || crypto.randomUUID() // Utiliser l'ID existant ou en générer un
        })) as RagDocument[];
        
        setDocuments(processedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching RAG documents:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [user, supabase, supabaseLoading, supabaseError]);

  const addDocument = async (content: string, metadata: Record<string, any> = {}) => {
    if (!user) return null;
    if (supabaseLoading || supabaseError) return null;
    try {
      const newDocument = {
        user_id: user.id,
        content,
        metadata
      };
      const { data, error } = await supabase
        .from('rag_documents')
        .insert([newDocument])
        .select()
        .single();
      if (error) throw error;
      
      // Assurer que le document a un ID
      const processedDoc = {
        ...data,
        id: data.id || crypto.randomUUID()
      } as RagDocument;
      
      setDocuments(prev => [...prev, processedDoc]);
      return processedDoc;
    } catch (err) {
      console.error('Error adding RAG document:', err);
      return null;
    }
  };

  const deleteDocument = async (id: string) => {
    if (supabaseLoading || supabaseError) return false;
    try {
      const { error } = await supabase
        .from('rag_documents')
        .delete()
        .match({ id });
      if (error) throw error;
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting RAG document:', err);
      return false;
    }
  };

  return {
    documents,
    isLoading: isLoading || supabaseLoading,
    error: error || (supabaseError ? new Error(supabaseError) : null),
    addDocument,
    deleteDocument
  };
}
