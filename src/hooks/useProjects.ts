
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';
import { handleError } from '@/utils/errorHandler';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export const useProjects = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      handleError(err, 'Erreur lors de la récupération des projets.');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createProject = async (projectData: Omit<ProjectInsert, 'user_id'>) => {
    if (!user) {
      const error = new Error('Utilisateur non connecté pour créer un projet.');
      handleError(error);
      throw error;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      return data;
    } catch (err) {
      handleError(err, 'Erreur lors de la création du projet.');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    if (!user) {
      const error = new Error('Utilisateur non connecté pour mettre à jour un projet.');
      handleError(error);
      throw error;
    }
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      handleError(err, 'Erreur lors de la mise à jour du projet.');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) {
      const error = new Error('Utilisateur non connecté pour supprimer un projet.');
      handleError(error);
      throw error;
    }
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      handleError(err, 'Erreur lors de la suppression du projet.');
      throw err;
    }
  };

  useEffect(() => {
    if(user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
};
