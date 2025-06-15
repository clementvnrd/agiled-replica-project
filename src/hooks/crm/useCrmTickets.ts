
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Tables } from '@/integrations/supabase/types';

export type CrmTicket = Tables<'crm_tickets'>;

const fetchCrmTickets = async (userId: string | undefined): Promise<CrmTicket[]> => {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('crm_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('ticket_number', { ascending: false });

  if (error) {
    console.error('Error fetching CRM tickets:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useCrmTickets = () => {
  const { user } = useSupabaseAuth();
  
  return useQuery({
    queryKey: ['crm_tickets', user?.id],
    queryFn: () => fetchCrmTickets(user?.id),
    enabled: !!user,
  });
};
