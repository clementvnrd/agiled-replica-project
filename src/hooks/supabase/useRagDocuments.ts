
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { RagDocument } from '@/types';

/**
 * Hook to manage RAG documents for the current user.
 */
export function useRagDocuments() {
  const { user } = useUser();
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Utilitaire pour convertir un objet brut en RagDocument typé
  function toRagDocument(doc: Record<string, any>, fallbackUserId: string): RagDocument {
    return {
      id: String(doc.id ?? `doc-${crypto.randomUUID()}`),
      user_id: doc.user_id || fallbackUserId,
      content: doc.content || null,
      metadata: doc.metadata || {},
      embedding: doc.embedding || null,
      created_at: doc.created_at || null,
    };
  }

  useEffect(() => {
    if (!user) {
      setDocuments([]);
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
        
        const processedData: RagDocument[] = (data || []).map((doc) => toRagDocument(doc, user.id));
        
        setDocuments(processedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching RAG documents:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [user]);

  const addDocument = async (content: string, metadata: Record<string, any> = {}) => {
    if (!user) return null;

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
      
      const processedDoc: RagDocument = toRagDocument(data, user.id);
      
      setDocuments(prev => [...prev, processedDoc]);
      return processedDoc;
    } catch (err) {
      console.error('Error adding RAG document:', err);
      return null;
    }
  };

  const deleteDocument = async (id: string) => {
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
    isLoading,
    error,
    addDocument,
    deleteDocument
  };
}
