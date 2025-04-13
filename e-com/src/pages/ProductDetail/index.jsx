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
  Tabs,
  List,
  Divider,
  Card,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTruck, IconShield, IconRefresh, IconCreditCard } from '@tabler/icons-react';
import { productService } from '../../services/supabase/products.js';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { Reviews } from '../../components/Reviews';
import { useTranslation } from 'react-i18next';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const productData = await productService.getById(id);
        setProduct(productData);
        
        // İlgili ürünleri yükle
        if (productData) {
          const related = await productService.getRelatedProducts(productData.category_id, id);
          setRelatedProducts(related);
        }
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

    loadData();
    window.scrollTo(0, 0); // Sayfa yüklendiğinde en üste scroll
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
      await addToCart(user.id, product.id, quantity);
      notifications.show({
        title: 'Başarılı',
        message: 'Ürün sepete eklendi',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Hata',
        message: 'Ürün sepete eklenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const features = [
    {
      icon: IconTruck,
      title: 'Ücretsiz Kargo',
      description: '150 TL ve üzeri alışverişlerde kargo bedava!'
    },
    {
      icon: IconShield,
      title: 'Güvenli Alışveriş',
      description: '%100 güvenli ödeme sistemi'
    },
    {
      icon: IconRefresh,
      title: 'Kolay İade',
      description: '14 gün içinde ücretsiz iade'
    },
    {
      icon: IconCreditCard,
      title: 'Taksit İmkanı',
      description: '9 taksit seçeneği'
    }
  ];

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Skeleton height={500} radius="md" />
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
      <Grid gutter="xl">
        {/* Sol Kolon - Ürün Görseli */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper radius="md" p="md">
            <Image
              src={product.image_url}
              alt={product.name}
              radius="md"
              fit="contain"
              h={500}
            />
          </Paper>
        </Grid.Col>

        {/* Sağ Kolon - Ürün Detayları */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <div>
            {/* Kategori */}
            <Text c="dimmed" mb="xs">
              {product.category_name || 'Kategori'}
            </Text>

            {/* Ürün Adı */}
            <Title order={1} mb="md">
              {product.name}
            </Title>

            {/* Fiyat ve Stok Durumu */}
            <Group mb="xl">
              <div>
                <Text size="xl" fw={700} color="orange">
                  {product.price.toLocaleString('tr-TR')} TL
                </Text>
                {product.original_price && product.original_price > product.price && (
                  <Group align="center" spacing="xs">
                    <Text size="sm" td="line-through" c="dimmed">
                      {product.original_price.toLocaleString('tr-TR')} TL
                    </Text>
                    <Badge color="red">
                      %{Math.round((1 - product.price / product.original_price) * 100)} İndirim
                    </Badge>
                  </Group>
                )}
              </div>
              <Badge 
                size="lg" 
                color={product.stock_quantity > 0 ? 'green' : 'red'}
              >
                {product.stock_quantity > 0 ? 'Stokta' : 'Stokta Yok'}
              </Badge>
            </Group>

            {/* Kısa Açıklama */}
            <Text size="md" mb="xl" c="dimmed">
              {product.short_description || product.description}
            </Text>

            <Divider my="xl" />

            {/* Miktar Seçimi ve Sepete Ekle */}
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
                <Button 
                  size="lg" 
                  onClick={handleAddToCart}
                  fullWidth
                  color="orange"
                >
                  {t('productDetail.addToCart')}
                </Button>
              </>
            )}

            <Divider my="xl" />

            {/* Özellikler */}
            <SimpleGrid cols={2} spacing="lg">
              {features.map((feature) => (
                <Group key={feature.title} spacing="sm">
                  <feature.icon size={24} />
                  <div>
                    <Text size="sm" fw={500}>{feature.title}</Text>
                    <Text size="xs" c="dimmed">{feature.description}</Text>
                  </div>
                </Group>
              ))}
            </SimpleGrid>
          </div>
        </Grid.Col>
      </Grid>

      {/* Detaylı Bilgiler */}
      <Paper withBorder radius="md" p="xl" mt={50}>
        <Tabs defaultValue="description">
          <Tabs.List>
            <Tabs.Tab value="description">Ürün Açıklaması</Tabs.Tab>
            <Tabs.Tab value="specs">Özellikler</Tabs.Tab>
            <Tabs.Tab value="shipping">Kargo ve İade</Tabs.Tab>
            <Tabs.Tab value="reviews">Yorumlar</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="description" pt="xl">
            <Text>{product.description}</Text>
          </Tabs.Panel>

          <Tabs.Panel value="specs" pt="xl">
            <List spacing="md">
              {product.specifications?.map((spec, index) => (
                <List.Item key={index}>
                  <Text fw={500}>{spec.title}</Text>
                  <Text c="dimmed">{spec.value}</Text>
                </List.Item>
              ))}
            </List>
          </Tabs.Panel>

          <Tabs.Panel value="shipping" pt="xl">
            <Text mb="md">Kargo Bilgileri:</Text>
            <List>
              <List.Item>150 TL ve üzeri alışverişlerde kargo ücretsiz</List.Item>
              <List.Item>2-4 iş günü içinde kargoya verilir</List.Item>
              <List.Item>Tüm Türkiye&apos;ye gönderim yapılmaktadır</List.Item>
            </List>
            
            <Text mt="xl" mb="md">İade Koşulları:</Text>
            <List>
              <List.Item>14 gün içinde ücretsiz iade</List.Item>
              <List.Item>Orijinal ambalajında olmalıdır</List.Item>
              <List.Item>Kullanılmamış ve hasarsız olmalıdır</List.Item>
            </List>
          </Tabs.Panel>

          <Tabs.Panel value="reviews" pt="xl">
            <Reviews productId={product.id} />
          </Tabs.Panel>
        </Tabs>
      </Paper>

      {/* Benzer Ürünler */}
      {relatedProducts.length > 0 && (
        <Box mt={50}>
          <Title order={2} mb="xl">Benzer Ürünler</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} p="md" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={relatedProduct.image_url}
                    height={200}
                    alt={relatedProduct.name}
                  />
                </Card.Section>
                <Text weight={500} mt="md" lineClamp={2}>
                  {relatedProduct.name}
                </Text>
                <Text size="xl" weight={700} mt="md">
                  {relatedProduct.price.toLocaleString('tr-TR')} TL
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Container>
  );
} 