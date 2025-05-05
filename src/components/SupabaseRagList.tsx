
import React, { useEffect, useState } from 'react';
import { useDynamicSupabase } from '@/providers/DynamicSupabaseProvider';
import { RagDocument } from '@/types';

/**
 * Affiche la liste des documents RAG de l'utilisateur connecté avec un bouton de rafraîchissement.
 */
const SupabaseRagList: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [docs, setDocs] = useState<RagDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { supabase, loading: supabaseLoading, error: supabaseError } = useDynamicSupabase();

  // Récupère l'UUID de l'utilisateur connecté
  useEffect(() => {
    if (supabaseLoading || supabaseError) return;
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setError(error.message);
        setUserId(null);
      } else {
        setUserId(data?.user?.id ?? null);
      }
    });
  }, [supabase, supabaseLoading, supabaseError]);

  const fetchDocs = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      // Utilise le client dynamique pour la requête
      const { data, error } = await supabase
        .from('rag_documents')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      
      // Convertir explicitement le type et assurer que chaque document a un ID
      const processedData = (data || []).map(doc => ({
        ...doc,
        id: doc.id || crypto.randomUUID() // Utiliser l'ID existant ou en générer un
      })) as RagDocument[];
      
      setDocs(processedData);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Gestion du chargement/erreur du contexte dynamique
  if (supabaseLoading) return <div>Chargement Supabase...</div>;
  if (supabaseError) return <div>Erreur Supabase : {supabaseError}</div>;

  if (!userId) {
    return <div className="mt-8 text-agiled-lightText">Utilisateur non connecté ou UUID non disponible.</div>;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Documents RAG enregistrés</h3>
        <button onClick={fetchDocs} className="btn-outline text-sm">Rafraîchir</button>
      </div>
      {loading && <div className="text-agiled-lightText">Chargement...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <ul className="divide-y divide-agiled-lightBorder bg-gray-50 rounded">
        {docs.length === 0 && !loading && (
          <li className="p-4 text-agiled-lightText">Aucun document trouvé.</li>
        )}
        {docs.map(doc => (
          <li key={doc.id} className="p-4">
            <div className="font-medium">{doc.metadata?.title || 'Sans titre'}</div>
            <div className="text-sm text-agiled-lightText truncate">{doc.content}</div>
            <div className="text-xs text-gray-400 mt-1">{doc.created_at ? new Date(doc.created_at).toLocaleString() : ''}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupabaseRagList;
