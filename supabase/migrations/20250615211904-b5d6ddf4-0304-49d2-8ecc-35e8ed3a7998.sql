
-- Fonction utilitaire pour mettre à jour la colonne 'updated_at' automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Table pour les comptes CRM (Clients)
CREATE TABLE public.crm_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  website TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sécurité : Les utilisateurs ne peuvent gérer que leurs propres comptes
ALTER TABLE public.crm_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own accounts" ON public.crm_accounts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger pour mettre à jour 'updated_at' lors d'une modification
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.crm_accounts
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Table pour les contacts CRM
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES public.crm_accounts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sécurité : Les utilisateurs ne peuvent gérer que leurs propres contacts
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own contacts" ON public.crm_contacts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger pour mettre à jour 'updated_at'
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Table pour les transactions (Deals) CRM
CREATE TABLE public.crm_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  account_id UUID REFERENCES public.crm_accounts(id) ON DELETE CASCADE NOT NULL,
  stage TEXT NOT NULL DEFAULT 'lead-in' CHECK (stage IN ('lead-in', 'contact-made', 'proposal-made', 'negotiation', 'won', 'lost')),
  value NUMERIC(12, 2),
  expected_close_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sécurité : Les utilisateurs ne peuvent gérer que leurs propres deals
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own deals" ON public.crm_deals
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger pour mettre à jour 'updated_at'
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.crm_deals
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

