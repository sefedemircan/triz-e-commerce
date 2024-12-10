import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Title, Text, Grid, Skeleton } from '@mantine/core';
import { productService } from '../../services/supabase/products';
import { ProductCard } from '../../components/ProductCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      setLoading(true);
      try {
        const results = await productService.searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error('Arama hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchProducts();
    }
  }, [query]);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Grid>
          {[1, 2, 3, 4].map((i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton height={400} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">
        "{query}" için arama sonuçları
      </Title>

      {products.length === 0 ? (
        <Text size="lg" color="dimmed">
          Aramanızla eşleşen ürün bulunamadı.
        </Text>
      ) : (
        <Grid>
          {products.map((product) => (
            <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
} 