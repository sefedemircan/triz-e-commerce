import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  Badge,
  Menu,
  ActionIcon,
  Text,
  Group,
  TextInput,
  Select,
  Modal,
  Stack,
} from '@mantine/core';
import { IconDotsVertical, IconSearch, IconEye } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { supabase } from '../../../services/supabase/client';

const orderStatuses = [
  { value: 'pending', label: 'Onay Bekliyor', color: 'yellow' },
  { value: 'processing', label: 'Hazırlanıyor', color: 'blue' },
  { value: 'shipped', label: 'Kargoda', color: 'indigo' },
  { value: 'delivered', label: 'Teslim Edildi', color: 'green' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'red' },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            products (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      notifications.show({
        title: 'Başarılı',
        message: 'Sipariş durumu güncellendi',
        color: 'green',
      });

      loadOrders();
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Durum güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = orderStatuses.find(s => s.value === status);
    return (
      <Badge color={statusInfo?.color || 'gray'}>
        {statusInfo?.label || status}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const OrderDetailsModal = ({ order, opened, onClose }) => {
    if (!order) return null;

    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title={`Sipariş Detayı #${order.id}`}
        size="lg"
      >
        <Stack spacing="md">
          <Group position="apart">
            <Text weight={500}>Sipariş Tarihi:</Text>
            <Text>{new Date(order.created_at).toLocaleString('tr-TR')}</Text>
          </Group>

          <Group position="apart">
            <Text weight={500}>Ödeme Yöntemi:</Text>
            <Text>{order.payment_method}</Text>
          </Group>

          <Title order={4} mt="md">Ürünler</Title>
          <Table>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Adet</th>
                <th>Birim Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td>{item.products.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString('tr-TR')} TL</td>
                  <td>{(item.quantity * item.price).toLocaleString('tr-TR')} TL</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Stack spacing={5} mt="md">
            <Group position="apart">
              <Text>Ara Toplam:</Text>
              <Text>{order.total_amount.toLocaleString('tr-TR')} TL</Text>
            </Group>
            <Group position="apart">
              <Text>İndirim:</Text>
              <Text color="green">-{order.discount.toLocaleString('tr-TR')} TL</Text>
            </Group>
            <Group position="apart">
              <Text>Kargo:</Text>
              <Text>{order.shipping_cost.toLocaleString('tr-TR')} TL</Text>
            </Group>
            <Group position="apart" style={{ marginTop: 10 }}>
              <Text weight={500}>Toplam:</Text>
              <Text weight={500} size="lg">{order.final_amount.toLocaleString('tr-TR')} TL</Text>
            </Group>
          </Stack>
        </Stack>
      </Modal>
    );
  };

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Siparişler
      </Title>

      <Group mb="md">
        <TextInput
          placeholder="Sipariş ID ara..."
          icon={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Durum Filtrele"
          value={statusFilter}
          onChange={setStatusFilter}
          data={[
            { value: '', label: 'Tümü' },
            ...orderStatuses
          ]}
          style={{ width: 200 }}
        />
      </Group>

      <Table>
        <thead>
          <tr>
            <th>Sipariş ID</th>
            <th>Tarih</th>
            <th>Tutar</th>
            <th>İndirim</th>
            <th>Kargo</th>
            <th>Toplam</th>
            <th>Ödeme</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
              <td>{order.total_amount.toLocaleString('tr-TR')} TL</td>
              <td>{order.discount.toLocaleString('tr-TR')} TL</td>
              <td>{order.shipping_cost.toLocaleString('tr-TR')} TL</td>
              <td>{order.final_amount.toLocaleString('tr-TR')} TL</td>
              <td>{order.payment_method}</td>
              <td>
                <Group spacing={0}>
                  <ActionIcon
                    onClick={() => {
                      setSelectedOrder(order);
                      setDetailsModalOpened(true);
                    }}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <Menu>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Durumu Güncelle</Menu.Label>
                      {orderStatuses.map((status) => (
                        <Menu.Item
                          key={status.value}
                          onClick={() => handleStatusChange(order.id, status.value)}
                          disabled={order.status === status.value}
                        >
                          <Group>
                            <Badge color={status.color} size="xs" variant="dot" />
                            <Text size="sm">{status.label}</Text>
                          </Group>
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <OrderDetailsModal
        order={selectedOrder}
        opened={detailsModalOpened}
        onClose={() => {
          setDetailsModalOpened(false);
          setSelectedOrder(null);
        }}
      />
    </Container>
  );
} 