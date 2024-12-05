import { useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Group,
  Text,
  Button,
  Image,
  NumberInput,
  Stack,
  Divider,
  Card,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

export default function Cart() {
  const { user } = useAuthStore();
  const { 
    items, 
    loading, 
    loadCart, 
    removeFromCart, 
    updateQuantity 
  } = useCartStore();

  useEffect(() => {
    if (user) {
      loadCart(user.id);
    }
  }, [user, loadCart]);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      await updateQuantity(user.id, cartItemId, quantity);
      notifications.show({
        title: 'Başarılı',
        message: 'Ürün adedi güncellendi',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Ürün adedi güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(user.id, cartItemId);
      notifications.show({
        title: 'Başarılı',
        message: 'Ürün sepetten kaldırıldı',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Ürün kaldırılırken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.products.price * item.quantity),
    0
  ).toFixed(2);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Yükleniyor...</Text>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" spacing="md">
            <Title order={2}>Sepetiniz Boş</Title>
            <Text c="dimmed">Sepetinizde henüz ürün bulunmuyor.</Text>
            <Button component={Link} to="/products" variant="light">
              Alışverişe Başla
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Sepetim
      </Title>

      <Group align="flex-start" grow>
        <Stack spacing="md">
          {items.map((item) => (
            <Card key={item.id} withBorder padding="lg">
              <Group align="start" noWrap>
                <Box w={120}>
                  <Image
                    src={item.products.image_url}
                    width={120}
                    height={120}
                    fit="cover"
                    radius="md"
                    sx={{ 
                      minWidth: 120,
                      border: '1px solid #eee',
                      backgroundColor: '#f9f9f9'
                    }}
                  />
                </Box>
                <Stack spacing="xs" style={{ flex: 1 }}>
                  <Text fw={500} size="lg" lineClamp={2}>
                    {item.products.name}
                  </Text>
                  <Text c="dimmed" size="sm">
                    Birim Fiyat: {item.products.price.toLocaleString('tr-TR')} TL
                  </Text>
                  <Group>
                    <NumberInput
                      label="Adet"
                      value={item.quantity}
                      onChange={(value) => handleUpdateQuantity(item.id, value)}
                      min={1}
                      max={99}
                      w={120}
                      size="sm"
                    />
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => handleRemoveItem(item.id)}
                      size="sm"
                    >
                      Kaldır
                    </Button>
                  </Group>
                </Stack>
                <Text fw={700} size="lg" style={{ whiteSpace: 'nowrap' }}>
                  {(item.products.price * item.quantity).toLocaleString('tr-TR')} TL
                </Text>
              </Group>
            </Card>
          ))}
        </Stack>

        <Card withBorder w={300}>
          <Stack spacing="sm">
            <Text size="lg" weight={500}>
              Sipariş Özeti
            </Text>
            <Divider />
            <Group position="apart">
              <Text>Ara Toplam</Text>
              <Text weight={500}>{Number(totalAmount).toLocaleString('tr-TR')} TL</Text>
            </Group>
            <Group position="apart" color="green">
              <Text>Kargo</Text>
              <Text weight={500} color="green">Ücretsiz</Text>
            </Group>
            <Divider />
            <Group position="apart">
              <Text weight={500}>Toplam</Text>
              <Text size="xl" weight={700} color="dark">
                {Number(totalAmount).toLocaleString('tr-TR')} TL
              </Text>
            </Group>
            <Button variant="filled" color="orange" size="md" fullWidth>
              Ödemeye Geç
            </Button>
          </Stack>
        </Card>
      </Group>
    </Container>
  );
} 