import { supabase } from './client';

export const cartService = {
  async getCartItems(userId) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async addToCart(userId, productId, quantity = 1) {
    try {
      // Önce mevcut ürünü kontrol et
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        // Ürün zaten sepette varsa miktarı güncelle
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + quantity 
          })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Yeni ürün ekle
        const { error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: userId,
            product_id: productId,
            quantity
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  },

  async updateQuantity(cartItemId, quantity) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (error) throw error;
  },

  async removeFromCart(cartItemId) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;
  },

  clearCart: async (userId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('clearCart error:', error);
      throw error;
    }
  },
}; 