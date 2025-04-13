import { Container, Title, Box, Group, Badge, Skeleton } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { ProductCard } from '../ProductCard';
import { useState, useEffect } from 'react';
import { productService } from '../../services/supabase/products';
import { useTranslation } from 'react-i18next';

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        //console.log('Featured Products:', data);
        setFeaturedProducts(data);
      } catch (error) {
        //console.error('Öne çıkan ürünler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  if (loading || featuredProducts.length === 0) return null;

  return (
    <Box py={40} bg="gray.0">
      <Container size="xl">
        <Group position="apart" mb={30}>
          <Group spacing="xs">
            <Title order={2} size="h3" weight={600}>
              {t('homePage.featuredProducts.title')}
            </Title>
            <Badge variant="dot" color="orange" size="lg">
              {t('homePage.featuredProducts.selected')}
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
          {featuredProducts.map((product) => (
            <Carousel.Slide key={product.id}>
              <ProductCard product={product} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
} 