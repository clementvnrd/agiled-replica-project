
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'task';
  attendees?: string[];
  location?: string;
}

interface ProjectCalendarProps {
  projectId: string;
}

const ProjectCalendar: React.FC<ProjectCalendarProps> = ({ projectId }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Événements exemple
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Réunion équipe projet',
      description: 'Point hebdomadaire sur l\'avancement du projet',
      date: new Date(2024, 5, 10),
      startTime: '14:00',
      endTime: '15:30',
      type: 'meeting',
      attendees: ['Alice Martin', 'Bob Durand', 'Claire Dubois'],
      location: 'Salle de réunion A'
    },
    {
      id: '2',
      title: 'Deadline - Maquettes UI/UX',
      description: 'Livraison des maquettes finales',
      date: new Date(2024, 5, 15),
      startTime: '18:00',
      endTime: '18:00',
      type: 'deadline',
      attendees: ['Claire Dubois']
    },
    {
      id: '3',
      title: 'Sprint Planning',
      description: 'Planification du prochain sprint de développement',
      date: new Date(2024, 5, 17),
      startTime: '09:00',
      endTime: '11:00',
      type: 'meeting',
      attendees: ['Alice Martin', 'Bob Durand', 'David Chen'],
      location: 'Bureau principal'
    },
    {
      id: '4',
      title: 'Milestone - MVP Complété',
      description: 'Première version fonctionnelle du produit',
      date: new Date(2024, 5, 25),
      startTime: '12:00',
      endTime: '12:00',
      type: 'milestone'
    },
    {
      id: '5',
      title: 'Tests utilisateurs',
      description: 'Session de tests avec les utilisateurs finaux',
      date: new Date(2024, 5, 20),
      startTime: '10:00',
      endTime: '16:00',
      type: 'task',
      attendees: ['Claire Dubois', 'Alice Martin'],
      location: 'Lab UX'
    }
  ]);

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    const colors = {
      meeting: 'bg-blue-500 text-white',
      deadline: 'bg-red-500 text-white',
      milestone: 'bg-green-500 text-white',
      task: 'bg-purple-500 text-white'
    };
    return colors[type];
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    const labels = {
      meeting: 'Réunion',
      deadline: 'Échéance',
      milestone: 'Jalon',
      task: 'Tâche'
    };
    return labels[type];
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getDayEvents = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return null;

    return (
      <div className="mt-1 space-y-1">
        {dayEvents.slice(0, 2).map(event => (
          <div
            key={event.id}
            className={`text-xs p-1 rounded text-center ${getEventTypeColor(event.type)}`}
          >
            {event.title.length > 15 ? `${event.title.slice(0, 15)}...` : event.title}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="text-xs text-center text-muted-foreground">
            +{dayEvents.length - 2} autre{dayEvents.length - 2 > 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendrier principal */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier du projet
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Mois
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Semaine
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Jour
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full pointer-events-auto"
            components={{
              Day: ({ date, ...props }) => (
                <div className="relative w-full h-16 p-1">
                  <div className="text-sm font-medium">{format(date, 'd')}</div>
                  {getDayEvents(date)}
                </div>
              )
            }}
          />
        </CardContent>
      </Card>

      {/* Détails de la journée sélectionnée */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </CardTitle>
          <Button size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un événement
          </Button>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun événement prévu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge className={getEventTypeColor(event.type)}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>
                        {event.startTime}
                        {event.startTime !== event.endTime && ` - ${event.endTime}`}
                      </span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>
                          {event.attendees.length} participant{event.attendees.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCalendar;
