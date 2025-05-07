
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

/**
 * Fonction Edge Supabase pour la recherche vectorielle
 * 
 * Cette fonction:
 * 1. Reçoit une requête de recherche
 * 2. Crée un embedding via OpenAI
 * 3. Recherche dans la base de données les documents avec des embeddings similaires
 * 4. Retourne les résultats triés par similarité
 */

interface RequestBody {
  query: string;
  userId: string;
  limit?: number;
  threshold?: number;
}

serve(async (req) => {
  try {
    // Configuration de CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }
    
    // Vérification que la méthode est POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Récupération des credentials depuis les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !openaiKey) {
      throw new Error('Variables environnement manquantes');
    }
    
    // Initialisation du client Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Initialisation du client OpenAI
    const configuration = new Configuration({ apiKey: openaiKey });
    const openai = new OpenAIApi(configuration);
    
    // Parsing du corps de la requête
    const { query, userId, limit = 5, threshold = 0.7 } = await req.json() as RequestBody;
    
    if (!query || !userId) {
      return new Response(JSON.stringify({ error: 'Requête ou userId manquant' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Génération de l'embedding pour la requête
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: query.trim(),
    });
    
    const [{ embedding }] = embeddingResponse.data.data;
    
    // Recherche des documents similaires
    const { data: documents, error } = await supabase
      .rpc('match_documents', {
        query_embedding: embedding,
        similarity_threshold: threshold,
        match_count: limit,
        p_user_id: userId
      });
    
    if (error) {
      throw error;
    }
    
    return new Response(JSON.stringify(documents || []), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
