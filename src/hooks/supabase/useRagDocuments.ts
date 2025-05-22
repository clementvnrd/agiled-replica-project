import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { RagDocument } from '@/types';

/**
 * Hook to manage RAG documents for the current user using their dynamic Supabase client.
 */
export function useRagDocuments() {
  const { user } = useUser();
  const dynamicSupabase = supabase;
  const supabaseLoading = false;
  const supabaseError = null;
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Utilitaire pour convertir un objet brut en RagDocument typé
  function toRagDocument(doc: Record<string, unknown>, fallbackUserId: string): RagDocument {
    return {
      id: typeof doc.id === 'string' ? doc.id : String(doc.id ?? `doc-${crypto.randomUUID()}`),
      user_id: typeof doc.user_id === 'string' ? doc.user_id : fallbackUserId,
      content: typeof doc.content === 'string' ? doc.content : doc.content === null ? null : '',
      metadata: typeof doc.metadata === 'object' && doc.metadata !== null ? doc.metadata as Record<string, any> : {},
      embedding: Array.isArray(doc.embedding) || typeof doc.embedding === 'string' || doc.embedding === null ? doc.embedding as number[] | string | null : null,
      created_at: typeof doc.created_at === 'string' ? doc.created_at : doc.created_at === null ? null : '',
    };
  }

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
        if (!dynamicSupabase) throw new Error('Supabase client not available');
        const { data, error } = await dynamicSupabase
          .from('rag_documents')
          .select('*')
          .eq('user_id', user.id);
        if (error) throw error;
        
        const processedData: RagDocument[] = (data || []).map((doc: Record<string, unknown>) => toRagDocument(doc, user?.id || ''));
        
        setDocuments(processedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching RAG documents:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [user, dynamicSupabase, supabaseLoading, supabaseError]);

  const addDocument = async (content: string, metadata: Record<string, any> = {}) => {
    if (!user) return null;
    if (supabaseLoading || supabaseError) return null;
    if (!dynamicSupabase) return null;
    try {
      const newDocument = {
        user_id: user.id,
        content,
        metadata
      };
      const { data, error } = await dynamicSupabase
        .from('rag_documents')
        .insert([newDocument])
        .select()
        .single();
      if (error) throw error;
      
      // Ensure the document has an ID and required fields
      const processedDoc: RagDocument = toRagDocument(data as Record<string, unknown>, user?.id || '');
      
      setDocuments(prev => [...prev, processedDoc]);
      return processedDoc;
    } catch (err) {
      console.error('Error adding RAG document:', err);
      return null;
    }
  };

  const deleteDocument = async (id: string) => {
    if (supabaseLoading || supabaseError) return false;
    if (!dynamicSupabase) return false;
    try {
      const { error } = await dynamicSupabase
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
