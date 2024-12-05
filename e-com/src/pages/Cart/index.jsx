import { useEffect, useState } from 'react';
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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';
import { cartService } from '../../services/supabase/cart';
import { useAuthStore } from '../../stores/authStore';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadCartItems();
  }, [user]);

  const loadCartItems = async () => {
    try {
      const items = await cartService.getCartItems(user.id);
      setCartItems(items);
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Sepet yüklenirken bir hata oluştu',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      await cartService.updateQuantity(cartItemId, quantity);
      await loadCartItems();
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
      await cartService.removeFromCart(cartItemId);
      await loadCartItems();
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

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Yükleniyor...</Text>
      </Container>
    );
  }

  if (cartItems.length === 0) {
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
          {cartItems.map((item) => (
            <Card key={item.id} withBorder padding="lg">
              <Group>
                <Image
                  src={item.products.image_url}
                  width={100}
                  height={100}
                  fit="contain"
                  radius="md"
                />
                <Stack spacing="xs" style={{ flex: 1 }}>
                  <Text fw={500} size="lg">
                    {item.products.name}
                  </Text>
                  <Text c="dimmed" size="sm">
                    Birim Fiyat: {item.products.price} TL
                  </Text>
                  <Group>
                    <NumberInput
                      label="Adet"
                      value={item.quantity}
                      onChange={(value) => handleUpdateQuantity(item.id, value)}
                      min={1}
                      max={99}
                      w={120}
                    />
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Kaldır
                    </Button>
                  </Group>
                </Stack>
                <Text fw={700} size="lg">
                  {item.products.price * item.quantity} TL
                </Text>
              </Group>
            </Card>
          ))}
        </Stack>

        <Card withBorder w={300}>
          <Stack spacing="md">
            <Title order={3}>Sipariş Özeti</Title>
            <Divider />
            <Group position="apart">
              <Text>Ara Toplam:</Text>
              <Text fw={700}>{totalAmount} TL</Text>
            </Group>
            <Group position="apart">
              <Text>Kargo:</Text>
              <Text fw={700}>Ücretsiz</Text>
            </Group>
            <Divider />
            <Group position="apart">
              <Text size="lg" fw={700}>
                Toplam:
              </Text>
              <Text size="xl" fw={700}>
                {totalAmount} TL
              </Text>
            </Group>
            <Button size="lg" fullWidth>
              Siparişi Tamamla
            </Button>
          </Stack>
        </Card>
      </Group>
    </Container>
  );
} 