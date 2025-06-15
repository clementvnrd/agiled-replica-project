
-- 1. Créer la table pour stocker les notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES auth.users(id)
      ON DELETE CASCADE
);

-- Activer RLS pour la table des notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour la table des notifications
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs propres notifications" ON public.notifications;
CREATE POLICY "Les utilisateurs peuvent voir leurs propres notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leurs propres notifications" ON public.notifications;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent supprimer leurs notifications" ON public.notifications;
CREATE POLICY "Les utilisateurs peuvent supprimer leurs notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Supprimer l'ancienne version du trigger et de la fonction pour éviter les conflits
DROP TRIGGER IF EXISTS on_task_assigned_trigger ON public.tasks;
DROP FUNCTION IF EXISTS public.handle_task_assignment_notification();

-- 3. Créer la fonction qui sera déclenchée pour créer une notification
CREATE OR REPLACE FUNCTION public.handle_task_assignment_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET SEARCH_PATH = public
AS $$
DECLARE
  project_name_var TEXT;
  assigner_name_var TEXT;
  assignee_user_id_var UUID;
  current_user_id_var UUID;
BEGIN
  -- Si la colonne assignee est vide, ne rien faire
  IF new.assignee IS NULL THEN
    RETURN new;
  END IF;

  -- Récupérer l'ID de l'utilisateur qui effectue l'action (l'assignateur)
  current_user_id_var := auth.uid();

  -- Obtenir l'user_id de l'assigné à partir de la table team_members
  -- Le champ `assignee` de la table `tasks` contient l'ID du `team_members`
  SELECT user_id INTO assignee_user_id_var FROM public.team_members WHERE id = new.assignee::uuid;

  -- Si on ne trouve pas d'utilisateur pour l'assigné, on ne fait rien
  IF assignee_user_id_var IS NULL THEN
    RETURN new;
  END IF;

  -- Ne pas envoyer de notification si un utilisateur s'assigne une tâche à lui-même
  IF assignee_user_id_var = current_user_id_var THEN
    RETURN new;
  END IF;

  -- Déclencher seulement si une tâche est assignée (à la création ou à la mise à jour)
  IF (TG_OP = 'INSERT' AND new.assignee IS NOT NULL) OR 
     (TG_OP = 'UPDATE' AND new.assignee IS NOT NULL AND (old.assignee IS NULL OR old.assignee <> new.assignee)) THEN

    -- Récupérer le nom du projet associé à la tâche
    SELECT name INTO project_name_var FROM public.projects WHERE id = new.project_id;

    -- Récupérer le nom complet de l'utilisateur qui assigne la tâche
    SELECT raw_user_meta_data->>'full_name' INTO assigner_name_var FROM auth.users WHERE id = current_user_id_var;
    -- Si le nom complet n'existe pas, utiliser l'email comme solution de repli
    IF assigner_name_var IS NULL THEN
        SELECT email INTO assigner_name_var FROM auth.users WHERE id = current_user_id_var;
    END IF;

    -- Insérer la nouvelle notification dans la table `notifications`
    INSERT INTO public.notifications (user_id, type, data, read)
    VALUES (
      assignee_user_id_var,
      'task_assigned',
      jsonb_build_object(
        'task_id', new.id,
        'task_title', new.title, -- Corrigé : 'name' -> 'title'
        'project_id', new.project_id,
        'project_name', COALESCE(project_name_var, 'Projet inconnu'),
        'assigner_name', COALESCE(assigner_name_var, 'Un utilisateur')
      ),
      false
    );
  END IF;
  
  RETURN new;
END;
$$;

-- 4. Créer le trigger qui appelle la fonction après chaque ajout ou mise à jour de tâche
CREATE TRIGGER on_task_assigned_trigger
  AFTER INSERT OR UPDATE OF assignee ON public.tasks -- Corrigé : 'assigned_to' -> 'assignee'
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_task_assignment_notification();
