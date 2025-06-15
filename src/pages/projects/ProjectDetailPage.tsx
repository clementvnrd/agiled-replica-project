
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  Calendar,
  Target,
  Settings,
  CheckSquare,
  FileText,
  CalendarDays
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useTasks } from '@/hooks/useTasks';
import TodoBoard from '@/components/projects/TodoBoard';
import NotesEditor from '@/components/projects/NotesEditor';
import { Skeleton } from '@/components/ui/skeleton';
import type { Database } from '@/integrations/supabase/types';

// Interfaces for TodoBoard data structure
type TodoTaskStatus = 'idea' | 'todo' | 'in-progress' | 'done';
type TodoTaskPriority = 'low' | 'medium' | 'high';
interface TodoTask {
  id: string;
  title: string;
  description: string;
  status: TodoTaskStatus;
  priority: TodoTaskPriority;
  assignee?: string;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
}

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { teamMembers } = useTeamMembers(projectId || '');
  const { 
    tasks: dbTasks, 
    loading: tasksLoading, 
    error: tasksError, 
    createTask, 
    updateTask, 
    deleteTask 
  } = useTasks(projectId);

  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    console.log('ProjectDetailPage projectId from useParams:', projectId);
  }, [projectId]);

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Projet non trouvé</h2>
          <Button onClick={() => navigate('/projects')}>
            Retour aux projets
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      'on-hold': 'bg-yellow-500',
      planning: 'bg-purple-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Actif',
      completed: 'Terminé',
      'on-hold': 'En pause',
      planning: 'Planification'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Convertir les données pour le TodoBoard
  const convertedTasks: TodoTask[] = dbTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status as TodoTaskStatus,
    priority: task.priority as TodoTaskPriority,
    assignee: task.assignee || undefined,
    dueDate: task.due_date ? new Date(task.due_date) : undefined,
    tags: task.tags || [],
    createdAt: new Date(task.created_at || new Date()),
  }));

  const convertedTeamMembers = teamMembers
    .filter(member => member && member.id)
    .map(member => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar || undefined,
      role: member.role
  }));

  const handleCreateTask = async (taskData: Omit<TodoTask, 'id' | 'createdAt'>) => {
    if (!projectId) return;
    try {
      await createTask({
        project_id: projectId,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        assignee: taskData.assignee,
        due_date: taskData.dueDate ? taskData.dueDate.toISOString().split('T')[0] : null,
        tags: taskData.tags,
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      // TODO: Add user-facing error notification
    }
  };
  
  const handleUpdateTask = async (taskId: string, updates: Partial<TodoTask>) => {
    try {
      const dbUpdates: Partial<Database['public']['Tables']['tasks']['Update']> = {};
      
      if (updates.hasOwnProperty('title')) dbUpdates.title = updates.title;
      if (updates.hasOwnProperty('description')) dbUpdates.description = updates.description;
      if (updates.hasOwnProperty('status')) dbUpdates.status = updates.status;
      if (updates.hasOwnProperty('priority')) dbUpdates.priority = updates.priority;
      if (updates.hasOwnProperty('assignee')) dbUpdates.assignee = updates.assignee;
      if (updates.hasOwnProperty('dueDate')) dbUpdates.due_date = updates.dueDate ? updates.dueDate.toISOString().split('T')[0] : null;
      if (updates.hasOwnProperty('tags')) dbUpdates.tags = updates.tags;

      if (Object.keys(dbUpdates).length > 0) {
        await updateTask(taskId, dbUpdates);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      // TODO: Add user-facing error notification
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
      // TODO: Add user-facing error notification
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="ghost">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Informations du projet */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Statut</p>
              <Badge className={`text-white ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Priorité</p>
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority === 'high' ? 'Haute' : project.priority === 'medium' ? 'Moyenne' : 'Basse'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Progression</p>
              <div className="space-y-2">
                <Progress value={project.progress || 0} className="h-2" />
                <span className="text-sm font-medium">{project.progress || 0}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Budget</p>
              <span className="font-medium">
                {project.budget ? `${Number(project.budget).toLocaleString('fr-FR')} €` : 'Non défini'}
              </span>
            </div>
          </div>

          {(project.start_date || project.end_date) && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-6">
                {project.start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Début: {format(new Date(project.start_date), 'dd/MM/yyyy', { locale: fr })}
                    </span>
                  </div>
                )}
                {project.end_date && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Fin: {format(new Date(project.end_date), 'dd/MM/yyyy', { locale: fr })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onglets du projet */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Tâches
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Équipe
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{project.description || 'Aucune description'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Catégorie</p>
                  <p className="text-sm">{project.category || 'Non définie'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="text-sm">{project.client || 'Non défini'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Équipe ({teamMembers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.slice(0, 5).map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  {teamMembers.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      Et {teamMembers.length - 5} autre{teamMembers.length - 5 > 1 ? 's' : ''}...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          {tasksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : tasksError ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                <p>Erreur lors du chargement des tâches : {tasksError}</p>
              </CardContent>
            </Card>
          ) : (
            <TodoBoard
              tasks={convertedTasks}
              teamMembers={convertedTeamMembers}
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </TabsContent>

        <TabsContent value="notes">
          <NotesEditor projectId={project.id} />
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Gestion de l'équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Gestion de l'équipe en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Calendrier en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailPage;
