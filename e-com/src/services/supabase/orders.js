import { supabase } from './client';

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          status: 'pending',
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod,
          total_amount: orderData.totalAmount,
          shipping_cost: orderData.shippingCost || 0,
          discount: orderData.discount || 0,
          final_amount: orderData.finalAmount,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price: item.products.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      console.error('createOrder error:', error);
      throw error;
    }
  },

  getOrders: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getOrders error:', error);
      throw error;
    }
  },

  getOrder: async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getOrder error:', error);
      throw error;
    }
  }
}; 