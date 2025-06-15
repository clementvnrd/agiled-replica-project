
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectTabs from '@/components/projects/ProjectTabs';
import type { Database } from '@/integrations/supabase/types';

type DbTask = Database['public']['Tables']['tasks']['Row'];

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

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { projects, updateProject, loading: projectsLoading, error: projectsError } = useProjects();
  const project = projects.find(p => p.id === id);

  const { tasks, updateTask, deleteTask, refetch: refetchTasks, loading: tasksLoading, error: tasksError } = useTasks(id);
  const { teamMembers, loading: teamLoading, error: teamError } = useTeamMembers(id);
  
  const loading = projectsLoading || tasksLoading || teamLoading;
  const error = projectsError || tasksError || teamError;
  
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  useEffect(() => {
    const handleTasksUpdate = () => {
      refetchTasks();
    };
    window.addEventListener('tasks-updated', handleTasksUpdate);
    return () => {
      window.removeEventListener('tasks-updated', handleTasksUpdate);
    };
  }, [refetchTasks]);

  const handleUpdateTask = async (taskId: string, updates: Partial<TodoTask>) => {
    const dbUpdates: Partial<DbTask> = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.assignee) dbUpdates.assignee = updates.assignee;
    if (updates.dueDate) dbUpdates.due_date = updates.dueDate.toISOString();
    if (updates.tags) dbUpdates.tags = updates.tags;

    try {
      await updateTask(taskId, dbUpdates);
      toast({ title: "Tâche mise à jour", description: "La tâche a été mise à jour avec succès." });
    } catch (err) {
      toast({ title: "Erreur", description: "La mise à jour de la tâche a échoué.", variant: "destructive" });
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast({ title: "Tâche supprimée", description: "La tâche a été supprimée avec succès." });
    } catch (err) {
      toast({ title: "Erreur", description: "La suppression de la tâche a échoué.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!loading && (error || !project)) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600">Erreur</h2>
        <p>{error || 'Le projet n\'a pas pu être trouvé ou chargé.'}</p>
        <Button onClick={() => navigate('/projects')}>Retour aux projets</Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">Recherche du projet...</p>
      </div>
    );
  }

  const todoTasksForBoard: TodoTask[] = useMemo(() => tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status as TodoTask['status'],
    priority: task.priority as TodoTask['priority'],
    assignee: task.assignee || undefined,
    dueDate: task.due_date ? new Date(task.due_date) : undefined,
    tags: task.tags || [],
    createdAt: task.created_at ? new Date(task.created_at) : new Date(),
  })), [tasks]);

  const teamForBoard = useMemo(() => teamMembers
    .filter(member => member && member.id)
    .map(member => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar || undefined,
      role: member.role,
  })), [teamMembers]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
      </div>

      <ProjectHeader 
        project={project}
        team={teamForBoard}
        updateProject={updateProject}
        isCreateTaskOpen={isCreateTaskOpen}
        setIsCreateTaskOpen={setIsCreateTaskOpen}
      />

      <ProjectTabs
        project={project}
        tasks={todoTasksForBoard}
        teamMembers={teamForBoard}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default ProjectDetail;
