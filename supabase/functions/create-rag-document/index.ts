
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openaiKey) {
      console.error('Missing environment variables');
      throw new Error('Server configuration error.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const configuration = new Configuration({ apiKey: openaiKey });
    const openai = new OpenAIApi(configuration);

    const { userId, content, metadata } = await req.json();

    if (!userId || !content) {
      return new Response(JSON.stringify({ error: 'userId and content are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const embedding = await createEmbedding(openai, content);

    const newDocument = { 
      user_id: userId, 
      content, 
      metadata: metadata || {},
      embedding 
    };

    const data = await insertDocument(supabase, newDocument);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-rag-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

