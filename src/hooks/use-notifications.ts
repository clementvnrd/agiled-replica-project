import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { type User } from "@supabase/supabase-js";
import { type Notification as UINotification } from "@/components/ui/notifications-center";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { handleError } from "@/utils/errorHandler";

type DbNotification = Database['public']['Tables']['notifications']['Row'];

const formatNotification = (dbNotification: DbNotification): UINotification => {
    const { id, type, data, created_at, read } = dbNotification;
    let title = "Notification";
    let message = "Vous avez une nouvelle notification.";
    let uiType: UINotification['type'] = 'info';
    let actions: UINotification['actions'] = [];

    if (type === 'task_assigned' && data && typeof data === 'object' && !Array.isArray(data)) {
        const typedData = data as {
            assigner_name?: string;
            task_title?: string;
            project_id?: string;
            project_name?: string;
        };
        title = "Tâche assignée";
        const assignerName = typedData.assigner_name || 'Quelqu\'un';
        const taskTitle = typedData.task_title || 'une tâche';
        const projectName = typedData.project_name || 'un projet';
        message = `${assignerName} vous a assigné la tâche "${taskTitle}" dans ${projectName}.`;
        uiType = 'info';
        if (typedData.project_id) {
            actions.push({
                label: "Voir le projet",
                path: `/projects/${typedData.project_id}`,
                variant: 'default'
            });
        }
    }
    
    return {
        id,
        title,
        message,
        timestamp: new Date(created_at!),
        type: uiType,
        read: read ?? false,
        actions
    };
};

export function useNotifications() {
  const [notifications, setNotifications] = React.useState<UINotification[]>([]);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  const fetchNotifications = React.useCallback(async (currentUser: User) => {
      if (!currentUser) return;
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        handleError(error, "Erreur lors de la récupération des notifications.");
        return;
      }
      
      if (data) {
        setNotifications(data.map(formatNotification));
      }
  }, []);

  React.useEffect(() => {
    if (user) {
        fetchNotifications(user);
    } else {
        setNotifications([]);
    }
  }, [user, fetchNotifications]);

  React.useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`public:notifications:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newNotification = payload.new as DbNotification;
          setNotifications(prev => [formatNotification(newNotification), ...prev.filter(n => n.id !== newNotification.id)]);
          toast.info("Vous avez une nouvelle notification !");
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const updatedNotification = payload.new as DbNotification;
          setNotifications(prev => prev.map(n => n.id === updatedNotification.id ? formatNotification(updatedNotification) : n));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const oldId = (payload.old as { id: string }).id;
          setNotifications(prev => prev.filter(n => n.id !== oldId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = React.useCallback(async (id: string) => {
    const originalNotifications = [...notifications];
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
        handleError(error, "Impossible de marquer la notification comme lue.");
        setNotifications(originalNotifications);
    }
  }, [notifications]);

  const markAllAsRead = React.useCallback(async () => {
    if (!user) return;
    const originalNotifications = [...notifications];
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) {
        handleError(error, "Impossible de marquer toutes les notifications comme lues.");
        setNotifications(originalNotifications);
    }
  }, [user, notifications]);

  const dismiss = React.useCallback(async (id: string) => {
    const originalNotifications = [...notifications];
    setNotifications(prev => prev.filter(notif => notif.id !== id));

    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
    
    if (error) {
        handleError(error, "Impossible de supprimer la notification.");
        setNotifications(originalNotifications);
    }
  }, [notifications]);

  const clearAll = React.useCallback(async () => {
    if (!user) return;
    const originalNotifications = [...notifications];
    setNotifications([]);
    
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        handleError(error, "Impossible de supprimer toutes les notifications.");
        setNotifications(originalNotifications);
    }
  }, [user, notifications]);
  
  const addNotification = React.useCallback(() => {
    console.warn("addNotification is deprecated. Notifications are added via database triggers.");
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
