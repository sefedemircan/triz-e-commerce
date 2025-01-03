import { supabase } from './client';
import { productService } from './products';

export const orderService = {
  // Admin için tüm siparişleri getir
  getAllOrders: async () => {
    try {
      // Önce siparişleri ve ürün bilgilerini çekelim
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product_id,
            products (
              id,
              name,
              image_url,
              stock_quantity
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Kullanıcı e-postalarını auth.users tablosundan çekelim
      const userIds = [...new Set(ordersData.map(order => order.user_id))];
      const { data: usersData, error: usersError } = await supabase
        .from('auth_users_view')
        .select('id, email')
        .in('id', userIds);

      if (usersError) {
        console.error('Kullanıcı bilgileri çekilemedi:', usersError);
      }

      // Profil bilgilerini çekelim
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .in('id', userIds);

      if (profilesError) {
        console.error('Profil bilgileri çekilemedi:', profilesError);
      }

      // Tüm verileri birleştirelim
      const ordersWithDetails = ordersData.map(order => ({
        ...order,
        profiles: {
          ...(profilesData?.find(profile => profile.id === order.user_id) || {}),
          email: usersData?.find(user => user.id === order.user_id)?.email
        }
      }));

      return ordersWithDetails;
    } catch (error) {
      console.error('getAllOrders error:', error);
      throw error;
    }
  },

  // Normal kullanıcı için siparişleri getir
  getOrders: async (userId) => {
    if (!userId) throw new Error('User ID is required');

    try {
      // Önce siparişleri ve ürün bilgilerini çekelim
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product_id,
            products (
              id,
              name,
              image_url,
              stock_quantity
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Kullanıcı e-postalarını auth.users tablosundan çekelim
      const { data: usersData, error: usersError } = await supabase
        .from('auth_users_view')
        .select('id, email')
        .eq('id', userId)
        .single();

      if (usersError) {
        console.error('Kullanıcı bilgileri çekilemedi:', usersError);
      }

      // Profil bilgilerini çekelim
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profil bilgileri çekilemedi:', profileError);
      }

      // Tüm verileri birleştirelim
      const ordersWithDetails = ordersData.map(order => ({
        ...order,
        profiles: {
          ...(profileData || {}),
          email: usersData?.email
        }
      }));

      return ordersWithDetails;
    } catch (error) {
      console.error('getOrders error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      console.log('Updating order status:', { orderId, status });

      const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Update successful:', updateData);

      // Güncellenmiş siparişi tüm detaylarıyla çek
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product_id,
            products (
              id,
              name,
              image_url,
              stock_quantity
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (ordersError) {
        console.error('Fetch error:', ordersError);
        throw ordersError;
      }

      // Kullanıcı bilgilerini çek
      const { data: userData, error: userError } = await supabase
        .from('auth_users_view')
        .select('id, email')
        .eq('id', ordersData.user_id)
        .single();

      if (userError) {
        console.error('Kullanıcı bilgileri çekilemedi:', userError);
      }

      // Profil bilgilerini çek
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', ordersData.user_id)
        .single();

      if (profileError) {
        console.error('Profil bilgileri çekilemedi:', profileError);
      }

      // Tüm verileri birleştir
      const updatedOrder = {
        ...ordersData,
        profiles: {
          ...(profileData || {}),
          email: userData?.email
        }
      };

      return updatedOrder;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      console.log('Creating order with data:', orderData);

      // Sipariş verilerini hazırla
      const orderPayload = {
        user_id: orderData.userId,
        status: 'pending',
        shipping_address: orderData.shippingAddress,
        payment_method: orderData.paymentMethod,
        total_amount: orderData.totalAmount,
        shipping_cost: orderData.shippingCost || 0,
        discount: orderData.discount || 0,
        final_amount: orderData.finalAmount
      };

      // Siparişi oluştur
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      console.log('Order created:', order);

      try {
        // Sipariş detaylarını ekle
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.products.id,
          quantity: item.quantity,
          price: item.products.price
        }));

        console.log('Creating order items:', orderItems);

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Order items creation error:', itemsError);
          throw itemsError;
        }

        // Ürün stoklarını güncelle
        for (const item of orderData.items) {
          await productService.updateProductStats(
            item.products.id,
            item.quantity
          );
        }

        return order;
      } catch (error) {
        // Hata durumunda siparişi iptal et
        console.error('Error during order items creation:', error);
        const { error: deleteError } = await supabase
          .from('orders')
          .delete()
          .eq('id', order.id);

        if (deleteError) {
          console.error('Error deleting failed order:', deleteError);
        }

        throw error;
      }
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }
}; 