
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const fetchAccounts = async (userId: string | undefined) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('crm_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching CRM accounts:', error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useCrmAccounts = () => {
  const { user } = useSupabaseAuth();

  return useQuery({
    queryKey: ['crm_accounts', user?.id],
    queryFn: () => fetchAccounts(user?.id),
    enabled: !!user,
  });
};
