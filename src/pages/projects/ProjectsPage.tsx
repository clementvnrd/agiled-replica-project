
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Users,
  Target,
  MoreHorizontal,
  FolderOpen
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

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Données exemple des projets
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Build the all-in-one management platform',
      description: 'Développement d\'une plateforme de gestion complète intégrant CRM, gestion de projets, finances, RH et outils de productivité.',
      status: 'active',
      priority: 'high',
      progress: 35,
      startDate: new Date(2024, 4, 1),
      endDate: new Date(2024, 11, 31),
      team: [
        { id: '1', name: 'Alice Martin', role: 'Chef de projet' },
        { id: '2', name: 'Bob Durand', role: 'Développeur Full-Stack' },
      ],
      category: 'Platform Development',
      budget: 150000,
      client: 'Internal'
    },
    {
      id: '2',
      name: 'Marketing Campaign Q4',
      description: 'Campagne marketing pour le lancement du nouveau produit au quatrième trimestre.',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      startDate: new Date(2024, 9, 1),
      endDate: new Date(2024, 11, 15),
      team: [
        { id: '3', name: 'Claire Dubois', role: 'Marketing Manager' },
        { id: '4', name: 'David Chen', role: 'Content Creator' },
      ],
      category: 'Marketing',
      budget: 80000,
      client: 'External'
    },
    {
      id: '3',
      name: 'Mobile App Redesign',
      description: 'Refonte complète de l\'application mobile avec une nouvelle interface utilisateur et de nouvelles fonctionnalités.',
      status: 'active',
      priority: 'high',
      progress: 60,
      startDate: new Date(2024, 2, 15),
      endDate: new Date(2024, 7, 30),
      team: [
        { id: '5', name: 'Emma Wilson', role: 'UI/UX Designer' },
        { id: '6', name: 'Frank Taylor', role: 'Mobile Developer' },
      ],
      category: 'Mobile Development',
      budget: 120000,
      client: 'Internal'
    }
  ]);

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
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority];
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projets</h1>
          <p className="text-muted-foreground">Gérez et suivez tous vos projets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau projet
          </Button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des projets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En planification</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'planning').length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terminés</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'completed').length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-500 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des projets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className={`text-white ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority === 'high' ? 'Haute' : project.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>

              {/* Progression */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm text-muted-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Métadonnées */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(project.startDate, 'dd/MM/yyyy', { locale: fr })} - {format(project.endDate, 'dd/MM/yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{project.team.length} membre{project.team.length > 1 ? 's' : ''}</span>
                </div>
                {project.budget && (
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>{project.budget.toLocaleString('fr-FR')} €</span>
                  </div>
                )}
              </div>

              {/* Équipe */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Équipe</span>
                </div>
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
                    <div className="h-8 w-8 bg-muted border-2 border-background rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">+{project.team.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  onClick={() => handleOpenProject(project.id)}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Ouvrir
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun projet trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Aucun projet ne correspond à votre recherche.' : 'Commencez par créer votre premier projet.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un projet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsPage;
