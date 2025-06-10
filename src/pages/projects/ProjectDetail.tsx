
import React, { useState, useRef } from 'react';
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
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import TodoBoard from '@/components/projects/TodoBoard';
import NotesEditor from '@/components/projects/NotesEditor';
import ProjectCalendar from '@/components/projects/ProjectCalendar';

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

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  // Données des projets avec des données différentes selon l'ID
  const getProjectData = (projectId: string): Project => {
    const projects: Record<string, Project> = {
      '1': {
        id: '1',
        name: 'Build the all-in-one management platform',
        description: 'Développement d\'une plateforme de gestion complète intégrant CRM, gestion de projets, finances, RH et outils de productivité. L\'objectif est de créer une solution unifiée qui permet aux entreprises de centraliser tous leurs processus métier.',
        status: 'active',
        priority: 'high',
        progress: 35,
        startDate: new Date(2024, 4, 1),
        endDate: new Date(2024, 11, 31),
        team: [
          { id: '1', name: 'Alice Martin', role: 'Chef de projet' },
          { id: '2', name: 'Bob Durand', role: 'Développeur Full-Stack' },
          { id: '3', name: 'Claire Dubois', role: 'UI/UX Designer' },
          { id: '4', name: 'David Chen', role: 'Architecte Système' }
        ],
        category: 'Platform Development',
        budget: 150000,
        client: 'Internal'
      },
      '2': {
        id: '2',
        name: 'Marketing Campaign Q4',
        description: 'Campagne marketing pour le lancement du nouveau produit au quatrième trimestre. Cette campagne vise à accroître la notoriété de la marque et à générer des leads qualifiés.',
        status: 'planning',
        priority: 'medium',
        progress: 15,
        startDate: new Date(2024, 9, 1),
        endDate: new Date(2024, 11, 15),
        team: [
          { id: '3', name: 'Claire Dubois', role: 'Marketing Manager' },
          { id: '4', name: 'David Chen', role: 'Content Creator' },
          { id: '5', name: 'Emma Wilson', role: 'Social Media Manager' }
        ],
        category: 'Marketing',
        budget: 80000,
        client: 'External'
      },
      '3': {
        id: '3',
        name: 'Mobile App Redesign',
        description: 'Refonte complète de l\'application mobile avec une nouvelle interface utilisateur et de nouvelles fonctionnalités pour améliorer l\'expérience utilisateur.',
        status: 'active',
        priority: 'high',
        progress: 60,
        startDate: new Date(2024, 2, 15),
        endDate: new Date(2024, 7, 30),
        team: [
          { id: '5', name: 'Emma Wilson', role: 'UI/UX Designer' },
          { id: '6', name: 'Frank Taylor', role: 'Mobile Developer' },
          { id: '7', name: 'Grace Kim', role: 'QA Engineer' }
        ],
        category: 'Mobile Development',
        budget: 120000,
        client: 'Internal'
      }
    };

    return projects[projectId] || projects['1'];
  };

  const [project, setProject] = useState<Project>(getProjectData(id || '1'));

  // Tâches TODO spécifiques au projet
  const getProjectTasks = (projectId: string): TodoTask[] => {
    const tasksByProject: Record<string, TodoTask[]> = {
      '1': [
        {
          id: '1',
          title: 'Analyser les besoins fonctionnels',
          description: 'Définir précisément tous les modules nécessaires et leurs interactions',
          status: 'done',
          priority: 'high',
          assignee: 'Alice Martin',
          dueDate: new Date(2024, 5, 15),
          tags: ['analyse', 'specs'],
          createdAt: new Date(2024, 4, 5)
        },
        {
          id: '2',
          title: 'Concevoir l\'architecture système',
          description: 'Définir l\'architecture technique, base de données et APIs',
          status: 'done',
          priority: 'high',
          assignee: 'David Chen',
          dueDate: new Date(2024, 5, 20),
          tags: ['architecture', 'technique'],
          createdAt: new Date(2024, 4, 8)
        },
        {
          id: '3',
          title: 'Créer les maquettes UI/UX',
          description: 'Designer l\'interface utilisateur complète de la plateforme',
          status: 'in-progress',
          priority: 'high',
          assignee: 'Claire Dubois',
          dueDate: new Date(2024, 6, 10),
          tags: ['design', 'ui/ux'],
          createdAt: new Date(2024, 5, 1)
        },
        {
          id: '4',
          title: 'Développer le module CRM',
          description: 'Implémenter la gestion des contacts, leads et opportunités',
          status: 'todo',
          priority: 'high',
          assignee: 'Bob Durand',
          dueDate: new Date(2024, 7, 15),
          tags: ['développement', 'crm'],
          createdAt: new Date(2024, 5, 10)
        }
      ],
      '2': [
        {
          id: '5',
          title: 'Définir la stratégie marketing',
          description: 'Élaborer la stratégie globale pour la campagne Q4',
          status: 'done',
          priority: 'high',
          assignee: 'Claire Dubois',
          dueDate: new Date(2024, 9, 5),
          tags: ['stratégie', 'marketing'],
          createdAt: new Date(2024, 8, 1)
        },
        {
          id: '6',
          title: 'Créer le contenu publicitaire',
          description: 'Développer les visuels et textes pour toutes les plateformes',
          status: 'in-progress',
          priority: 'medium',
          assignee: 'David Chen',
          dueDate: new Date(2024, 9, 20),
          tags: ['contenu', 'créatif'],
          createdAt: new Date(2024, 8, 15)
        },
        {
          id: '7',
          title: 'Lancer les campagnes social media',
          description: 'Programmer et lancer les publications sur tous les réseaux',
          status: 'todo',
          priority: 'medium',
          assignee: 'Emma Wilson',
          dueDate: new Date(2024, 10, 1),
          tags: ['social media', 'lancement'],
          createdAt: new Date(2024, 9, 1)
        }
      ],
      '3': [
        {
          id: '8',
          title: 'Audit UX de l\'app actuelle',
          description: 'Analyser les points de friction dans l\'interface actuelle',
          status: 'done',
          priority: 'high',
          assignee: 'Emma Wilson',
          dueDate: new Date(2024, 3, 1),
          tags: ['audit', 'ux'],
          createdAt: new Date(2024, 2, 15)
        },
        {
          id: '9',
          title: 'Prototyper la nouvelle interface',
          description: 'Créer des prototypes interactifs pour les nouvelles fonctionnalités',
          status: 'in-progress',
          priority: 'high',
          assignee: 'Emma Wilson',
          dueDate: new Date(2024, 6, 15),
          tags: ['prototype', 'design'],
          createdAt: new Date(2024, 4, 1)
        },
        {
          id: '10',
          title: 'Développer les nouveaux écrans',
          description: 'Implémenter la nouvelle interface mobile',
          status: 'todo',
          priority: 'high',
          assignee: 'Frank Taylor',
          dueDate: new Date(2024, 7, 1),
          tags: ['développement', 'mobile'],
          createdAt: new Date(2024, 5, 1)
        }
      ]
    };

    return tasksByProject[projectId] || [];
  };

  const [todoTasks, setTodoTasks] = useState<TodoTask[]>(getProjectTasks(id || '1'));

  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSaveField = (field: string) => {
    if (field === 'name') {
      setProject({ ...project, name: tempValue });
    } else if (field === 'description') {
      setProject({ ...project, description: tempValue });
    }
    setEditingField(null);
    setTempValue('');
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
                <Badge variant="secondary" className={`text-white ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </Badge>
                <Badge variant="outline">{project.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  {format(project.startDate, 'dd/MM/yyyy', { locale: fr })} - {format(project.endDate, 'dd/MM/yyyy', { locale: fr })}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {project.team.length} membres
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
              <span className="text-sm text-muted-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>

          {/* Équipe */}
          <div>
            <h3 className="font-medium mb-3">Équipe projet</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {project.team.map(member => (
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
          <TodoBoard 
            tasks={todoTasks} 
            onTasksChange={setTodoTasks}
            teamMembers={project.team}
          />
        </TabsContent>

        <TabsContent value="notes">
          <NotesEditor projectId={project.id} />
        </TabsContent>

        <TabsContent value="calendar">
          <ProjectCalendar projectId={project.id} />
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
