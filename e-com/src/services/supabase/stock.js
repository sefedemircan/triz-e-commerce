import { supabase } from './client';

export const stockService = {
  // Stok seviyesi kontrolü
  checkStockLevel: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity, name')
        .eq('id', productId)
        .single();

      if (error) throw error;

      // Kritik stok seviyesi kontrolü (örneğin 5 adet)
      if (data.stock_quantity <= 5) {
        return {
          isLow: true,
          message: `${data.name} ürününün stok seviyesi kritik (${data.stock_quantity} adet kaldı)`
        };
      }

      return {
        isLow: false,
        currentStock: data.stock_quantity
      };
    } catch (error) {
      console.error('Stok kontrol hatası:', error);
      throw error;
    }
  },

  // Stok hareketi ekleme
  addStockMovement: async (productId, quantity, type, note = '') => {
    try {
      // Stok hareketi ekle
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          product_id: productId,
          quantity: quantity,
          movement_type: type, // 'in' veya 'out'
          note: note
        });

      if (movementError) throw movementError;

      // Ürün stok miktarını güncelle
      const operator = type === 'in' ? '+' : '-';
      const { error: updateError } = await supabase
        .rpc('update_product_stock', {
          p_id: productId,
          qty: quantity,
          operator: operator
        });

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Stok hareketi ekleme hatası:', error);
      throw error;
    }
  },

  // Stok geçmişi getirme
  getStockHistory: async (productId, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products (
            name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Stok geçmişi getirme hatası:', error);
      throw error;
    }
  },

  // Düşük stoklu ürünleri getirme
  getLowStockProducts: async (threshold = 5) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          stock_quantity,
          categories (
            name
          )
        `)
        .lte('stock_quantity', threshold)
        .order('stock_quantity', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Düşük stoklu ürünleri getirme hatası:', error);
      throw error;
    }
  },

  // Stok düzeltme işlemi
  adjustStock: async (productId, newQuantity, note) => {
    try {
      const { data: currentStock } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();

      const difference = newQuantity - currentStock.stock_quantity;
      const movementType = difference >= 0 ? 'adjustment_in' : 'adjustment_out';

      // Stok hareketi ekle
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          product_id: productId,
          quantity: Math.abs(difference),
          movement_type: movementType,
          note: note || 'Stok düzeltme'
        });

      if (movementError) throw movementError;

      // Ürün stok miktarını güncelle
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', productId);

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Stok düzeltme hatası:', error);
      throw error;
    }
  }
}; 