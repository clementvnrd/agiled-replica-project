
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Calendar as CalendarIcon, 
  Users, 
  Target,
  MoreHorizontal,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateTaskDialog from '@/components/projects/CreateTaskDialog';
import { useToast } from "@/hooks/use-toast";
import type { Database } from '@/integrations/supabase/types';

type DbProject = Database['public']['Tables']['projects']['Row'];
type DbProjectUpdate = Database['public']['Tables']['projects']['Update'];

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface ProjectHeaderProps {
  project: DbProject;
  team: TeamMember[];
  updateProject: (id: string, updates: DbProjectUpdate) => Promise<any>;
  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (isOpen: boolean) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, team, updateProject, isCreateTaskOpen, setIsCreateTaskOpen }) => {
  const { toast } = useToast();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEditField = (field: string, currentValue: string | null) => {
    setEditingField(field);
    setTempValue(currentValue || '');
  };

  const handleSaveField = async (field: string) => {
    if (!project) return;
    
    let updates: DbProjectUpdate = {};
    if (field === 'name') {
      updates = { name: tempValue };
    } else if (field === 'description') {
      updates = { description: tempValue };
    }
    
    setEditingField(null);
    try {
      await updateProject(project.id, updates);
      toast({ title: "Projet mis à jour", description: "Les informations du projet ont été sauvegardées." });
    } catch (err) {
      toast({ title: "Erreur", description: "La mise à jour du projet a échoué.", variant: "destructive" });
      console.error("Erreur de mise à jour:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const getStatusColor = (status: DbProject['status']) => {
    const colors = {
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      'on-hold': 'bg-yellow-500',
      planning: 'bg-purple-500'
    };
    return colors[status || 'planning'];
  };

  const getStatusLabel = (status: DbProject['status']) => {
    const labels = {
      active: 'Actif',
      completed: 'Terminé',
      'on-hold': 'En pause',
      planning: 'Planification'
    };
    return labels[status || 'planning'];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-4">
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

            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className={`text-white ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
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

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Progression</h3>
            <span className="text-sm text-muted-foreground">{project.progress || 0}%</span>
          </div>
          <Progress value={project.progress || 0} className="h-3" />
        </div>

        <div>
          <h3 className="font-medium mb-3">Équipe projet</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {team.map(member => (
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
  );
};

export default ProjectHeader;
