import React, { useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import TodoBoard from './TodoBoard';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

// This interface is compatible with the one in TodoBoard.tsx
interface TodoTask {
  id: string;
  title: string;
  description: string;
  status: 'idea' | 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
}

type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

interface ProjectTasksBoardProps {
  projectId?: string;
}

const ProjectTasksBoard: React.FC<ProjectTasksBoardProps> = ({ projectId }) => {
  const { tasks, loading: tasksLoading, error: tasksError, updateTask, deleteTask, refetch } = useTasks(projectId);
  const { teamMembers, loading: membersLoading, error: membersError } = useTeamMembers(projectId);
  const { toast } = useToast();

  useEffect(() => {
    const handleTasksUpdate = () => {
      refetch();
    };

    window.addEventListener('tasks-updated', handleTasksUpdate);

    return () => {
      window.removeEventListener('tasks-updated', handleTasksUpdate);
    };
  }, [refetch]);

  const handleUpdateTask = async (taskId: string, updates: Partial<TodoTask>) => {
    try {
      const dbUpdates: TaskUpdate = { ...updates };

      if (updates.dueDate) {
        dbUpdates.due_date = updates.dueDate.toISOString().split('T')[0];
        delete (dbUpdates as Partial<TodoTask>).dueDate;
      }
      
      await updateTask(taskId, dbUpdates);

      toast({ title: 'Tâche mise à jour', description: 'Le statut de la tâche a été mis à jour.' });
    } catch (error) {
      // L'erreur est déjà gérée par le hook useTasks (log + toast).
      // Ce bloc try/catch empêche l'affichage du toast de succès en cas d'échec.
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast({ title: 'Tâche supprimée', description: 'La tâche a été supprimée avec succès.' });
    } catch (error) {
      // L'erreur est déjà gérée par le hook useTasks.
    }
  };

  if (tasksLoading || membersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des tâches et des membres...</p>
      </div>
    );
  }

  if (tasksError || membersError) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Erreur: {tasksError || membersError}</p>
      </div>
    );
  }

  const formattedTasks: TodoTask[] = tasks.map(task => ({
    ...task,
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status as 'idea' | 'todo' | 'in-progress' | 'done',
    priority: task.priority as 'low' | 'medium' | 'high',
    assignee: task.assignee || undefined,
    dueDate: task.due_date ? new Date(task.due_date) : undefined,
    createdAt: new Date(task.created_at!),
    tags: task.tags || [],
  }));

  return (
    <TodoBoard
      tasks={formattedTasks}
      teamMembers={teamMembers}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      projectId={projectId}
    />
  );
};

export default ProjectTasksBoard;
