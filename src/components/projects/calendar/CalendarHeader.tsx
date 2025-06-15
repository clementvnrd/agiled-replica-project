
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateTaskDialog from '../CreateTaskDialog';
import CreateProjectDialog from '../CreateProjectDialog';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  isTaskDialogOpen: boolean;
  onTaskDialogOpenChange: (open: boolean) => void;
  isProjectDialogOpen: boolean;
  onProjectDialogOpenChange: (open: boolean) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  isTaskDialogOpen,
  onTaskDialogOpenChange,
  isProjectDialogOpen,
  onProjectDialogOpenChange,
}) => {
  return (
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
              onOpenChange={onTaskDialogOpenChange}
              trigger={
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tâche
                </Button>
              }
            />
            <CreateProjectDialog
              open={isProjectDialogOpen}
              onOpenChange={onProjectDialogOpenChange}
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
            <Button variant="outline" size="sm" onClick={onPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            <Button variant="outline" size="sm" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={onToday}>
            Aujourd'hui
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CalendarHeader;
