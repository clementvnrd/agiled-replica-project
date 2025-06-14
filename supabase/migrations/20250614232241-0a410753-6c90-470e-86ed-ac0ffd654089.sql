
-- Supprimer les politiques RLS existantes et les contraintes de clé étrangère pour modifier le type de la colonne user_id

-- =================================================================
-- Table: projects
-- =================================================================
-- Supprimer les politiques
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Supprimer la contrainte de clé étrangère (en supposant le nom par défaut)
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;

-- Changer le type de la colonne
ALTER TABLE public.projects ALTER COLUMN user_id TYPE TEXT;

-- Recréer les politiques en utilisant le 'sub' du JWT pour l'ID utilisateur Clerk
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING ((auth.jwt() ->> 'sub') = user_id);


-- =================================================================
-- Table: tasks
-- =================================================================
-- Supprimer les politiques
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

-- Supprimer la contrainte de clé étrangère
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

-- Changer le type de la colonne
ALTER TABLE public.tasks ALTER COLUMN user_id TYPE TEXT;

-- Recréer les politiques
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can create their own tasks" ON public.tasks
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING ((auth.jwt() ->> 'sub') = user_id);


-- =================================================================
-- Table: team_members
-- =================================================================
-- Supprimer les politiques
DROP POLICY IF EXISTS "Users can view team members of their projects" ON public.team_members;
DROP POLICY IF EXISTS "Users can create team members for their projects" ON public.team_members;
DROP POLICY IF EXISTS "Users can update team members of their projects" ON public.team_members;
DROP POLICY IF EXISTS "Users can delete team members of their projects" ON public.team_members;

-- Supprimer la contrainte de clé étrangère
ALTER TABLE public.team_members DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;

-- Changer le type de la colonne
ALTER TABLE public.team_members ALTER COLUMN user_id TYPE TEXT;

-- Recréer les politiques
CREATE POLICY "Users can view team members of their projects" ON public.team_members
  FOR SELECT USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can create team members for their projects" ON public.team_members
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update team members of their projects" ON public.team_members
  FOR UPDATE USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete team members of their projects" ON public.team_members
  FOR DELETE USING ((auth.jwt() ->> 'sub') = user_id);

-- =================================================================
-- Table: project_notes
-- =================================================================
-- Supprimer les politiques
DROP POLICY IF EXISTS "Users can view notes of their projects" ON public.project_notes;
DROP POLICY IF EXISTS "Users can create notes for their projects" ON public.project_notes;
DROP POLICY IF EXISTS "Users can update notes of their projects" ON public.project_notes;
DROP POLICY IF EXISTS "Users can delete notes of their projects" ON public.project_notes;

-- Supprimer la contrainte de clé étrangère
ALTER TABLE public.project_notes DROP CONSTRAINT IF EXISTS project_notes_user_id_fkey;

-- Changer le type de la colonne
ALTER TABLE public.project_notes ALTER COLUMN user_id TYPE TEXT;

-- Recréer les politiques
CREATE POLICY "Users can view notes of their projects" ON public.project_notes
  FOR SELECT USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can create notes for their projects" ON public.project_notes
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update notes of their projects" ON public.project_notes
  FOR UPDATE USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete notes of their projects" ON public.project_notes
  FOR DELETE USING ((auth.jwt() ->> 'sub') = user_id);
