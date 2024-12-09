import { useEffect, useState } from 'react';
import { Container, Title, Box, Skeleton, Group, Badge } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { ProductCard } from '../ProductCard';
import { productService } from '../../services/supabase/products';

export function Campaigns() {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDiscountedProducts = async () => {
      try {
        const data = await productService.getDiscountedProducts();
        setDiscountedProducts(data);
      } catch (error) {
        console.error('İndirimli ürünler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDiscountedProducts();
  }, []);

  if (loading) return <Skeleton height={400} radius="md" />;

  if (discountedProducts.length === 0) return null;

  return (
    <Box py={40} bg="gray.0">
      <Container size="xl">
        <Group position="apart" mb={30}>
          <Group spacing="xs">
            <Title order={2} size="h3" weight={600}>
              Kampanyalar & Fırsatlar
            </Title>
            <Badge variant="dot" color="orange" size="lg">
              İndirimli
            </Badge>
          </Group>
        </Group>

        <Carousel
          slideSize={{ base: '100%', sm: '50%', md: '33.333333%', lg: '25%' }}
          slideGap="md"
          align="start"
          slidesToScroll={1}
        >
          {discountedProducts.map((product) => (
            <Carousel.Slide key={product.id}>
              <ProductCard product={product} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
} 