
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Calendar as CalendarIcon, 
  Users, 
  Target,
  MoreHorizontal,
  Settings,
  CheckSquare,
  FileText,
  BarChart3,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateTaskDialog from '@/components/projects/CreateTaskDialog';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

// Lazy loaded components
const TodoBoard = lazy(() => import('@/components/projects/TodoBoard'));
const NotesEditor = lazy(() => import('@/components/projects/NotesEditor'));
const ProjectCalendar = lazy(() => import('@/components/projects/ProjectCalendar'));


type DbProject = Database['public']['Tables']['projects']['Row'];
type DbTask = Database['public']['Tables']['tasks']['Row'];
type DbTeamMember = Database['public']['Tables']['team_members']['Row'];

// Ces interfaces sont conservées pour la compatibilité avec les composants enfants non modifiables.
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  startDate: Date;
  endDate: Date;
  team: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
  category: string;
  budget?: number;
  client?: string;
}

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

const TabContentLoader = () => (
  <Card>
    <CardContent className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </CardContent>
  </Card>
);

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  const [project, setProject] = useState<DbProject | null>(null);
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [team, setTeam] = useState<DbTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id || !user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const projectPromise = supabase.from('projects').select('*').eq('id', id).single();
        const tasksPromise = supabase.from('tasks').select('*').eq('project_id', id).order('created_at');
        const teamPromise = supabase.from('team_members').select('*').eq('project_id', id);

        const [
          { data: projectData, error: projectError }, 
          { data: tasksData, error: tasksError }, 
          { data: teamData, error: teamError }
        ] = await Promise.all([projectPromise, tasksPromise, teamPromise]);

        if (projectError) throw new Error(`Projet: ${projectError.message}`);
        if (tasksError) throw new Error(`Tâches: ${tasksError.message}`);
        if (teamError) throw new Error(`Équipe: ${teamError.message}`);

        if (!projectData) {
          throw new Error("Projet non trouvé.");
        }

        setProject(projectData);
        setTasks(tasksData || []);
        setTeam(teamData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectDetails();
  }, [id, user]);

  const handleUpdateTask = async (taskId: string, updates: Partial<TodoTask>) => {
    const dbUpdates: Partial<DbTask> = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.assignee) dbUpdates.assignee = updates.assignee;
    if (updates.dueDate) dbUpdates.due_date = updates.dueDate.toISOString();
    if (updates.tags) dbUpdates.tags = updates.tags;

    const { data: updatedTask, error } = await supabase.from('tasks').update(dbUpdates).eq('id', taskId).select().single();
    
    if (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    } else if (updatedTask) {
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
    } else {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleEditField = (field: string, currentValue: string | null) => {
    setEditingField(field);
    setTempValue(currentValue || '');
  };

  const handleSaveField = async (field: string) => {
    if (!project) return;
    
    let updates: Partial<DbProject> = {};
    if (field === 'name') {
      updates = { name: tempValue };
    } else if (field === 'description') {
      updates = { description: tempValue };
    }
    
    setEditingField(null);
    const { data, error } = await supabase.from('projects').update(updates).eq('id', project.id).select().single();
    if (data) setProject(data);
    if (error) console.error("Erreur de mise à jour:", error);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      'on-hold': 'bg-yellow-500',
      planning: 'bg-purple-500'
    };
    return colors[status];
  };

  const getStatusLabel = (status: Project['status']) => {
    const labels = {
      active: 'Actif',
      completed: 'Terminé',
      'on-hold': 'En pause',
      planning: 'Planification'
    };
    return labels[status];
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-600">Erreur</h2>
        <p>{error || 'Le projet n\'a pas pu être chargé.'}</p>
        <Button onClick={() => navigate('/projects')}>Retour aux projets</Button>
      </div>
    );
  }

  // Mappage pour les composants enfants qui attendent les anciens types
  const todoTasksForBoard: TodoTask[] = tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status as TodoTask['status'],
    priority: task.priority as TodoTask['priority'],
    assignee: task.assignee || undefined,
    dueDate: task.due_date ? new Date(task.due_date) : undefined,
    tags: task.tags || [],
    createdAt: task.created_at ? new Date(task.created_at) : new Date(),
  }));

  const teamForBoard = team
    .filter(member => member && member.id)
    .map(member => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar || undefined,
      role: member.role,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header avec navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
      </div>

      {/* En-tête du projet */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-4">
              {/* Titre du projet */}
              <div className="flex items-center gap-3">
                {editingField === 'name' ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-2xl font-bold h-auto"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleSaveField('name')}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-2xl">{project.name}</CardTitle>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEditField('name', project.name)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Badges et métadonnées */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary" className={`text-white ${getStatusColor(project.status as any)}`}>
                  {getStatusLabel(project.status as any)}
                </Badge>
                <Badge variant="outline">{project.category}</Badge>
                {project.start_date && project.end_date && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(project.start_date), 'dd/MM/yyyy', { locale: fr })} - {format(new Date(project.end_date), 'dd/MM/yyyy', { locale: fr })}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {team.length} membres
                </div>
                {project.budget && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    {project.budget.toLocaleString('fr-FR')} €
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CreateTaskDialog
                open={isCreateTaskOpen}
                onOpenChange={setIsCreateTaskOpen}
                projectId={project.id}
                trigger={
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle tâche
                  </Button>
                }
              />
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              Description du projet
              {editingField !== 'description' && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleEditField('description', project.description)}
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              )}
            </h3>
            {editingField === 'description' ? (
              <div className="space-y-2">
                <Textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  rows={4}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveField('description')}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>

          {/* Progression */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Progression</h3>
              <span className="text-sm text-muted-foreground">{project.progress || 0}%</span>
            </div>
            <Progress value={project.progress || 0} className="h-3" />
          </div>

          {/* Équipe */}
          <div>
            <h3 className="font-medium mb-3">Équipe projet</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {teamForBoard.map(member => (
                <div key={member.id} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter membre
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets pour les différentes sections */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Tâches
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Suspense fallback={<TabContentLoader />}>
            <TodoBoard 
              tasks={todoTasksForBoard} 
              teamMembers={teamForBoard}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="notes">
          <Suspense fallback={<TabContentLoader />}>
            <NotesEditor projectId={project.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="calendar">
          <Suspense fallback={<TabContentLoader />}>
            <ProjectCalendar projectId={project.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytiques du projet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Les analytiques détaillées du projet seront bientôt disponibles</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
