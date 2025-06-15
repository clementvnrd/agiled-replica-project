
import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, AlertCircle, Clock, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrmTodos, type CrmTodo } from '@/hooks/crm/useCrmTodos';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import CreateCrmTodoDialog from './CreateCrmTodoDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CrmTodoList: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { todos, updateTodo, deleteTodo, isLoading } = useCrmTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || todo.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const toggleTodoStatus = (todo: CrmTodo) => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    updateTodo({ id: todo.id, updates: { status: newStatus } });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'medium':
        return <Clock size={16} className="text-yellow-600" />;
      case 'low':
        return <Circle size={16} className="text-green-600" />;
      default:
        return <Circle size={16} className="text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Haute</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Faible</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="text-xs bg-green-600">Terminé</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">En attente</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="text-xs bg-blue-600">En cours</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Inconnu</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>To Do Liste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>To Do Liste</CardTitle>
            <Button onClick={() => setShowCreateDialog(true)} size="sm">
              <Plus size={16} className="mr-2" />
              Nouvelle tâche
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher des tâches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des tâches */}
          <div className="space-y-3">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <div 
                  key={todo.id} 
                  className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                    todo.status === 'completed' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTodoStatus(todo)}
                      className="mt-0.5 hover:scale-110 transition-transform"
                    >
                      {todo.status === 'completed' ? (
                        <CheckCircle2 size={20} className="text-green-600" />
                      ) : (
                        <Circle size={20} className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-medium text-sm ${
                          todo.status === 'completed' ? 'line-through text-gray-500' : ''
                        }`}>
                          {todo.title}
                        </h4>
                        {getPriorityIcon(todo.priority)}
                        {getPriorityBadge(todo.priority)}
                        {getStatusBadge(todo.status)}
                      </div>
                      
                      {todo.description && (
                        <p className={`text-sm mb-2 ${
                          todo.status === 'completed' ? 'text-gray-400' : 'text-muted-foreground'
                        }`}>
                          {todo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          Créé le {format(new Date(todo.created_at), 'dd MMM yyyy', { locale: fr })}
                        </span>
                        {todo.due_date && (
                          <span className={
                            new Date(todo.due_date) < new Date() && todo.status !== 'completed' 
                              ? 'text-red-600 font-medium' 
                              : ''
                          }>
                            Échéance: {format(new Date(todo.due_date), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        )}
                        {todo.category && (
                          <Badge variant="outline" className="text-xs">
                            {todo.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune tâche trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Aucune tâche ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre première tâche.'}
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus size={16} className="mr-2" />
                  Créer une tâche
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateCrmTodoDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
};

export default CrmTodoList;
