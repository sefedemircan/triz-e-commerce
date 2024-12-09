import { supabase } from './client';

export const campaignService = {
  getActiveCampaigns: async () => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}; 