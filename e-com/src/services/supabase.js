import { supabase } from './supabase/client';

export const productService = {
  getFeaturedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      //console.log('Gelen veriler:', data);
      return data;
    } catch (error) {
      console.error('getFeaturedProducts error:', error);
      throw error;
    }
  }
}; 