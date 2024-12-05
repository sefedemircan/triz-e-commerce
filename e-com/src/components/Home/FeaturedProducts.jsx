import { Container, Title, Box } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import ProductCard from '../ProductCard';

// Örnek ürün verileri
const featuredProducts = [
  {
    id: 1,
    name: 'Premium Deri Ceket',
    price: 2499.99,
    original_price: 3499.99,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    categories: { name: 'Dış Giyim' },
    stock_quantity: 10
  },
  {
    id: 2,
    name: 'Vintage Kot Pantolon',
    price: 899.99,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
    categories: { name: 'Pantolon' },
    stock_quantity: 15
  },
  {
    id: 3,
    name: 'Özel Tasarım Çanta',
    price: 1299.99,
    original_price: 1799.99,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    categories: { name: 'Aksesuar' },
    stock_quantity: 5
  },
  {
    id: 4,
    name: 'Spor Ayakkabı',
    price: 1599.99,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    categories: { name: 'Ayakkabı' },
    stock_quantity: 8
  }
];

export function FeaturedProducts() {
  return (
    <Box py={40} bg="gray.0">
      <Container size="xl">
        <Title order={2} mb={30}>
          Öne Çıkan Ürünler
        </Title>

        <Carousel
          slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
          slideGap="lg"
          align="start"
          slidesToScroll={1}
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