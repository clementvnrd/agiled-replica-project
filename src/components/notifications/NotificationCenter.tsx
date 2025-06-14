
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Calendar, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'overdue' | 'due-today' | 'due-tomorrow' | 'project-deadline' | 'high-priority';
  title: string;
  message: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionable: boolean;
  relatedId?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const { projects } = useProjects();
  const { tasks } = useTasks();

  // Générer les notifications basées sur les projets et tâches
  useEffect(() => {
    const newNotifications: Notification[] = [];
    const now = new Date();

    // Tâches en retard
    tasks.forEach(task => {
      if (task.due_date && task.status !== 'done') {
        const dueDate = new Date(task.due_date);
        
        if (isPast(dueDate) && !isToday(dueDate)) {
          newNotifications.push({
            id: `overdue-${task.id}`,
            type: 'overdue',
            title: 'Tâche en retard',
            message: `"${task.title}" était due le ${format(dueDate, 'dd/MM/yyyy', { locale: fr })}`,
            date: dueDate,
            priority: 'high',
            read: false,
            actionable: true,
            relatedId: task.id
          });
        } else if (isToday(dueDate)) {
          newNotifications.push({
            id: `due-today-${task.id}`,
            type: 'due-today',
            title: 'Tâche due aujourd\'hui',
            message: `"${task.title}" est due aujourd'hui`,
            date: dueDate,
            priority: 'high',
            read: false,
            actionable: true,
            relatedId: task.id
          });
        } else if (isTomorrow(dueDate)) {
          newNotifications.push({
            id: `due-tomorrow-${task.id}`,
            type: 'due-tomorrow',
            title: 'Tâche due demain',
            message: `"${task.title}" sera due demain`,
            date: dueDate,
            priority: 'medium',
            read: false,
            actionable: true,
            relatedId: task.id
          });
        }
      }
    });

    // Projets approchant de leur fin
    projects.forEach(project => {
      if (project.end_date && project.status === 'active') {
        const endDate = new Date(project.end_date);
        const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilEnd <= 7 && daysUntilEnd > 0) {
          newNotifications.push({
            id: `project-deadline-${project.id}`,
            type: 'project-deadline',
            title: 'Échéance de projet approche',
            message: `Le projet "${project.name}" se termine dans ${daysUntilEnd} jour(s)`,
            date: endDate,
            priority: daysUntilEnd <= 3 ? 'high' : 'medium',
            read: false,
            actionable: true,
            relatedId: project.id
          });
        }
      }
    });

    // Tâches haute priorité non assignées
    tasks.forEach(task => {
      if (task.priority === 'high' && task.status === 'todo' && !task.assignee) {
        newNotifications.push({
          id: `high-priority-${task.id}`,
          type: 'high-priority',
          title: 'Tâche haute priorité non assignée',
          message: `"${task.title}" est une tâche haute priorité sans assignation`,
          date: new Date(task.created_at || ''),
          priority: 'medium',
          read: false,
          actionable: true,
          relatedId: task.id
        });
      }
    });

    // Trier par priorité et date
    newNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.date.getTime() - a.date.getTime();
    });

    setNotifications(newNotifications);
  }, [projects, tasks]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'due-today':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'due-tomorrow':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      case 'project-deadline':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'high-priority':
        return <AlertTriangle className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredNotifications = showOnlyUnread 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Centre de notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnlyUnread(!showOnlyUnread)}
              >
                {showOnlyUnread ? 'Voir toutes' : 'Non lues uniquement'}
              </Button>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Tout marquer comme lu
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Résumé des notifications */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold text-red-600">
                  {notifications.filter(n => n.type === 'overdue').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due aujourd'hui</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.type === 'due-today').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due demain</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notifications.filter(n => n.type === 'due-tomorrow').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Non lues</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des notifications */}
      <Card>
        <CardHeader>
          <CardTitle>
            Notifications {showOnlyUnread && 'non lues'} ({filteredNotifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                {showOnlyUnread 
                  ? 'Vous avez lu toutes vos notifications !' 
                  : 'Aucune notification pour le moment.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    notification.read ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority === 'high' ? 'Haute' : 
                             notification.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(notification.date, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marquer comme lu
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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

export default NotificationCenter;
