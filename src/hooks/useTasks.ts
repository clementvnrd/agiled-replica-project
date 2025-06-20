
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';
import { ErrorHandler } from '@/utils/errorHandler';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export const useTasks = (projectId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
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

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      ErrorHandler.handleError(err, 'Une erreur est survenue lors de la récupération des tâches.');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<TaskInsert, 'user_id'>) => {
    if (!user) {
        const error = new Error('Vous devez être connecté pour créer une tâche.');
        ErrorHandler.handleError(error);
        throw error;
    }

    const tempId = `temp-${Date.now()}`;
    // Correction de l'objet newTask pour correspondre au type Task
    const newTask: Task = {
      id: tempId,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: taskData.title,
      description: taskData.description ?? null,
      status: taskData.status ?? 'todo',
      project_id: taskData.project_id ?? null,
      due_date: taskData.due_date ?? null,
      assignee: taskData.assignee ?? null,
      priority: taskData.priority ?? 'medium',
      tags: taskData.tags ?? null,
    };

    setTasks(prev => [newTask, ...prev]);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(t => (t.id === tempId ? data : t)));
      return data;
    } catch (err) {
      ErrorHandler.handleError(err, 'Erreur lors de la création de la tâche.');
      setTasks(prev => prev.filter(t => t.id !== tempId));
      throw err;
    }
  };

  const updateTask = async (id: string, updates: TaskUpdate) => {
    const originalTasks = [...tasks];
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;
    
    const updatedTask = { ...taskToUpdate, ...updates };
    
    setTasks(prev => prev.map(t => (t.id === id ? updatedTask as Task : t)));

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      // L'état est déjà à jour, on met à jour la tâche avec les données finales du serveur
      setTasks(prev => prev.map(t => (t.id === id ? data : t)));
      return data;
    } catch (err) {
      ErrorHandler.handleError(err, 'Erreur lors de la mise à jour de la tâche.');
      setTasks(originalTasks);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // L'état est déjà à jour, pas besoin de le modifier en cas de succès
    } catch (err) {
      ErrorHandler.handleError(err, 'Erreur lors de la suppression de la tâche.');
      setTasks(originalTasks);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, projectId]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};
