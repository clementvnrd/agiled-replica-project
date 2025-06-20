
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  projectId?: string;
  initialStatus?: 'idea' | 'todo' | 'in-progress' | 'done';
}

interface TaskFormData {
  title: string;
  description: string;
  status: 'idea' | 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  project_id: string | null;
  due_date: Date | null;
  tags: string[];
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ 
  open,
  onOpenChange,
  trigger, 
  projectId, 
  initialStatus = 'todo' 
}) => {
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'idea' | 'todo' | 'in-progress' | 'done'>(initialStatus);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'none');
  const { createTask } = useTasks();
  const { projects } = useProjects();
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    defaultValues: {
      status: initialStatus,
      priority: 'medium',
      project_id: projectId || null
    }
  });

  useEffect(() => {
    if (open) {
      console.log('Dialog opened. Projects data:', projects);
    }
  }, [open, projects]);

  const handleStatusChange = (value: string) => {
    setStatus(value as 'idea' | 'todo' | 'in-progress' | 'done');
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value as 'low' | 'medium' | 'high');
  };

  const handleProjectChange = (value: string) => {
    setSelectedProjectId(value);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validProjects = projects ? projects.filter(p => p && typeof p.id === 'string' && p.id.trim() !== '') : [];

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createTask({
        ...data,
        status,
        priority,
        project_id: selectedProjectId === 'none' ? null : selectedProjectId,
        due_date: dueDate?.toISOString().split('T')[0] || null,
        tags
      });
      
      toast({
        title: "Tâche créée",
        description: "La tâche a été créée avec succès."
      });
      
      reset();
      setDueDate(undefined);
      setTags([]);
      setTagInput('');
      setStatus(initialStatus);
      setPriority('medium');
      setSelectedProjectId(projectId || 'none');
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la tâche.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la tâche *</Label>
            <Input
              id="title"
              {...register('title', { required: 'Le titre est requis' })}
              placeholder="Titre de la tâche"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description de la tâche"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idée</SelectItem>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="done">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!projectId && (
            <div className="space-y-2">
              <Label>Projet</Label>
              <Select value={selectedProjectId} onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un projet (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun projet</SelectItem>
                  {validProjects.map(project => {
                    console.log(`Rendering project: ${project.name}, id: '${project.id}'`);
                    return (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name || 'Projet sans nom'}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assignee">Assigné à</Label>
            <Input
              id="assignee"
              {...register('assignee')}
              placeholder="Nom de la personne assignée"
            />
          </div>

          <div className="space-y-2">
            <Label>Date d'échéance</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ajouter un tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer la tâche'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
