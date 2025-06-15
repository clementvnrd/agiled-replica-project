
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import CreateTaskDialog from './CreateTaskDialog';
import CreateProjectDialog from './CreateProjectDialog';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'project-start' | 'project-end' | 'task-due';
  priority?: 'low' | 'medium' | 'high';
  status: string;
}

const ProjectCalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  // Générer les événements du calendrier
  const events = useMemo((): CalendarEvent[] => {
    const projectEvents: CalendarEvent[] = [];
    
    // Ajouter les dates de début et fin des projets
    projects.forEach(project => {
      if (project.start_date) {
        projectEvents.push({
          id: `project-start-${project.id}`,
          title: `Début: ${project.name}`,
          date: new Date(project.start_date),
          type: 'project-start',
          status: project.status
        });
      }
      if (project.end_date) {
        projectEvents.push({
          id: `project-end-${project.id}`,
          title: `Fin: ${project.name}`,
          date: new Date(project.end_date),
          type: 'project-end',
          status: project.status
        });
      }
    });

    // Ajouter les dates d'échéance des tâches
    tasks.forEach(task => {
      if (task.due_date) {
        projectEvents.push({
          id: `task-due-${task.id}`,
          title: task.title,
          date: new Date(task.due_date),
          type: 'task-due',
          priority: task.priority as 'low' | 'medium' | 'high',
          status: task.status
        });
      }
    });

    return projectEvents;
  }, [projects, tasks]);

  // Obtenir les jours du mois actuel
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Navigation
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Obtenir les événements pour une date donnée
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.type === 'project-start') return 'bg-green-100 text-green-800 border-green-200';
    if (event.type === 'project-end') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (event.type === 'task-due') {
      if (event.priority === 'high') return 'bg-red-100 text-red-800 border-red-200';
      if (event.priority === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isToday = (date: Date) => isSameDay(date, new Date());
  const isPastDue = (event: CalendarEvent) => {
    return event.type === 'task-due' && event.status !== 'done' && event.date < new Date();
  };

  return (
    <div className="space-y-6">
      {/* En-tête du calendrier */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              Calendrier des projets
            </CardTitle>
            <div className="flex items-center gap-2">
              <CreateTaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                trigger={
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tâche
                  </Button>
                }
              />
              <CreateProjectDialog
                open={isProjectDialogOpen}
                onOpenChange={setIsProjectDialogOpen}
                trigger={
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Projet
                  </Button>
                }
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold min-w-[200px] text-center">
                {format(currentDate, 'MMMM yyyy', { locale: fr })}
              </h2>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Aujourd'hui
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Légende */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Début de projet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Fin de projet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Tâche priorité haute</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Tâche priorité moyenne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span>Tâche priorité basse</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille du calendrier */}
      <Card>
        <CardContent className="p-4">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Jours du mois */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map(date => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={date.toString()}
                  className={`min-h-[120px] p-2 border rounded-lg ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isTodayDate ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {format(date, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(event => (
                      <Badge
                        key={event.id}
                        className={`text-xs px-1 py-0.5 block truncate ${getEventColor(event)} ${
                          isPastDue(event) ? 'ring-2 ring-red-500' : ''
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </Badge>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 3} autres
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Événements à venir */}
      <Card>
        <CardHeader>
          <CardTitle>Événements à venir (7 prochains jours)</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const today = new Date();
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const upcomingEvents = events
              .filter(event => event.date >= today && event.date <= nextWeek)
              .sort((a, b) => a.date.getTime() - b.date.getTime());

            if (upcomingEvents.length === 0) {
              return (
                <div className="text-center p-8 flex flex-col items-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Aucun événement à venir</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Les échéances de vos projets et de vos tâches pour les 7 prochains jours s'afficheront ici.
                  </p>
                  <Button size="sm" onClick={() => setIsTaskDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une tâche
                  </Button>
                </div>
              );
            }

            return (
              <div className="space-y-2">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">
                        {format(event.date, 'dd/MM', { locale: fr })}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.type === 'project-start' && 'Début de projet'}
                          {event.type === 'project-end' && 'Fin de projet'}
                          {event.type === 'task-due' && 'Échéance de tâche'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getEventColor(event)}>
                      {event.priority && event.priority === 'high' ? 'Priorité haute' :
                       event.priority === 'medium' ? 'Priorité moyenne' :
                       event.priority === 'low' ? 'Priorité basse' : event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCalendarView;
