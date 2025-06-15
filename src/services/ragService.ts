
import { supabase } from '@/integrations/supabase/client';

export const searchRag = async (query: string, userId: string): Promise<string> => {
  try {
    const { data: searchResults, error: searchError } = await supabase.functions.invoke('vector_search', {
      body: { query, userId, limit: 3 }
    });

    if (searchError) {
      console.warn("La recherche RAG a échoué:", searchError.message);
      return "";
    }

    if (searchResults && searchResults.length > 0) {
      return "Contexte potentiellement pertinent de votre base de connaissances :\n" +
        searchResults.map((doc: any) => `- ${doc.content}`).join('\n') + "\n\n";
    }
    
    return "";
  } catch (e) {
    console.warn("La recherche RAG a échoué, je continue sans contexte.", e);
    return "";
  }
};
