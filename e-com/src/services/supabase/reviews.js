import { supabase } from './client';

// Ürün yorumlarını getir
export const getProductReviews = async (productId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      updated_at,
      is_verified_purchase,
      user_id
    `)
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Yorumlar getirilirken hata:', error);
    throw error;
  }

  // Kullanıcı bilgilerini ayrı bir sorgu ile al
  const reviewsWithUserInfo = await Promise.all(
    data.map(async (review) => {
      const { data: userData } = await supabase
        .from('auth_users_view')
        .select('email')
        .eq('id', review.user_id)
        .single();

      return {
        ...review,
        user: userData
      };
    })
  );

  return reviewsWithUserInfo;
};

// Yorum ekle
export const addReview = async ({ productId, userId, rating, comment }) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        product_id: productId,
        user_id: userId,
        rating,
        comment,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error('Yorum eklenirken hata:', error);
    throw error;
  }

  // Kullanıcı bilgisini al
  const { data: userData } = await supabase
    .from('auth_users_view')
    .select('email')
    .eq('id', userId)
    .single();

  return [{
    ...data[0],
    user: userData
  }];
};

// Yorumu güncelle
export const updateReview = async ({ reviewId, rating, comment }) => {
  const { data, error } = await supabase
    .from('reviews')
    .update({
      rating,
      comment,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .select();

  if (error) {
    console.error('Yorum güncellenirken hata:', error);
    throw error;
  }

  // Kullanıcı bilgisini al
  const { data: userData } = await supabase
    .from('auth_users_view')
    .select('email')
    .eq('id', data[0].user_id)
    .single();

  return [{
    ...data[0],
    user: userData
  }];
};

// Yorumu sil
export const deleteReview = async (reviewId) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Yorum silinirken hata:', error);
    throw error;
  }
  return true;
};

// Ürünün ortalama puanını getir
export const getProductAverageRating = async (productId) => {
  const { data, error } = await supabase
    .rpc('get_product_average_rating', { product_id: productId });

  if (error) {
    console.error('Ortalama puan hesaplanırken hata:', error);
    throw error;
  }

  return data || 0;
}; 