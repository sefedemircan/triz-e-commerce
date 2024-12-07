import { supabase } from './client';

export const productService = {
  getFeaturedProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true);

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

  getProducts: async ({ search, category, sort, minPrice, maxPrice, page = 1, limit = 12 }) => {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // Arama filtresi
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      // Kategori filtresi
      if (category) {
        query = query.eq('category_id', category);
      }

      // Fiyat aralığı filtresi
      if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
      }
      if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
      }

      // Sıralama
      switch (sort) {
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

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('getProducts error:', error);
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

      console.log('Found category:', category);

      if (!category) {
        throw new Error('Category not found');
      }

      let query = supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id);

      const { data: products, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Found products:', products);

      return {
        data: products,
        totalPages: 1
      };
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }
}; 