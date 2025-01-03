import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Grid, Text, Stack } from '@mantine/core';
import { productService } from '../services/supabase/products';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { slug, subSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Önce kategoriyi al
        const categoryData = await productService.getCategoryBySlug(subSlug || slug);
        setCategory(categoryData);

        if (categoryData) {
          // Kategoriye ait ürünleri al
          const { data: productsData } = await productService.getProductsByCategory(
            subSlug || slug
          );
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Kategori ürünleri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, subSlug]);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Yükleniyor...</Text>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container size="xl" py="xl">
        <Text>Kategori bulunamadı.</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Title order={1}>{category.name}</Title>
        
        {products.length === 0 ? (
          <Text>Bu kategoride ürün bulunamadı.</Text>
        ) : (
          <Grid>
            {products.map((product) => (
              <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <ProductCard product={product} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
} 