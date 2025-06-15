
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { RagDocument } from '@/types';
import { ErrorHandler } from '@/utils/errorHandler';

const RAG_DOCUMENTS_QUERY_KEY = 'ragDocuments';

// Helper to fetch documents
const fetchDocuments = async (userId: string): Promise<RagDocument[]> => {
  const { data, error } = await supabase
    .from('rag_documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw ErrorHandler.handleSupabaseError(error, 'fetch RAG documents');
  return (data || []).map(doc => ({ ...doc, id: String(doc.id) })) as RagDocument[];
};

// Helper to add a document
const addDocumentFn = async ({ userId, content, metadata }: { userId: string, content: string, metadata: Record<string, any> }): Promise<RagDocument> => {
  const { data, error } = await supabase
    .from('rag_documents')
    .insert([{ user_id: userId, content, metadata }])
    .select()
    .single();

  if (error) throw ErrorHandler.handleSupabaseError(error, 'add RAG document');
  return { ...data, id: String(data.id) } as RagDocument;
};

// Helper to delete a document
const deleteDocumentFn = async (id: string): Promise<string> => {
  const { error } = await supabase
    .from('rag_documents')
    .delete()
    .match({ id });

  if (error) throw ErrorHandler.handleSupabaseError(error, 'delete RAG document');
  return id;
};

export function useRagDocuments() {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const queryKey = [RAG_DOCUMENTS_QUERY_KEY, user?.id];

  const { data: documents = [], isLoading, error, refetch } = useQuery<RagDocument[], Error>({
    queryKey,
    queryFn: () => {
      if (!user?.id) throw new Error("User not authenticated for RAG documents");
      return fetchDocuments(user.id);
    },
    enabled: !!user,
  });

  const addDocumentMutation = useMutation({
    mutationFn: (newDoc: { content: string, metadata?: Record<string, any> }) => {
      if (!user) throw new Error("User not authenticated");
      return addDocumentFn({ userId: user.id, content: newDoc.content, metadata: newDoc.metadata || {} });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocumentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    documents,
    isLoading,
    error,
    addDocument: addDocumentMutation.mutateAsync,
    deleteDocument: deleteDocumentMutation.mutateAsync,
    refetch,
  };
}
