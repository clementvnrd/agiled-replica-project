
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@clerk/clerk-react';

export interface RagDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
  user_id: string;
}

export function useRagDocuments() {
  const { user } = useUser();
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('rag_documents')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setDocuments(data as RagDocument[]);
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
      
      // Update local state
      setDocuments(prev => [...prev, data as RagDocument]);
      return data;
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
      
      // Update local state
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
