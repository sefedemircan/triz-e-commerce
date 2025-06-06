import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Skeleton,
  Title,
  Text,
  Button,
  Card,
  Image,
  Badge,
  Group,
} from '@mantine/core';
import { productService } from '../../services/supabase/products';
import '../../styles/carousel.css';
import HeroSection from '../../components/Home/HeroSection';
import PopularCategories from '../../components/Home/PopularCategories';
import { cartService } from '../../services/supabase/cart';
import { BestSellers } from '../../components/Home/BestSellers';
import { FeaturedProducts } from '../../components/Home/FeaturedProducts';
import { Brands } from '../../components/Home/Brands';
import { Campaigns } from '../../components/Home/Campaigns';
import { AppFooter } from '../../components/Layout/Footer';

// ProductCard bileşeni
const ProductCard = ({ product }) => (
  <Card 
    shadow="sm" 
    padding={0} 
    radius="md" 
    withBorder={false}
    component={Link}
    to={`/products/${product.id}`}
    sx={(theme) => ({
      backgroundColor: theme.white,
      transition: 'all 200ms ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows.md,
      },
    })}
  >
    <Card.Section>
      <Image
        src={product.image_url}
        height={280}
        alt={product.name}
        styles={{
          image: {
            objectFit: 'cover',
          },
        }}
        fallbackSrc="https://placehold.co/600x400?text=Ürün+Görseli"
      />
    </Card.Section>

    <Box p="md">
      <Text weight={500} size="md" lineClamp={2} mb="md">
        {product.name}
      </Text>
      <Group position="apart" align="center">
        <Text weight={700} size="lg" color="dark">
          {product.price.toLocaleString('tr-TR')} TL
        </Text>
        {product.stock_quantity > 0 ? (
          <Badge variant="filled" color="green.6" size="sm">
            Stokta
          </Badge>
        ) : (
          <Badge variant="filled" color="red.6" size="sm">
            Tükendi
          </Badge>
        )}
      </Group>
    </Box>
  </Card>
);

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        //console.log('Veri yükleniyor...'); // Debug için
        const productsData = await productService.getFeaturedProducts();
        //console.log('Yüklenen veriler:', productsData); // Debug için
        setFeaturedProducts(productsData);
      } catch (error) {
        //console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Skeleton height={400} radius="md" mb="xl" />
        <Grid>
          {[1, 2, 3, 4].map((i) => (
            <Grid.Col key={i} span={3}>
              <Skeleton height={200} radius="md" mb="sm" />
              <Skeleton height={20} width="70%" mb="sm" />
              <Skeleton height={20} width="40%" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <>
      <Box>
        {/* Üst Banner */}
        <Box style={{zIndex: 100}} bg="orange.6" py={8}>
          <Container size="xl">
            <Text align="center" color="white" weight={500}>
              500 TL ve Üzeri Alışverişlerde Kargo Bedava!
            </Text>
          </Container>
        </Box>

        {/* Hero Section - Carousel */}
        <HeroSection />

        {/* Popüler Kategoriler */}
        <PopularCategories />

        {/* Kampanyalar */}
        <Campaigns />
        
        {/* En Çok Satanlar */}
        <BestSellers />

        {/* Öne Çıkan Ürünler */}
        <FeaturedProducts />

        {/* Markalar */}
        <Brands />
      </Box>

      {/* Footer */}
      <AppFooter />
    </>
  );
} 