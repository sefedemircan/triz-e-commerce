import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Tabs,
  Paper,
  Text,
  Stack,
  Group,
  Badge,
  Card,
  Button,
  Grid,
  TextInput,
  PasswordInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { orderService } from '../../services/supabase/orders';
import { useAuthStore } from '../../stores/authStore';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const form = useForm({
    initialValues: {
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçersiz email'),
      newPassword: (value) => 
        value && value.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Şifreler eşleşmiyor' : null,
    },
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Siparişler yüklenirken bir hata oluştu',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      // Profil güncelleme işlemleri burada yapılacak
      notifications.show({
        title: 'Başarılı',
        message: 'Profiliniz güncellendi',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: error.message,
        color: 'red',
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      processing: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Hesabım
      </Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="orders">Siparişlerim</Tabs.Tab>
          <Tabs.Tab value="settings">Hesap Ayarları</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="orders">
          {loading ? (
            <Text>Yükleniyor...</Text>
          ) : orders.length === 0 ? (
            <Paper p="xl" withBorder>
              <Text ta="center">Henüz siparişiniz bulunmuyor.</Text>
            </Paper>
          ) : (
            <Stack spacing="md">
              {orders.map((order) => (
                <Card key={order.id} withBorder>
                  <Group position="apart" mb="md">
                    <div>
                      <Text size="sm" c="dimmed">
                        Sipariş No: {order.id}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Tarih: {new Date(order.created_at).toLocaleDateString()}
                      </Text>
                    </div>
                    <Badge color={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </Group>

                  <Stack spacing="xs">
                    {order.order_items.map((item) => (
                      <Group key={item.id} position="apart">
                        <Text>{item.products.name}</Text>
                        <Text>
                          {item.quantity} x {item.price} TL
                        </Text>
                      </Group>
                    ))}
                  </Stack>

                  <Group position="apart" mt="md">
                    <Text fw={700}>Toplam:</Text>
                    <Text fw={700}>{order.total_amount} TL</Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="settings">
          <Paper withBorder p="xl">
            <form onSubmit={form.onSubmit(handleUpdateProfile)}>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Email"
                    {...form.getInputProps('email')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Title order={4} mt="xl" mb="md">
                    Şifre Değiştir
                  </Title>
                </Grid.Col>
                <Grid.Col span={6}>
                  <PasswordInput
                    label="Mevcut Şifre"
                    {...form.getInputProps('currentPassword')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <PasswordInput
                    label="Yeni Şifre"
                    {...form.getInputProps('newPassword')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <PasswordInput
                    label="Yeni Şifre Tekrar"
                    {...form.getInputProps('confirmPassword')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Group position="right" mt="xl">
                    <Button type="submit">Değişiklikleri Kaydet</Button>
                  </Group>
                </Grid.Col>
              </Grid>
            </form>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
} 