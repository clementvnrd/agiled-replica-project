
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

/**
 * Fonction Edge Supabase pour la recherche vectorielle
 * 
 * Cette fonction:
 * 1. Reçoit une requête de recherche et un ID utilisateur
 * 2. Récupère la clé API OpenAI de l'utilisateur (ou la clé par défaut)
 * 3. Crée un embedding de la requête via OpenAI
 * 4. Recherche dans la base de données les documents avec des embeddings similaires
 * 5. Retourne les résultats triés par similarité
 */

interface RequestBody {
  query: string;
  userId: string;
  limit?: number;
  threshold?: number;
}

async function createEmbedding(apiKey: string, content: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input: content.trim(),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error('OpenAI API error:', errorBody);
    throw new Error(`Failed to generate embedding: ${errorBody.error.message}`);
  }

  const embeddingResponse = await response.json();

  if (embeddingResponse.data.length === 0) {
    throw new Error("Failed to generate embedding, no data returned.");
  }

  return embeddingResponse.data[0].embedding;
}


serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }
    
    // Récupération des credentials depuis les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const defaultOpenaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!supabaseUrl || !serviceKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }
    
    const supabase = createClient(supabaseUrl, serviceKey);
    
    const { query, userId, limit = 5, threshold = 0.7 } = await req.json() as RequestBody;
    
    if (!query || !userId) {
      return new Response(JSON.stringify({ error: 'query et userId sont requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Récupérer la clé OpenAI personnalisée de l'utilisateur
    let userApiKey: string | null = null;
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('openai_api_key')
            .eq('id', userId)
            .single();

        if (profile && profile.openai_api_key) {
            userApiKey = profile.openai_api_key;
        }
    } catch(e) {
        console.warn(`Impossible de récupérer le profil ou la clé OpenAI pour l'utilisateur ${userId}. Utilisation de la clé par défaut. Erreur: ${e.message}`);
    }
    
    const openaiKeyToUse = userApiKey || defaultOpenaiKey;

    if (!openaiKeyToUse) {
        return new Response(JSON.stringify({ error: 'La clé API OpenAI n\'est pas configurée sur le serveur et vous n\'en avez pas fourni dans vos paramètres.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
    
    // Génération de l'embedding pour la requête
    const embedding = await createEmbedding(openaiKeyToUse, query);
    
    // Recherche des documents similaires
    const { data: documents, error } = await supabase
      .rpc('match_documents', {
        query_embedding: embedding,
        similarity_threshold: threshold,
        match_count: limit,
        p_user_id: userId
      });
    
    if (error) {
      console.error('Supabase RPC error:', error);
      throw error;
    }
    
    return new Response(JSON.stringify(documents || []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    console.error('Error in vector-search function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
