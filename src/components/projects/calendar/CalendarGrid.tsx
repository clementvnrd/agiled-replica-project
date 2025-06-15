
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameMonth } from 'date-fns';
import { CalendarEvent } from './types';

interface CalendarGridProps {
  daysInMonth: Date[];
  currentDate: Date;
  getEventsForDate: (date: Date) => CalendarEvent[];
  isToday: (date: Date) => boolean;
  getEventColor: (event: CalendarEvent) => string;
  isPastDue: (event: CalendarEvent) => boolean;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  daysInMonth,
  currentDate,
  getEventsForDate,
  isToday,
  getEventColor,
  isPastDue,
}) => {
  return (
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
                  isCurrentMonth ? 'bg-background' : 'bg-muted/20'
                } ${isTodayDate ? 'ring-2 ring-primary' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isTodayDate ? 'text-primary' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
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
  );
};

export default CalendarGrid;
