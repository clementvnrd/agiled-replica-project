
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  FolderOpen, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Star,
  Archive
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Refonte Site Web Entreprise',
      description: 'Modernisation complète du site web avec nouveau design et fonctionnalités',
      status: 'active',
      priority: 'high',
      progress: 65,
      startDate: new Date(2024, 4, 1),
      endDate: new Date(2024, 6, 15),
      team: [
        { id: '1', name: 'Alice Martin', role: 'Chef de projet' },
        { id: '2', name: 'Bob Durand', role: 'Développeur' },
        { id: '3', name: 'Claire Dubois', role: 'Designer' }
      ],
      category: 'Web Development',
      budget: 25000,
      client: 'TechCorp'
    },
    {
      id: '2',
      name: 'Application Mobile E-commerce',
      description: 'Développement d\'une application mobile pour la vente en ligne',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      startDate: new Date(2024, 5, 1),
      endDate: new Date(2024, 8, 30),
      team: [
        { id: '1', name: 'Alice Martin', role: 'Chef de projet' },
        { id: '4', name: 'David Chen', role: 'Développeur Mobile' }
      ],
      category: 'Mobile Development',
      budget: 40000,
      client: 'ShopPlus'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      projectId: '1',
      title: 'Créer les maquettes homepage',
      description: 'Concevoir les wireframes et maquettes de la page d\'accueil',
      status: 'completed',
      assignee: 'Claire Dubois',
      dueDate: new Date(2024, 5, 10),
      priority: 'high'
    },
    {
      id: '2',
      projectId: '1',
      title: 'Développer le système d\'authentification',
      description: 'Implémenter login/logout et gestion des utilisateurs',
      status: 'in-progress',
      assignee: 'Bob Durand',
      dueDate: new Date(2024, 5, 20),
      priority: 'high'
    }
  ]);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: '',
    client: '',
    startDate: '',
    endDate: '',
    priority: 'medium' as Project['priority']
  });

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

  const getPriorityColor = (priority: Project['priority']) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: Project['priority']) => {
    if (priority === 'high') return <AlertCircle className="h-4 w-4" />;
    if (priority === 'medium') return <Clock className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.startDate || !newProject.endDate) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: 'planning',
      priority: newProject.priority,
      progress: 0,
      startDate: new Date(newProject.startDate),
      endDate: new Date(newProject.endDate),
      team: [],
      category: newProject.category,
      client: newProject.client
    };

    setProjects([...projects, project]);
    setNewProject({
      name: '',
      description: '',
      category: '',
      client: '',
      startDate: '',
      endDate: '',
      priority: 'medium'
    });
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projets</h1>
          <p className="text-muted-foreground">Gérez vos projets et suivez leur avancement</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Ajouter Modèle
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Projet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nouveau Projet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nom du projet"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
                <Textarea
                  placeholder="Description du projet"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Catégorie"
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                  />
                  <Input
                    placeholder="Client"
                    value={newProject.client}
                    onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date de début</label>
                    <Input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Date de fin</label>
                    <Input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newProject.priority}
                  onChange={(e) => setNewProject({...newProject, priority: e.target.value as Project['priority']})}
                >
                  <option value="low">Priorité Basse</option>
                  <option value="medium">Priorité Moyenne</option>
                  <option value="high">Priorité Haute</option>
                </select>
                <Button onClick={handleCreateProject} className="w-full">
                  Créer le projet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Vue Grille</TabsTrigger>
          <TabsTrigger value="list">Vue Liste</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucun projet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Commencez par créer votre premier projet pour organiser votre travail
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un projet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{project.name}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className={`text-white ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </Badge>
                          <div className={`flex items-center gap-1 ${getPriorityColor(project.priority)}`}>
                            {getPriorityIcon(project.priority)}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(project.endDate, 'dd/MM/yyyy', { locale: fr })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.team.length}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map(member => (
                          <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>
                      {project.client && (
                        <div className="text-sm font-medium">{project.client}</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Voir détails
                      </Button>
                      <Button size="sm" className="flex-1">
                        Ouvrir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="border-b p-4 bg-muted/50">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium">
                  <div className="col-span-3">Projet</div>
                  <div className="col-span-2">Catégorie</div>
                  <div className="col-span-2">Statut</div>
                  <div className="col-span-2">Équipe</div>
                  <div className="col-span-2">Échéance</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>
              {projects.map(project => (
                <div key={project.id} className="border-b last:border-b-0 p-4 hover:bg-muted/50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {project.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={project.progress} className="h-1 flex-1" />
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                    <div className="col-span-2">
                      <Badge variant="secondary" className={`text-white ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <div className="flex -space-x-1">
                        {project.team.slice(0, 2).map(member => (
                          <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 2 && (
                          <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                            +{project.team.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm">
                      {format(project.endDate, 'dd/MM/yyyy', { locale: fr })}
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['planning', 'active', 'on-hold', 'completed'].map(status => (
              <Card key={status} className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="secondary" className={`text-white ${getStatusColor(status as Project['status'])}`}>
                      {getStatusLabel(status as Project['status'])}
                    </Badge>
                    <span className="text-sm font-normal">
                      ({projects.filter(p => p.status === status).length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects
                    .filter(project => project.status === status)
                    .map(project => (
                      <Card key={project.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm line-clamp-2">{project.name}</h4>
                            <div className={`${getPriorityColor(project.priority)}`}>
                              {getPriorityIcon(project.priority)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(project.endDate, 'dd/MM', { locale: fr })}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex -space-x-1">
                              {project.team.slice(0, 2).map(member => (
                                <Avatar key={member.id} className="h-5 w-5 border border-background">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {project.progress}%
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  }
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsPage;
