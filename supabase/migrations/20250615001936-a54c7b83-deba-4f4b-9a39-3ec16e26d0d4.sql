
-- Créer la table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Activer RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de créer leur propre profil
CREATE POLICY "Users can create their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de modifier leur propre profil
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =================================================================
-- PROJECTS TABLE
-- =================================================================
-- Supprimer d'abord toutes les politiques RLS pour projects
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Supprimer les contraintes de clé étrangère existantes
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;

-- Modifier le type de la colonne user_id (de text vers uuid)
ALTER TABLE public.projects ALTER COLUMN user_id TYPE uuid USING (
  CASE 
    WHEN user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN user_id::uuid 
    ELSE NULL 
  END
);

-- Ajouter la contrainte de clé étrangère vers auth.users
ALTER TABLE public.projects 
  ADD CONSTRAINT projects_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Recréer les politiques RLS pour projects
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- =================================================================
-- TASKS TABLE
-- =================================================================
-- Supprimer d'abord toutes les politiques RLS pour tasks
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

-- Supprimer les contraintes de clé étrangère existantes
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

-- Modifier le type de la colonne user_id
ALTER TABLE public.tasks ALTER COLUMN user_id TYPE uuid USING (
  CASE 
    WHEN user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN user_id::uuid 
    ELSE NULL 
  END
);

-- Ajouter la contrainte de clé étrangère vers auth.users
ALTER TABLE public.tasks 
  ADD CONSTRAINT tasks_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Recréer les politiques RLS pour tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- =================================================================
-- TEAM_MEMBERS TABLE
-- =================================================================
-- Supprimer d'abord toutes les politiques RLS pour team_members
DROP POLICY IF EXISTS "Users can view team members of their projects" ON public.team_members;
DROP POLICY IF EXISTS "Users can create team members for their projects" ON public.team_members;
DROP POLICY IF EXISTS "Users can update team members of their projects" ON public.team_members;
DROP POLICY IF EXISTS "Users can delete team members of their projects" ON public.team_members;

-- Supprimer les contraintes de clé étrangère existantes
ALTER TABLE public.team_members DROP CONSTRAINT IF EXISTS team_members_user_id_fkey;

-- Modifier le type de la colonne user_id
ALTER TABLE public.team_members ALTER COLUMN user_id TYPE uuid USING (
  CASE 
    WHEN user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN user_id::uuid 
    ELSE NULL 
  END
);

-- Ajouter la contrainte de clé étrangère vers auth.users
ALTER TABLE public.team_members 
  ADD CONSTRAINT team_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Recréer les politiques RLS pour team_members
CREATE POLICY "Users can view team members of their projects" ON public.team_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create team members for their projects" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update team members of their projects" ON public.team_members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete team members of their projects" ON public.team_members
  FOR DELETE USING (auth.uid() = user_id);

-- =================================================================
-- PROJECT_NOTES TABLE
-- =================================================================
-- Supprimer d'abord toutes les politiques RLS pour project_notes
DROP POLICY IF EXISTS "Users can view notes of their projects" ON public.project_notes;
DROP POLICY IF EXISTS "Users can create notes for their projects" ON public.project_notes;
DROP POLICY IF EXISTS "Users can update notes of their projects" ON public.project_notes;
DROP POLICY IF EXISTS "Users can delete notes of their projects" ON public.project_notes;

-- Supprimer les contraintes de clé étrangère existantes
ALTER TABLE public.project_notes DROP CONSTRAINT IF EXISTS project_notes_user_id_fkey;

-- Modifier le type de la colonne user_id
ALTER TABLE public.project_notes ALTER COLUMN user_id TYPE uuid USING (
  CASE 
    WHEN user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN user_id::uuid 
    ELSE NULL 
  END
);

-- Ajouter la contrainte de clé étrangère vers auth.users
ALTER TABLE public.project_notes 
  ADD CONSTRAINT project_notes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Recréer les politiques RLS pour project_notes
CREATE POLICY "Users can view notes of their projects" ON public.project_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes for their projects" ON public.project_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update notes of their projects" ON public.project_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete notes of their projects" ON public.project_notes
  FOR DELETE USING (auth.uid() = user_id);
