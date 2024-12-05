import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Group,
  Text,
  Badge,
  Image,
  Box,
  Grid,
  Card,
  Timeline,
  ThemeIcon,
  Button,
  Divider,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { orderService } from '../../services/supabase/orders';
import { IconTruck, IconPackage, IconCheck, IconClock, IconX } from '@tabler/icons-react';

const statusMap = {
  pending: { color: 'yellow', label: 'Onay Bekliyor', icon: IconClock },
  processing: { color: 'blue', label: 'Hazırlanıyor', icon: IconPackage },
  shipped: { color: 'indigo', label: 'Kargoda', icon: IconTruck },
  delivered: { color: 'green', label: 'Teslim Edildi', icon: IconCheck },
  cancelled: { color: 'red', label: 'İptal Edildi', icon: IconX },
};

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderService.getOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error('Load orders error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Yükleniyor...</Text>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" spacing="md">
            <Title order={2}>Henüz Siparişiniz Yok</Title>
            <Text c="dimmed">Siparişleriniz burada görüntülenecek.</Text>
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
      <Title order={1} mb="xl">Siparişlerim</Title>

      <Stack spacing="lg">
        {orders.map((order) => (
          <Paper key={order.id} withBorder p="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack spacing="md">
                  <Group style={{ justifyContent: 'space-between' }}>
                    <Text weight={500}>Sipariş No: #{order.id.slice(0, 8)}</Text>
                    <Badge 
                      color={statusMap[order.status].color}
                      variant="light"
                      size="lg"
                    >
                      {statusMap[order.status].label}
                    </Badge>
                  </Group>

                  <Timeline active={Object.keys(statusMap).indexOf(order.status)} bulletSize={24}>
                    {Object.entries(statusMap).map(([key, value]) => (
                      <Timeline.Item
                        key={key}
                        bullet={
                          <ThemeIcon
                            size={22}
                            variant="light"
                            color={value.color}
                            radius="xl"
                          >
                            <value.icon size={14} />
                          </ThemeIcon>
                        }
                        title={value.label}
                      />
                    ))}
                  </Timeline>

                  <Stack spacing="xs">
                    {order.order_items.map((item) => (
                      <Card key={item.id} p="xs" withBorder>
                        <Group style={{ flexWrap: 'nowrap' }}>
                          <Image
                            src={item.products.image_url}
                            width={60}
                            height={60}
                            radius="md"
                          />
                          <Box style={{ flex: 1 }}>
                            <Text size="sm" lineClamp={2}>
                              {item.products.name}
                            </Text>
                            <Text size="xs" color="dimmed">
                              {item.quantity} adet x {item.price.toLocaleString('tr-TR')} TL
                            </Text>
                          </Box>
                          <Text weight={500}>
                            {(item.quantity * item.price).toLocaleString('tr-TR')} TL
                          </Text>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder>
                  <Stack spacing="xs">
                    <Text weight={500}>Sipariş Özeti</Text>
                    <Divider />
                    <Group style={{ justifyContent: 'space-between' }}>
                      <Text size="sm">Ara Toplam</Text>
                      <Text weight={500}>{order.total_amount.toLocaleString('tr-TR')} TL</Text>
                    </Group>

                    {order.discount > 0 && (
                      <Group style={{ justifyContent: 'space-between' }} color="green">
                        <Text size="sm">İndirim</Text>
                        <Text weight={500} color="green">
                          -{order.discount.toLocaleString('tr-TR')} TL
                        </Text>
                      </Group>
                    )}

                    <Group style={{ justifyContent: 'space-between' }}>
                      <Text size="sm">Kargo</Text>
                      <Text weight={500}>
                        {order.shipping_cost === 0 
                          ? 'Ücretsiz' 
                          : `${order.shipping_cost.toLocaleString('tr-TR')} TL`}
                      </Text>
                    </Group>

                    <Divider />

                    <Group style={{ justifyContent: 'space-between' }}>
                      <Text weight={500}>Toplam</Text>
                      <Text size="lg" weight={700} color="dark">
                        {order.final_amount.toLocaleString('tr-TR')} TL
                      </Text>
                    </Group>
                  </Stack>
                </Card>

                <Box mt="md">
                  <Text size="sm" weight={500} mb="xs">Teslimat Adresi</Text>
                  <Text size="sm">{order.shipping_address.fullName}</Text>
                  <Text size="sm">{order.shipping_address.address}</Text>
                  <Text size="sm">
                    {order.shipping_address.city}, {order.shipping_address.zipCode}
                  </Text>
                  <Text size="sm">{order.shipping_address.phone}</Text>
                </Box>
              </Grid.Col>
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
} 