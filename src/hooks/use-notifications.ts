
import * as React from "react";
import { Notification } from "@/components/ui/notifications-center";

export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = React.useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = React.useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
    unreadCount: notifications.filter(n => !n.read).length,
  };
}
