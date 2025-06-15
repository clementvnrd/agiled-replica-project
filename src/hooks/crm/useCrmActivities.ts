
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Tables } from '@/integrations/supabase/types';

export type CrmActivity = Tables<'crm_activities'>;

const fetchCrmActivities = async (userId: string | undefined): Promise<CrmActivity[]> => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching CRM activities:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useCrmActivities = () => {
  const { user } = useSupabaseAuth();
  
  return useQuery({
    queryKey: ['crm_activities', user?.id],
    queryFn: () => fetchCrmActivities(user?.id),
    enabled: !!user,
  });
};
