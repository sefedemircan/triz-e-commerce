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
} from '@mantine/core';
import {
  IconUsers,
  IconShoppingCart,
  IconCash,
  IconPackage,
} from '@tabler/icons-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [],
    stockAlerts: [],
  });

  useEffect(() => {
    // Burada dashboard verilerini yükleyeceğiz
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // API çağrıları yapılacak
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Paper withBorder p="md" radius="md">
      <Group position="apart">
        <div>
          <Text size="xs" color="dimmed" transform="uppercase">
            {title}
          </Text>
          <Text weight={700} size="xl">
            {value}
          </Text>
        </div>
        <Icon size={32} stroke={1.5} color={`var(--mantine-color-${color}-6)`} />
      </Group>
    </Paper>
  );

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Dashboard
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Toplam Sipariş"
            value={stats.totalOrders}
            icon={IconShoppingCart}
            color="blue"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Toplam Gelir"
            value={`${stats.totalRevenue.toLocaleString('tr-TR')} TL`}
            icon={IconCash}
            color="green"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.totalUsers}
            icon={IconUsers}
            color="orange"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Toplam Ürün"
            value={stats.totalProducts}
            icon={IconPackage}
            color="grape"
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
} 