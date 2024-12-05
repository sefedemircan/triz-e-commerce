import { create } from 'zustand';
import { cartService } from '../services/supabase/cart';

export const useCartStore = create((set) => ({
  items: [],
  loading: false,
  
  // Sepet sayısını hesapla
  get cartCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Sepeti yükle
  loadCart: async (userId) => {
    if (!userId) {
      set({ items: [] });
      return;
    }

    set({ loading: true });
    try {
      const cartItems = await cartService.getCartItems(userId);
      set({ items: cartItems });
    } catch (error) {
      console.error('Load cart error:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Sepete ürün ekle
  addToCart: async (userId, productId, quantity) => {
    try {
      await cartService.addToCart(userId, productId, quantity);
      const cartItems = await cartService.getCartItems(userId);
      set({ items: cartItems });
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  },

  // Sepetten ürün çıkar
  removeFromCart: async (userId, cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      const cartItems = await cartService.getCartItems(userId);
      set({ items: cartItems });
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  },

  // Ürün miktarını güncelle
  updateQuantity: async (userId, cartItemId, quantity) => {
    try {
      await cartService.updateQuantity(cartItemId, quantity);
      const cartItems = await cartService.getCartItems(userId);
      set({ items: cartItems });
    } catch (error) {
      console.error('Update quantity error:', error);
      throw error;
    }
  },

  // Sepeti temizle
  clearCart: () => {
    set({ items: [] });
  }
})); 