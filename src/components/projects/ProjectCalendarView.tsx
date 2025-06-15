
import React, { useState, useMemo, useCallback } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { 
  CalendarHeader, 
  CalendarLegend, 
  CalendarGrid, 
  UpcomingEvents,
  type CalendarEvent 
} from './calendar';

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
  const goToPreviousMonth = useCallback(() => setCurrentDate(current => subMonths(current, 1)), []);
  const goToNextMonth = useCallback(() => setCurrentDate(current => addMonths(current, 1)), []);
  const goToToday = useCallback(() => setCurrentDate(new Date()), []);

  // Obtenir les événements pour une date donnée
  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  }, [events]);

  const getEventColor = useCallback((event: CalendarEvent) => {
    if (event.type === 'project-start') return 'bg-green-100 text-green-800 border-green-200';
    if (event.type === 'project-end') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (event.type === 'task-due') {
      if (event.priority === 'high') return 'bg-red-100 text-red-800 border-red-200';
      if (event.priority === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  }, []);

  const isToday = useCallback((date: Date) => isSameDay(date, new Date()), []);
  const isPastDue = useCallback((event: CalendarEvent) => {
    return event.type === 'task-due' && event.status !== 'done' && event.date < new Date();
  }, []);

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
        isTaskDialogOpen={isTaskDialogOpen}
        onTaskDialogOpenChange={setIsTaskDialogOpen}
        isProjectDialogOpen={isProjectDialogOpen}
        onProjectDialogOpenChange={setIsProjectDialogOpen}
      />

      <CalendarLegend />

      <CalendarGrid
        daysInMonth={daysInMonth}
        currentDate={currentDate}
        getEventsForDate={getEventsForDate}
        isToday={isToday}
        getEventColor={getEventColor}
        isPastDue={isPastDue}
      />

      <UpcomingEvents
        events={events}
        getEventColor={getEventColor}
        onOpenTaskDialog={() => setIsTaskDialogOpen(true)}
      />
    </div>
  );
};

export default React.memo(ProjectCalendarView);
