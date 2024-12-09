import { supabase } from './client';

export const brandService = {
  getBrands: async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }
}; 