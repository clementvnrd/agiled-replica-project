
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type CrmTodo = Tables<'crm_todos'>;

const fetchCrmTodos = async (userId: string | undefined): Promise<CrmTodo[]> => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('crm_todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching CRM todos:', error);
    throw new Error(error.message);
  }

  return data || [];
};

const createCrmTodo = async (todo: Omit<CrmTodo, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('crm_todos')
    .insert(todo)
    .select()
    .single();

  if (error) {
    console.error('Error creating CRM todo:', error);
    throw new Error(error.message);
  }

  return data;
};

const updateCrmTodo = async (id: string, updates: Partial<CrmTodo>) => {
  const { data, error } = await supabase
    .from('crm_todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating CRM todo:', error);
    throw new Error(error.message);
  }

  return data;
};

const deleteCrmTodo = async (id: string) => {
  const { error } = await supabase
    .from('crm_todos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting CRM todo:', error);
    throw new Error(error.message);
  }

  return true;
};

export const useCrmTodos = () => {
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['crm_todos', user?.id],
    queryFn: () => fetchCrmTodos(user?.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createCrmTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_todos'] });
      toast.success('Tâche créée avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la création de la tâche');
      console.error('Create todo error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CrmTodo> }) =>
      updateCrmTodo(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_todos'] });
      toast.success('Tâche mise à jour');
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour');
      console.error('Update todo error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCrmTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_todos'] });
      toast.success('Tâche supprimée');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression');
      console.error('Delete todo error:', error);
    },
  });

  return {
    todos: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createTodo: createMutation.mutate,
    updateTodo: updateMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
