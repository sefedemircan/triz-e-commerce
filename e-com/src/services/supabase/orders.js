import { supabase } from './client';

export const orderService = {
  async createOrder(userId, items, shippingAddress) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          status: 'pending',
          shipping_address: shippingAddress,
          total_amount: items.reduce((sum, item) => 
            sum + (item.product.price * item.quantity), 0)
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Sepeti temizle
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    return order;
  },

  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderDetails(orderId, userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            image_url,
            description
          )
        )
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}; 