
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function createEmbedding(openai: OpenAIApi, content: string): Promise<number[]> {
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: content.trim(),
  });

  if (embeddingResponse.data.data.length === 0) {
    throw new Error("Failed to generate embedding.");
  }

  return embeddingResponse.data.data[0].embedding;
}

async function insertDocument(supabase: SupabaseClient, doc: object) {
  const { data, error } = await supabase
    .from('rag_documents')
    .insert([doc])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }
  return data;
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const defaultOpenaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !serviceKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Server configuration error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    }
    
    // Use service_role key for admin-level access
    const supabase = createClient(supabaseUrl, serviceKey);

    // Request body
    const { userId, content, metadata } = await req.json();

    if (!userId || !content) {
      return new Response(JSON.stringify({ error: 'userId and content are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user's custom OpenAI key from their profile
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
        console.warn(`Could not fetch profile or OpenAI key for user ${userId}. Falling back to default key. Error: ${e.message}`);
    }
    
    // Determine which key to use
    const openaiKey = userApiKey || defaultOpenaiKey;

    if (!openaiKey) {
        console.error('OpenAI API key is not configured for user and no fallback is available.');
        return new Response(JSON.stringify({ error: 'OpenAI API key is not configured on the server, and you have not provided one in your settings.' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Initialize OpenAI client
    const configuration = new Configuration({ apiKey: openaiKey });
    const openai = new OpenAIApi(configuration);
    
    // Create embedding
    const embedding = await createEmbedding(openai, content);

    // Insert document into database
    const newDocument = { 
      user_id: userId, 
      content, 
      metadata: metadata || {},
      embedding 
    };
    const data = await insertDocument(supabase, newDocument);

    // Return the newly created document
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-rag-document function:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
