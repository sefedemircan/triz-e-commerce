import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Text,
  Title,
  Group,
  Stack,
  SimpleGrid,
  Table,
  Badge,
  SegmentedControl,
} from '@mantine/core';
import {
  IconUsers,
  IconShoppingCart,
  IconCash,
  IconPackage,
  IconAlertTriangle,
  IconChartBar,
  IconTrendingUp,
} from '@tabler/icons-react';
import { supabase } from '../../../services/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    lowStockProducts: [],
    recentOrders: [],
  });

  const [salesData, setSalesData] = useState({
    timeSeriesData: [],
    topProducts: [],
    period: 'weekly'
  });

  useEffect(() => {
    loadDashboardData();
    loadSalesData(salesData.period);
  }, [salesData.period]);

  const loadSalesData = async (period) => {
    try {
      // Tarih aralığını hesapla
      const now = new Date();
      let startDate = new Date();

      if (period === 'daily') {
        startDate.setDate(now.getDate() - 7); // Son 7 gün
      } else if (period === 'weekly') {
        startDate.setDate(now.getDate() - (8 * 7)); // Son 8 hafta
      } else {
        startDate.setMonth(now.getMonth() - 12); // Son 12 ay
      }

      // ISO string formatına çevir ve timezone'u düzelt
      const startDateStr = startDate.toISOString();

      // Zaman serisi verilerini çek
      const { data: timeSeriesData, error: timeSeriesError } = await supabase
        .from('orders')
        .select('created_at, final_amount')
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: true });

      if (timeSeriesError) throw timeSeriesError;

      // En çok satılan ürünleri çek
      const { data: topProductsData, error: topProductsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          sold_count
        `)
        .order('sold_count', { ascending: false })
        .limit(5);

      if (topProductsError) throw topProductsError;

      // Zaman serisi verilerini grupla
      const groupedData = timeSeriesData.reduce((acc, order) => {
        const date = new Date(order.created_at);
        let key;
        
        if (period === 'daily') {
          key = date.toLocaleDateString('tr-TR');
        } else if (period === 'weekly') {
          // Haftanın ilk gününü Pazartesi olarak ayarla
          const firstDayOfWeek = new Date(date);
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1);
          firstDayOfWeek.setDate(diff);
          
          key = `${firstDayOfWeek.toLocaleDateString('tr-TR', { month: 'short' })} ${
            Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}. Hafta`;
        } else {
          key = date.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
        }

        if (!acc[key]) {
          acc[key] = {
            date: key,
            total: 0,
            count: 0
          };
        }

        acc[key].total += order.final_amount;
        acc[key].count += 1;
        return acc;
      }, {});

      const formattedTimeSeriesData = Object.values(groupedData);

      // Top ürünleri formatla
      const formattedTopProducts = topProductsData.map(item => ({
        name: item.name,
        quantity: item.sold_count,
        revenue: item.sold_count * item.price
      }));

      setSalesData({
        ...salesData,
        timeSeriesData: formattedTimeSeriesData,
        topProducts: formattedTopProducts
      });

    } catch (error) {
      console.error('Satış verileri yüklenirken hata:', error);
    }
  };

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

  const SalesChart = () => (
    <Paper withBorder p="md" radius="md">
      <Group position="apart" mb="md">
        <div>
          <Text weight={500} mb="xs">Satış Trendi</Text>
          <Text size="sm" color="dimmed">
            {salesData.period === 'daily' ? 'Son 7 Gün' :
             salesData.period === 'weekly' ? 'Son 8 Hafta' :
             'Son 12 Ay'} Satışları
          </Text>
        </div>
        <SegmentedControl
          value={salesData.period}
          onChange={(value) => setSalesData({ ...salesData, period: value })}
          data={[
            { label: 'Günlük', value: 'daily' },
            { label: 'Haftalık', value: 'weekly' },
            { label: 'Aylık', value: 'monthly' }
          ]}
        />
      </Group>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData.timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toLocaleString('tr-TR')} TL`} />
          <Line type="monotone" dataKey="total" stroke="#1971c2" name="Toplam Satış" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );

  const TopProducts = () => (
    <Paper withBorder p="md" radius="md">
      <Text weight={500} mb="md">En Çok Satan Ürünler</Text>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData.topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              `${value.toLocaleString('tr-TR')} ${name === 'revenue' ? 'TL' : 'Adet'}`,
              name === 'revenue' ? 'Gelir' : 'Satış Adedi'
            ]}
          />
          <Bar dataKey="quantity" fill="#1971c2" name="Satış Adedi" />
        </BarChart>
      </ResponsiveContainer>
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

      <Grid mb="xl">
        <Grid.Col span={12}>
          <SalesChart />
        </Grid.Col>
        <Grid.Col span={12}>
          <TopProducts />
        </Grid.Col>
      </Grid>

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