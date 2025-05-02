
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

// Récupération des variables d'environnement
const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://mjohodtfezjfavsxaqxv.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Création du client Supabase
const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Headers CORS pour permettre les requêtes depuis le frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface pour la requête à l'agent
interface AgentRequest {
  message: string; 
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérifier que la clé OpenRouter est configurée
    if (!openRouterKey) {
      return new Response(
        JSON.stringify({ error: "La clé API OpenRouter n'est pas configurée" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que le client Supabase est configuré
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Les informations de connexion Supabase ne sont pas configurées" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer les données de la requête
    const { message, userId } = await req.json() as AgentRequest;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Le message est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Préparation du contexte RAG (à implémenter complètement)
    let ragContext = "";
    
    // Si un userId est fourni, on peut chercher des documents pertinents dans la table rag_documents
    if (userId) {
      try {
        const ragResult = await supabase.rpc('match_rag_documents', {
          query_embedding: [], // Ici, il faudrait utiliser un embedding du message
          match_threshold: 0.7,
          match_count: 5,
          p_user_id: userId
        });
        
        if (!ragResult.error && ragResult.data && ragResult.data.length > 0) {
          ragContext = "Contexte depuis la base de connaissances:\n";
          for (const doc of ragResult.data) {
            ragContext += `${doc.content}\n\n`;
          }
        }
      } catch (error) {
        console.error("Erreur lors de la recherche RAG:", error);
      }
    }

    // Appel à OpenRouter
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openRouterKey}`,
        "HTTP-Referer": "https://all-in-one-dashboard.lovable.dev",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Un modèle abordable et puissant d'OpenRouter
        messages: [
          {
            role: "system",
            content: `Tu es un assistant IA spécialisé dans la gestion d'entreprise et la vie personnelle.
                     Tu aides l'utilisateur à naviguer dans ses données business (CRM, finances, projets) et personnelles (études, fitness).
                     Tu peux accéder à leurs informations via un système RAG et connecter à leurs outils via MCP.
                     ${ragContext ? "Voici du contexte supplémentaire qui pourrait t'aider à répondre: " + ragContext : ""}
                     Réponds de façon précise, professionnelle et personnalisée.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
      }),
    });

    // Vérifier et traiter la réponse d'OpenRouter
    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      console.error("Erreur OpenRouter:", errorData);
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'appel à OpenRouter", details: errorData }),
        { status: openRouterResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Traiter la réponse d'OpenRouter
    const data = await openRouterResponse.json();
    const assistantResponse = data.choices[0].message.content;

    // Retourner la réponse
    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Erreur générale:", error);
    return new Response(
      JSON.stringify({ error: "Une erreur s'est produite", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
