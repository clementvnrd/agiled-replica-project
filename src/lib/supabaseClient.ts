
import { createClient } from '@supabase/supabase-js';
import { Database } from '../integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => fetch(...args)
  }
});

export async function fetchRagDocuments(userId: string) {
  return await supabase
    .from('rag_documents')
    .select('*')
    .eq('user_id', userId);
}

export async function addRagDocument(userId: string, content: string, metadata: Record<string, any> = {}) {
  return await supabase
    .from('rag_documents')
    .insert([
      { user_id: userId, content, metadata }
    ])
    .select()
    .single();
}

export async function deleteRagDocument(id: string) {
  return await supabase
    .from('rag_documents')
    .delete()
    .match({ id });
}

export async function invokeEdgeFunction(functionName: string, payload: any) {
  return await supabase.functions.invoke(functionName, {
    body: payload
  });
}
