
-- Add a column to store user-specific OpenAI API keys for RAG embeddings.
ALTER TABLE public.profiles ADD COLUMN openai_api_key TEXT;
