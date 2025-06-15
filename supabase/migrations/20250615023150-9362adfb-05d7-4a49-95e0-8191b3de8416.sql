
CREATE OR REPLACE FUNCTION public.match_documents (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  p_user_id uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  created_at timestamptz,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    rd.id,
    rd.content,
    rd.metadata,
    rd.created_at,
    1 - (rd.embedding <=> query_embedding) AS similarity
  FROM
    public.rag_documents AS rd
  WHERE
    rd.user_id = p_user_id AND 1 - (rd.embedding <=> query_embedding) > similarity_threshold
  ORDER BY
    similarity DESC
  LIMIT match_count;
$$;
