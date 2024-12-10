import { useEffect, useState } from 'react';
import { productService } from '../../services/supabase/products';
import { Container, Title, Box, Skeleton, Badge, Group } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { ProductCard } from '../ProductCard';

export function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const data = await productService.getBestSellers();
        setBestSellers(data);
      } catch (error) {
        console.error('En çok satanlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBestSellers();
  }, []);

  if (loading) return <Skeleton height={400} radius="md" />;

  return (
    <Container size="xl" py={40}>
      <Group position="apart" mb={30}>
        <Group spacing="xs">
          <Title order={2} size="h3" weight={600}>
            En Çok Satanlar
          </Title>
          <Badge variant="dot" color="orange" size="lg">
            Popüler
          </Badge>
        </Group>
      </Group>
      
      <Carousel
        slideSize={{ base: '100%', sm: '50%', md: '33.333333%', lg: '25%' }}
        slideGap="md"
        align="start"
        slidesToScroll={1}
        withControls
        loop={false}
        containScroll="keepSnaps"
        controlsOffset="xl"
        styles={{
          root: {
            width: '100%'
          },
          control: {
            opacity: 1,
            backgroundColor: 'white',
            border: '1px solid #eee',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            width: 40,
            height: 40,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'scale(1.05)',
            },
            '&:disabled': {
              opacity: 0,
              cursor: 'default',
              pointerEvents: 'none'
            }
          },
          viewport: {
            padding: '10px 0',
          }
        }}
      >
        {bestSellers.map((product) => (
          <Carousel.Slide key={product.id}>
            <ProductCard product={product} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  );
} 