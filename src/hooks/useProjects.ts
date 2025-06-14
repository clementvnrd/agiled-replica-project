
import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export const useProjects = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getSupabaseWithAuth = useCallback(async () => {
    const token = await getToken({ template: 'supabase' });
    if (token) {
      supabase.global.headers['Authorization'] = `Bearer ${token}`;
    }
    return supabase;
  }, [getToken]);

  const fetchProjects = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const authedSupabase = await getSupabaseWithAuth();
      const { data, error } = await authedSupabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [user, getSupabaseWithAuth]);

  const createProject = async (projectData: Omit<ProjectInsert, 'user_id'>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const authedSupabase = await getSupabaseWithAuth();
      const { data, error } = await authedSupabase
        .from('projects')
        .insert([{ ...projectData, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error("Supabase error creating project:", error);
        throw error;
      }
      setProjects(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Error creating project:", err);
      throw err instanceof Error ? err : new Error('Erreur lors de la création du projet');
    }
  };

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    if (!user) throw new Error('Utilisateur non connecté');
    try {
      const authedSupabase = await getSupabaseWithAuth();
      const { data, error } = await authedSupabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la mise à jour du projet');
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) throw new Error('Utilisateur non connecté');
    try {
      const authedSupabase = await getSupabaseWithAuth();
      const { error } = await authedSupabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la suppression du projet');
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
