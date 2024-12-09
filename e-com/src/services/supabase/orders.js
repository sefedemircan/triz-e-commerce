import { supabase } from './client';

export const orderService = {
  getOrders: async () => {
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
      const { data: usersData, error: usersError } = await supabase
        .from('auth_users_view')
        .select('id, email')
        .in('id', ordersData.map(order => order.user_id));

      if (usersError) {
        console.error('Kullanıcı bilgileri çekilemedi:', usersError);
      }

      // Profil bilgilerini çekelim
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', ordersData.map(order => order.user_id));

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
      console.error('getOrders error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      console.log('Updating order status:', { orderId, status }); // Debug log

      const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select() // Güncellenen veriyi hemen alalım
        .single();

      if (updateError) {
        console.error('Update error:', updateError); // Debug log
        throw updateError;
      }

      console.log('Update successful:', updateData); // Debug log

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
        console.error('Fetch error:', ordersError); // Debug log
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
        .select('id, full_name')
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
  }
}; 