import { create } from 'zustand';
import { favoriteService } from '../services/supabase/favorites';

export const useFavoriteStore = create((set, get) => ({
  favorites: [],
  loading: false,

  loadFavorites: async (userId) => {
    if (!userId) {
      set({ favorites: [] });
      return;
    }

    set({ loading: true });
    try {
      const favorites = await favoriteService.getFavorites(userId);
      set({ favorites });
    } catch (error) {
      console.error('Load favorites error:', error);
    } finally {
      set({ loading: false });
    }
  },

  addToFavorites: async (userId, productId) => {
    try {
      await favoriteService.addToFavorites(userId, productId);
      await get().loadFavorites(userId);
    } catch (error) {
      console.error('Add to favorites error:', error);
      throw error;
    }
  },

  removeFromFavorites: async (userId, productId) => {
    try {
      await favoriteService.removeFromFavorites(userId, productId);
      await get().loadFavorites(userId);
    } catch (error) {
      console.error('Remove from favorites error:', error);
      throw error;
    }
  },

  isFavorite: (productId) => {
    return get().favorites.some(fav => fav.product_id === productId);
  }
})); 