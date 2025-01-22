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
export async function addReview(review) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([review])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Ürüne ait yorumları getir
export async function getReviews(productId) {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      updated_at,
      is_approved,
      is_verified_purchase,
      user_id,
      product_id,
      auth_users_view!user_id (
        id,
        email,
        created_at,
        role
      ),
      products!product_id (
        id,
        name
      )
    `)
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Tüm yorumları getir (admin için)
export async function getAllReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      updated_at,
      is_approved,
      is_verified_purchase,
      user_id,
      product_id,
      auth_users_view!user_id (
        id,
        email,
        created_at,
        role
      ),
      products!product_id (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Yorumu güncelle
export async function updateReview(reviewId, updates) {
  try {
    // Sadece güncelleme işlemi
    const { error: updateError } = await supabase
      .from('reviews')
      .update({
        is_approved: updates.is_approved,
        updated_at: updates.updated_at
      })
      .eq('id', reviewId);

    if (updateError) {
      console.error('Yorum güncellenirken hata:', updateError);
      throw updateError;
    }

    // Güncellenmiş veriyi ayrı bir sorgu ile al
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        updated_at,
        is_approved,
        is_verified_purchase,
        user_id,
        product_id,
        auth_users_view!user_id (
          id,
          email,
          created_at,
          role
        ),
        products!product_id (
          id,
          name
        )
      `)
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      console.error('Güncellenmiş yorum getirilirken hata:', fetchError);
      throw fetchError;
    }

    return review;
  } catch (error) {
    console.error('Yorum güncellenirken hata:', error);
    throw error;
  }
}

// Yorumu sil
export async function deleteReview(reviewId) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) throw error;
}

// Ürünün ortalama puanını getir
export async function getAverageRating(productId) {
  const { data, error } = await supabase
    .rpc("calculate_average_rating", { product_id: productId });

  if (error) throw error;
  return data || 0;
} 