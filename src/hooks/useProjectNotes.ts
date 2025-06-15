
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type ProjectNote = Database['public']['Tables']['project_notes']['Row'];
type ProjectNoteInsert = Database['public']['Tables']['project_notes']['Insert'];
type ProjectNoteUpdate = Database['public']['Tables']['project_notes']['Update'];

export const useProjectNotes = (projectId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchNotes = async () => {
    if (!user || !projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: Omit<ProjectNoteInsert, 'user_id' | 'project_id'>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('project_notes')
        .insert([{ 
          ...noteData, 
          user_id: user.id, 
          project_id: projectId 
        }])
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la création de la note');
    }
  };

  const updateNote = async (id: string, updates: ProjectNoteUpdate) => {
    try {
      const { data, error } = await supabase
        .from('project_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNotes(prev => prev.map(n => n.id === id ? data : n));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la mise à jour de la note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la suppression de la note');
    }
  };

  useEffect(() => {
    if (user && projectId) {
      fetchNotes();
    }
  }, [user, projectId]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes
  };
};
