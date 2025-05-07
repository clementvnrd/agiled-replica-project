
-- Activer RLS sur la table rag_documents
ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;

-- Politique permettant à un utilisateur de voir uniquement ses propres documents
CREATE POLICY "Users can view their own documents" ON rag_documents
    FOR SELECT
    USING (auth.uid() = user_id);

-- Politique pour l'insertion (seulement ses propres données)
CREATE POLICY "Users can insert their own documents" ON rag_documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique pour la mise à jour (seulement ses propres données)
CREATE POLICY "Users can update their own documents" ON rag_documents
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Politique pour la suppression (seulement ses propres données)
CREATE POLICY "Users can delete their own documents" ON rag_documents
    FOR DELETE
    USING (auth.uid() = user_id);

-- Politique pour les credentials utilisateur
ALTER TABLE user_supabase_credentials ENABLE ROW LEVEL SECURITY;

-- Protection des credentials (access uniquement à ses propres données)
CREATE POLICY "Users can access only their own credentials" ON user_supabase_credentials
    FOR ALL
    USING (clerk_user_id = auth.uid() OR auth.role() = 'service_role');
