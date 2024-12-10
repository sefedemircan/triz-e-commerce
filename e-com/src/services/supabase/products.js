import { supabase } from './client';

const searchProducts = async (query) => {
  try {
    // Ana ürün araması
    const { data: productResults, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (productError) throw productError;

    // Kategori adına göre arama
    const { data: categoryResults, error: categoryError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (
          id,
          name,
          slug
        )
      `)
      .ilike('categories.name', `%${query}%`)
      .order('created_at', { ascending: false });

    if (categoryError) throw categoryError;

    // Sonuçları birleştir ve tekrar edenleri kaldır
    const allResults = [...productResults, ...categoryResults];
    const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());

    return uniqueResults;
  } catch (error) {
    console.error('Ürün arama hatası:', error);
    throw error;
  }
};

export const productService = {
  getFeaturedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getFeaturedProducts error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getById error:', error);
      throw error;
    }
  },

  getRelatedProducts: async (categoryId, currentProductId, limit = 4) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('getRelatedProducts error:', error);
      throw error;
    }
  },

  getProducts: async (filters = {}) => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug
          )
        `);

      // Fiyat filtresi
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      // Sıralama
      if (filters.sort) {
        switch (filters.sort) {
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'name-asc':
            query = query.order('name', { ascending: true });
            break;
          case 'name-desc':
            query = query.order('name', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, totalPages: 1 };
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  getCategoryBySlug: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .ilike('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get category error:', error);
      throw error;
    }
  },

  getProductsByCategory: async (categorySlug, filters = {}) => {
    try {
      console.log('Fetching products for category:', categorySlug);

      // Önce kategoriyi kontrol edelim
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (!category) {
        throw new Error('Category not found');
      }

      let query = supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id);

      // Fiyat filtresi
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      // Sıralama
      if (filters.sort) {
        switch (filters.sort) {
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'name-asc':
            query = query.order('name', { ascending: true });
            break;
          case 'name-desc':
            query = query.order('name', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
      }

      const { data: products, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return {
        data: products,
        totalPages: 1
      };
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock_quantity: productData.stock_quantity,
          category_id: productData.category_id,
          image_url: productData.image_url,
          ...(productData.original_price && { original_price: productData.original_price })
        }])
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          original_price: productData.original_price || null,
          stock_quantity: productData.stock_quantity,
          category_id: productData.category_id,
          image_url: productData.image_url
        })
        .eq('id', productId)
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update product error:', error);
      throw new Error('Ürün güncellenirken bir hata oluştu: ' + error.message);
    }
  },

  async getBestSellers() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        ),
        order_items (
          count
        )
      `)
      .order('sold_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  },

  async getDiscountedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .not('original_price', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  },

  async updateProductStats(productId, quantity, isRefund = false) {
    try {
      console.log('Updating product stats:', {
        productId,
        quantity,
        isRefund
      });

      const { error } = await supabase.rpc('update_product_stats', {
        p_id: productId,
        qty: quantity,
        stock_operator: isRefund ? '+' : '-',
        sold_operator: isRefund ? '-' : '+'
      });

      if (error) {
        console.error('Update product stats error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Update product stats error:', error);
      throw error;
    }
  },

  getBestSellers: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .order('sold_count', { ascending: false })
        .limit(8);

      if (error) throw error;

      // Aynı ürünleri birleştir ve satış sayılarını topla
      const consolidatedData = data.reduce((acc, current) => {
        const existingProduct = acc.find(item => item.id === current.id);
        
        if (existingProduct) {
          // Eğer ürün zaten varsa satış sayısını güncelle
          existingProduct.sold_count += current.sold_count;
        } else {
          // Yeni ürünü ekle
          acc.push(current);
        }
        
        return acc;
      }, []);

      // Satış sayısına göre tekrar sırala
      consolidatedData.sort((a, b) => b.sold_count - a.sold_count);

      return consolidatedData;
    } catch (error) {
      console.error('getBestSellers error:', error);
      throw error;
    }
  },

  getDiscountedProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .not('original_price', 'is', null)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw error;
    return data;
  },

  searchProducts
}; 