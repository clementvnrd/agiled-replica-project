
-- Création de la table pour les activités CRM
CREATE TABLE public.crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending', -- ex: 'pending', 'completed'
    activity_type TEXT NOT NULL, -- ex: 'call', 'email', 'meeting', 'todo'
    related_to_contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
    related_to_account_id UUID REFERENCES public.crm_accounts(id) ON DELETE SET NULL,
    related_to_deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT one_relation_only CHECK (
        (CASE WHEN related_to_contact_id IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN related_to_account_id IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN related_to_deal_id IS NOT NULL THEN 1 ELSE 0 END) <= 1
    )
);

-- Activation de la Row Level Security (RLS)
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de gérer leurs propres activités
CREATE POLICY "Users can manage their own crm activities"
ON public.crm_activities FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Création d'un trigger pour mettre à jour automatiquement la colonne 'updated_at'
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON public.crm_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

