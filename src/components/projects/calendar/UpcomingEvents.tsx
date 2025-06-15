
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarEvent } from './types';

interface UpcomingEventsProps {
  events: CalendarEvent[];
  getEventColor: (event: CalendarEvent) => string;
  onOpenTaskDialog: () => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, getEventColor, onOpenTaskDialog }) => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingEvents = events
    .filter(event => event.date >= today && event.date <= nextWeek)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Événements à venir (7 prochains jours)</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length === 0 ? (
          <div className="text-center p-8 flex flex-col items-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun événement à venir</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Les échéances de vos projets et de vos tâches pour les 7 prochains jours s'afficheront ici.
            </p>
            <Button size="sm" onClick={onOpenTaskDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une tâche
            </Button>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
