import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Text,
  Title,
  Group,
  RingProgress,
  Stack,
  SimpleGrid,
  Table,
  Badge,
} from '@mantine/core';
import {
  IconUsers,
  IconShoppingCart,
  IconCash,
  IconPackage,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { supabase } from '../../../services/supabase/client';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    lowStockProducts: [],
    recentOrders: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Toplam sipariş sayısı ve gelir
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('final_amount, status');
      
      if (ordersError) throw ordersError;

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.final_amount, 0);

      // Toplam kullanıcı sayısı
      const { count: totalUsers, error: profileCountError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (profileCountError) throw profileCountError;

      // Toplam ürün sayısı ve stok durumu
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      const totalProducts = products.length;
      const lowStockProducts = products.filter(product => product.stock_quantity <= 5);

      // Son 5 sipariş
      const { data: recentOrders, error: recentOrdersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentOrdersError) throw recentOrdersError;

      // Siparişlere ait kullanıcı bilgilerini çekelim
      const userIds = recentOrders.map(order => order.user_id);
      const { data: userEmails, error: emailsError } = await supabase
        .from('auth_users_view')
        .select('id, email')
        .in('id', userIds);

      if (emailsError) {
        console.error('Kullanıcı e-postaları çekilemedi:', emailsError);
      }

      // Siparişler ve e-postaları birleştirelim
      const ordersWithEmails = recentOrders.map(order => ({
        ...order,
        userEmail: userEmails?.find(user => user.id === order.user_id)?.email || 'Bilinmeyen Müşteri'
      }));

      setStats({
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
        lowStockProducts,
        recentOrders: ordersWithEmails,
      });

    } catch (error) {
      console.error('Dashboard veri yükleme hatası:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Paper withBorder p="md" radius="md">
      <Group position="apart">
        <div>
          <Text size="xs" color="dimmed" transform="uppercase">
            {title}
          </Text>
          <Text weight={700} size="xl">
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" color="dimmed">
              {subtitle}
            </Text>
          )}
        </div>
        <Icon size={32} stroke={1.5} color={`var(--mantine-color-${color}-6)`} />
      </Group>
    </Paper>
  );

  const LowStockAlert = ({ products }) => (
    <Paper withBorder p="md" radius="md">
      <Group position="apart" mb="xs">
        <Text weight={500}>Düşük Stok Uyarısı</Text>
        <IconAlertTriangle size={20} color="orange" />
      </Group>
      <Stack spacing="xs">
        {products.map(product => (
          <Group key={product.id} position="apart" spacing="xs">
            <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
              {product.name}
            </Text>
            <Badge color={product.stock_quantity === 0 ? 'red' : 'orange'}>
              {product.stock_quantity} adet
            </Badge>
          </Group>
        ))}
      </Stack>
    </Paper>
  );

  const RecentOrders = ({ orders }) => (
    <Paper withBorder p="md" radius="md">
      <Text weight={500} mb="md">Son Siparişler</Text>
      <Table>
        <thead>
          <tr>
            <th>Sipariş No</th>
            <th>Müşteri</th>
            <th>Tutar</th>
            <th>İndirim</th>
            <th>Kargo</th>
            <th>Toplam</th>
            <th>Ödeme</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userEmail}</td>
              <td>{order.total_amount.toLocaleString('tr-TR')} TL</td>
              <td>{order.discount.toLocaleString('tr-TR')} TL</td>
              <td>{order.shipping_cost.toLocaleString('tr-TR')} TL</td>
              <td>{order.final_amount.toLocaleString('tr-TR')} TL</td>
              <td>{order.payment_method}</td>
              <td>
                <Badge 
                  color={
                    order.status === 'delivered' ? 'green' : 
                    order.status === 'processing' ? 'blue' : 
                    order.status === 'cancelled' ? 'red' : 
                    order.status === 'shipped' ? 'violet' :
                    'yellow'
                  }
                >
                  {order.status === 'delivered' ? 'Teslim Edildi' :
                   order.status === 'processing' ? 'Hazırlanıyor' :
                   order.status === 'cancelled' ? 'İptal Edildi' :
                   order.status === 'shipped' ? 'Kargoya Verildi' :
                   order.status === 'pending' ? 'Beklemede' :
                   'Bilinmeyen Durum'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Paper>
  );

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Dashboard
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
        <StatCard
          title="Toplam Sipariş"
          value={stats.totalOrders}
          icon={IconShoppingCart}
          color="blue"
        />
        <StatCard
          title="Toplam Gelir"
          value={`${stats.totalRevenue.toLocaleString('tr-TR')} TL`}
          icon={IconCash}
          color="green"
        />
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers}
          icon={IconUsers}
          color="orange"
        />
        <StatCard
          title="Toplam Ürün"
          value={stats.totalProducts}
          icon={IconPackage}
          color="grape"
          subtitle={`${stats.lowStockProducts.length} üründe düşük stok`}
        />
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <RecentOrders orders={stats.recentOrders} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <LowStockAlert products={stats.lowStockProducts} />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 