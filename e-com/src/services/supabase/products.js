import { supabase } from './client';

export const productService = {
  getFeaturedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getFeaturedProducts error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getById error:', error);
      throw error;
    }
  }
}; 