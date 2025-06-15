
-- Créer la table crm_todos
CREATE TABLE public.crm_todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  category TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.crm_todos ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour que les utilisateurs ne voient que leurs propres todos
CREATE POLICY "Users can view their own todos" 
  ON public.crm_todos 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own todos" 
  ON public.crm_todos 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
  ON public.crm_todos 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
  ON public.crm_todos 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Ajouter un trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_crm_todos_updated_at
  BEFORE UPDATE ON public.crm_todos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
