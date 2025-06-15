
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';

type TeamMember = Database['public']['Tables']['team_members']['Row'];
type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];

export const useTeamMembers = (projectId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
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

  const fetchTeamMembers = async () => {
    if (!user || !projectId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMemberInsert, 'user_id' | 'project_id'>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{ 
          ...memberData, 
          user_id: user.id, 
          project_id: projectId 
        }])
        .select()
        .single();

      if (error) throw error;
      setTeamMembers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de l\'ajout du membre');
    }
  };

  const removeTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la suppression du membre');
    }
  };

  useEffect(() => {
    if (user && projectId) {
      fetchTeamMembers();
    }
  }, [user, projectId]);

  return {
    teamMembers,
    loading,
    error,
    addTeamMember,
    removeTeamMember,
    refetch: fetchTeamMembers
  };
};
