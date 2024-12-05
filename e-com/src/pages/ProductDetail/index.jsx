import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Image,
  Title,
  Text,
  Button,
  Paper,
  Group,
  Badge,
  Skeleton,
  NumberInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { productService } from '../../services/supabase/products.js';
import { cartService } from '../../services/supabase/cart.js';
import { useAuthStore } from '../../stores/authStore';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Ürün yüklenirken hata:', error);
        notifications.show({
          title: 'Hata',
          message: 'Ürün yüklenirken bir hata oluştu',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      notifications.show({
        title: 'Uyarı',
        message: 'Sepete eklemek için giriş yapmalısınız',
        color: 'yellow',
      });
      return;
    }

    try {
      console.log('Adding to cart:', { userId: user.id, productId: product.id, quantity });
      await cartService.addToCart(user.id, product.id, quantity);
      notifications.show({
        title: 'Başarılı',
        message: 'Ürün sepete eklendi!',
        color: 'green',
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      notifications.show({
        title: 'Hata',
        message: 'Ürün sepete eklenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Skeleton height={400} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Skeleton height={50} width="70%" mb="xl" />
            <Skeleton height={24} width="40%" mb="md" />
            <Skeleton height={100} mb="xl" />
            <Skeleton height={36} width="30%" />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container size="xl" py="xl">
        <Text>Ürün bulunamadı</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper radius="md" p="md">
            <Image
              src={product.image_url}
              alt={product.name}
              radius="md"
              fit="contain"
              h={400}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={1} mb="md">
            {product.name}
          </Title>
          <Group mb="xl">
            <Badge size="xl" variant="filled">
              {product.price} TL
            </Badge>
            <Badge 
              size="xl" 
              color={product.stock_quantity > 0 ? 'green' : 'red'}
            >
              {product.stock_quantity > 0 ? 'Stokta' : 'Stokta Yok'}
            </Badge>
          </Group>
          <Text size="lg" mb="xl">
            {product.description}
          </Text>
          {product.stock_quantity > 0 && (
            <>
              <Group mb="xl">
                <NumberInput
                  label="Adet"
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={product.stock_quantity}
                  w={120}
                />
              </Group>
              <Button size="lg" onClick={handleAddToCart}>
                Sepete Ekle
              </Button>
            </>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
} 