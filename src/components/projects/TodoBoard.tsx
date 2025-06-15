import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Lightbulb, CheckSquare, Clock, CheckCircle } from 'lucide-react';
import TodoCard from './TodoCard';
import CreateTodoDialog from './CreateTodoDialog';

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

interface TodoBoardProps {
  tasks: TodoTask[];
  teamMembers: TeamMember[];
  onCreateTask: (taskData: Omit<TodoTask, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<TodoTask>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  projectId?: string;
}

const TodoBoard: React.FC<TodoBoardProps> = ({ 
  tasks, 
  teamMembers,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  projectId
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createInColumn, setCreateInColumn] = useState<TodoTask['status']>('idea');

  const columns = [
    {
      id: 'idea',
      title: 'Idées',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'bg-yellow-500',
      description: 'Nouvelles idées et concepts'
    },
    {
      id: 'todo',
      title: 'À faire',
      icon: <CheckSquare className="h-5 w-5" />,
      color: 'bg-blue-500',
      description: 'Tâches planifiées'
    },
    {
      id: 'in-progress',
      title: 'En cours',
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-orange-500',
      description: 'Travail en cours'
    },
    {
      id: 'done',
      title: 'Terminé',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'bg-green-500',
      description: 'Tâches complétées'
    }
  ];

  const getTasksByStatus = (status: TodoTask['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    onUpdateTask(draggableId, { status: destination.droppableId as TodoTask['status'] });
  };

  const handleCreateTask = async (newTask: Omit<TodoTask, 'id' | 'createdAt'>) => {
    await onCreateTask(newTask);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TodoTask>) => {
    await onUpdateTask(taskId, updates);
  };

  const handleDeleteTask = async (taskId: string) => {
    await onDeleteTask(taskId);
  };

  const openCreateDialog = (status: TodoTask['status']) => {
    setCreateInColumn(status);
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6" />
              Tableau de bord des tâches
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {tasks.length} tâche{tasks.length > 1 ? 's' : ''} au total
            </div>
          </div>
        </CardHeader>
      </Card>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.id as TodoTask['status']);
            
            return (
              <Card key={column.id} className="h-fit">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${column.color} text-white`}>
                        {column.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{column.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{column.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => openCreateDialog(column.id as TodoTask['status'])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une tâche
                  </Button>
                </CardHeader>

                <CardContent>
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-muted/50' : ''
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                                className={snapshot.isDragging ? 'rotate-3 scale-105' : ''}
                              >
                                <TodoCard
                                  task={task}
                                  teamMembers={teamMembers}
                                  onUpdate={(updates) => handleUpdateTask(task.id, updates)}
                                  onDelete={() => handleDeleteTask(task.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DragDropContext>

      <CreateTodoDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateTask={handleCreateTask}
        initialStatus={createInColumn}
        teamMembers={teamMembers}
        projectId={projectId}
      />
    </div>
  );
};

export default TodoBoard;
