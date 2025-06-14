
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

/**
 * Récupère les documents RAG pour un utilisateur donné.
 *
 * Args:
 *   userId (string): L'identifiant utilisateur.
 *
 * Returns:
 *   Promise<Array<Database['public']['Tables']['rag_documents']['Row']>>
 */
export async function getRagDocumentsByUser(userId: string) {
  // On laisse Supabase inférer le typage
  const { data, error } = await supabase
    .from('rag_documents')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as Database['public']['Tables']['rag_documents']['Row'][];
}

/**
 * Ajoute un document RAG pour un utilisateur donné.
 *
 * Args:
 *   userId (string): L'identifiant utilisateur.
 *   content (string): Le contenu du document.
 *   metadata (Database['public']['Tables']['rag_documents']['Insert']['metadata']): Les métadonnées du document.
 *
 * Returns:
 *   Promise<Database['public']['Tables']['rag_documents']['Row'] | null>
 */
export async function addRagDocument(userId: string, content: string, metadata: Database['public']['Tables']['rag_documents']['Insert']['metadata']) {
  // Cast explicite pour éviter l'erreur TypeScript
  const insertObj = { user_id: userId, content, metadata } as Database['public']['Tables']['rag_documents']['Insert'];
  const { data, error } = await supabase
    .from('rag_documents')
    .insert([insertObj])
    .single();
  if (error) throw error;
  return data as Database['public']['Tables']['rag_documents']['Row'] | null;
}
