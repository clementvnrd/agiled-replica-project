import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit3, 
  Save, 
  X, 
  Calendar, 
  User, 
  MoreHorizontal,
  AlertCircle,
  Clock,
  CheckCircle,
  Tag,
  Trash2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface TodoCardProps {
  task: TodoTask;
  teamMembers: TeamMember[];
  onUpdate: (updates: Partial<TodoTask>) => void;
  onDelete: () => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ task, teamMembers, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    title: task.title,
    description: task.description
  });

  const getPriorityColor = (priority: TodoTask['priority']) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority];
  };

  const getPriorityIcon = (priority: TodoTask['priority']) => {
    if (priority === 'high') return <AlertCircle className="h-3 w-3" />;
    if (priority === 'medium') return <Clock className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getPriorityLabel = (priority: TodoTask['priority']) => {
    const labels = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute'
    };
    return labels[priority];
  };

  const handleStartEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSaveEdit = (field: string) => {
    if (field === 'title' || field === 'description') {
      onUpdate({ [field]: editValues[field] });
    }
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditValues({
      title: task.title,
      description: task.description
    });
    setEditingField(null);
  };

  const assignedMember = teamMembers.find(member => member.name === task.assignee);

  const isOverdue = task.dueDate && new Date() > task.dueDate && task.status !== 'done';

  return (
    <Card className={`cursor-pointer hover:shadow-md transition-all ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}`}>
      <CardContent className="p-4 space-y-3">
        {/* En-tête avec titre et actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {editingField === 'title' ? (
              <div className="space-y-2">
                <Input
                  value={editValues.title}
                  onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                  className="font-medium"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button size="sm" onClick={() => handleSaveEdit('title')}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <h4 
                className="font-medium text-sm leading-tight cursor-pointer hover:text-primary"
                onClick={() => handleStartEdit('title')}
              >
                {task.title}
              </h4>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStartEdit('title')}>
                <Edit3 className="h-3 w-3 mr-2" />
                Modifier le titre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStartEdit('description')}>
                <Edit3 className="h-3 w-3 mr-2" />
                Modifier la description
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                <Trash2 className="h-3 w-3 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {(task.description || editingField === 'description') && (
          <div>
            {editingField === 'description' ? (
              <div className="space-y-2">
                <Textarea
                  value={editValues.description}
                  onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button size="sm" onClick={() => handleSaveEdit('description')}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <p 
                className="text-xs text-muted-foreground line-clamp-3 cursor-pointer hover:text-foreground"
                onClick={() => handleStartEdit('description')}
              >
                {task.description}
              </p>
            )}
          </div>
        )}

        {/* Priorité */}
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${getPriorityColor(task.priority)} flex items-center gap-1`}>
            {getPriorityIcon(task.priority)}
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                <Tag className="h-2 w-2" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Métadonnées */}
        <div className="space-y-2 pt-2 border-t">
          {/* Assigné à */}
          {task.assignee && assignedMember && (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <div className="flex items-center gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={assignedMember.avatar} />
                  <AvatarFallback className="text-xs">
                    {assignedMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{assignedMember.name}</span>
              </div>
            </div>
          )}

          {/* Date d'échéance */}
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                {format(task.dueDate, 'dd/MM/yyyy', { locale: fr })}
                {isOverdue && ' (En retard)'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(TodoCard);
