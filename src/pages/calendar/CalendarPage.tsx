
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, Clock, Users, MapPin, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'task' | 'personal' | 'deadline';
  participants?: string[];
  location?: string;
}

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Réunion équipe marketing',
      description: 'Point hebdomadaire sur les campagnes en cours',
      start: new Date(2024, 5, 15, 9, 0),
      end: new Date(2024, 5, 15, 10, 30),
      type: 'meeting',
      participants: ['Alice Martin', 'Bob Durand'],
      location: 'Salle de conférence A'
    },
    {
      id: '2',
      title: 'Deadline projet client X',
      description: 'Livraison finale du site web',
      start: new Date(2024, 5, 20, 17, 0),
      end: new Date(2024, 5, 20, 17, 0),
      type: 'deadline'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'meeting' as CalendarEvent['type'],
    location: ''
  });

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    const colors = {
      meeting: 'bg-blue-500',
      task: 'bg-green-500', 
      personal: 'bg-purple-500',
      deadline: 'bg-red-500'
    };
    return colors[type];
  };

  const getEventTypeLabel = (type: CalendarEvent['type']) => {
    const labels = {
      meeting: 'Réunion',
      task: 'Tâche',
      personal: 'Personnel',
      deadline: 'Deadline'
    };
    return labels[type];
  };

  const getTodayEvents = () => {
    const today = new Date();
    return events.filter(event => 
      format(event.start, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => event.start > today)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
      type: newEvent.type,
      location: newEvent.location
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      start: '',
      end: '',
      type: 'meeting',
      location: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendrier</h1>
          <p className="text-muted-foreground">Gérez vos événements et planifiez votre temps</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Planifier Événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvel Événement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Titre de l'événement"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
              <Textarea
                placeholder="Description (optionnel)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Début</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Fin</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                  />
                </div>
              </div>
              <select
                className="w-full p-2 border rounded-md"
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value as CalendarEvent['type']})}
              >
                <option value="meeting">Réunion</option>
                <option value="task">Tâche</option>
                <option value="personal">Personnel</option>
                <option value="deadline">Deadline</option>
              </select>
              <Input
                placeholder="Lieu (optionnel)"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
              <Button onClick={handleCreateEvent} className="w-full">
                Créer l'événement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Vue Calendrier</TabsTrigger>
          <TabsTrigger value="list">Liste des Événements</TabsTrigger>
          <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Calendrier</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Événements à venir</CardTitle>
                </CardHeader>
                <CardContent>
                  {getUpcomingEvents().length === 0 ? (
                    <p className="text-muted-foreground text-sm">Aucun événement à venir</p>
                  ) : (
                    <div className="space-y-3">
                      {getUpcomingEvents().map(event => (
                        <div key={event.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {format(event.start, 'dd/MM à HH:mm', { locale: fr })}
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{event.location}</span>
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary" className={`text-white ${getEventTypeColor(event.type)}`}>
                              {getEventTypeLabel(event.type)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tous les Événements</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium text-muted-foreground">Aucun événement</h3>
                  <p className="text-sm text-muted-foreground">Créez votre premier événement</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.sort((a, b) => a.start.getTime() - b.start.getTime()).map(event => (
                    <div key={event.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge variant="secondary" className={`text-white ${getEventTypeColor(event.type)}`}>
                              {getEventTypeLabel(event.type)}
                            </Badge>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(event.start, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            )}
                            {event.participants && event.participants.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {event.participants.length} participant(s)
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Événements d'aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              {getTodayEvents().length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium text-muted-foreground">Aucun événement aujourd'hui</h3>
                  <p className="text-sm text-muted-foreground">Profitez de votre journée libre !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getTodayEvents().map(event => (
                    <div key={event.id} className="p-4 border rounded-lg bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                          </div>
                        </div>
                        <Badge variant="secondary" className={`text-white ${getEventTypeColor(event.type)}`}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarPage;
