
-- Activer l'extension pgvector si pas déjà active
CREATE EXTENSION IF NOT EXISTS vector;

-- Ajouter la fonction pour rechercher les documents par similarité
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  p_user_id uuid
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  content text,
  metadata jsonb,
  embedding vector,
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rd.id,
    rd.user_id,
    rd.content,
    rd.metadata,
    rd.embedding,
    rd.created_at,
    1 - (rd.embedding <=> query_embedding) AS similarity
  FROM 
    rag_documents rd
  WHERE 
    rd.user_id = p_user_id
    AND 1 - (rd.embedding <=> query_embedding) > similarity_threshold
  ORDER BY 
    rd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
