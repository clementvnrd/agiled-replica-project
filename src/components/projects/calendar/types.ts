
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'project-start' | 'project-end' | 'task-due';
  priority?: 'low' | 'medium' | 'high';
  status: string;
}
