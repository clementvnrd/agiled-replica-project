
-- Création de la table pour les tickets CRM
CREATE TABLE public.crm_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL, -- Le contact qui a soumis le ticket
    ticket_number SERIAL,
    subject TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium', -- ex: low, medium, high
    status TEXT NOT NULL DEFAULT 'open', -- ex: open, in-progress, closed
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activation de la Row Level Security (RLS)
ALTER TABLE public.crm_tickets ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres tickets
CREATE POLICY "Users can view their own tickets"
ON public.crm_tickets FOR SELECT
USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de créer leurs propres tickets
CREATE POLICY "Users can insert their own tickets"
ON public.crm_tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres tickets
CREATE POLICY "Users can update their own tickets"
ON public.crm_tickets FOR UPDATE
USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres tickets
CREATE POLICY "Users can delete their own tickets"
ON public.crm_tickets FOR DELETE
USING (auth.uid() = user_id);

-- Création d'un trigger pour mettre à jour automatiquement la colonne 'updated_at'
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON public.crm_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
