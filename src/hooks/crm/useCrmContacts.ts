
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const fetchContacts = async (userId: string | undefined) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching CRM contacts:', error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useCrmContacts = () => {
  const { user } = useSupabaseAuth();

  return useQuery({
    queryKey: ['crm_contacts', user?.id],
    queryFn: () => fetchContacts(user?.id),
    enabled: !!user,
  });
};
