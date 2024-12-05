import { supabase } from './client';

export const favoriteService = {
  getFavorites: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getFavorites error:', error);
      throw error;
    }
  },

  addToFavorites: async (userId, productId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, product_id: productId });

      if (error) throw error;
    } catch (error) {
      console.error('addToFavorites error:', error);
      throw error;
    }
  },

  removeFromFavorites: async (userId, productId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: userId, product_id: productId });

      if (error) throw error;
    } catch (error) {
      console.error('removeFromFavorites error:', error);
      throw error;
    }
  },

  isFavorite: async (userId, productId) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .match({ user_id: userId, product_id: productId })
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('isFavorite error:', error);
      throw error;
    }
  }
}; 