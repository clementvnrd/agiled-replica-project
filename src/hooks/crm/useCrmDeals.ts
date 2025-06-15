
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';

const fetchDeals = async (userId: string | null | undefined) => {
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
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['crm_deals', userId],
    queryFn: () => fetchDeals(userId),
    enabled: !!userId,
  });
};
