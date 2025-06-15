
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const fetchDeals = async (userId: string | undefined) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('crm_deals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching CRM deals:', error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useCrmDeals = () => {
  const { user } = useSupabaseAuth();

  return useQuery({
    queryKey: ['crm_deals', user?.id],
    queryFn: () => fetchDeals(user?.id),
    enabled: !!user,
  });
};
