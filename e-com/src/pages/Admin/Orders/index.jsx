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
  Paper,
  Image,
  Loader,
} from '@mantine/core';
import { IconDotsVertical, IconSearch, IconEye } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { orderService } from '../../../services/supabase/orders';
import PropTypes from 'prop-types';

const orderStatuses = [
  { value: 'pending', label: 'Onay Bekliyor', color: 'yellow' },
  { value: 'processing', label: 'Hazırlanıyor', color: 'blue' },
  { value: 'shipped', label: 'Kargoda', color: 'indigo' },
  { value: 'delivered', label: 'Teslim Edildi', color: 'green' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'red' },
];

const getStatusBadge = (status) => {
  const statusInfo = orderStatuses.find(s => s.value === status);
  return (
    <Badge color={statusInfo?.color || 'gray'}>
      {statusInfo?.label || status}
    </Badge>
  );
};

const OrderDetailsModal = ({ order, opened, onClose }) => {
  if (!order) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Sipariş Detayı #${order.id}`}
      size="xl"
    >
      <Stack spacing="md">
        {/* Müşteri Bilgileri */}
        <Paper withBorder p="md">
          <Title order={4} mb="md">Müşteri Bilgileri</Title>
          <Stack spacing="xs">
            <Group position="apart">
              <Text weight={500}>E-posta:</Text>
              <Text>{order.profiles?.email}</Text>
            </Group>
            <Group position="apart">
              <Text weight={500}>Ad Soyad:</Text>
              <Text>{order.profiles?.full_name}</Text>
            </Group>
          </Stack>
        </Paper>

        {/* Sipariş Bilgileri */}
        <Paper withBorder p="md">
          <Title order={4} mb="md">Sipariş Bilgileri</Title>
          <Group position="apart" mb="md">
            <Text weight={500}>Sipariş Tarihi:</Text>
            <Text>{new Date(order.created_at).toLocaleString('tr-TR')}</Text>
          </Group>

          <Group position="apart" mb="md">
            <Text weight={500}>Durum:</Text>
            {getStatusBadge(order.status)}
          </Group>

          <Group position="apart" mb="md">
            <Text weight={500}>Ödeme Yöntemi:</Text>
            <Text>{order.payment_method}</Text>
          </Group>
        </Paper>

        {/* Ürünler */}
        <Paper withBorder p="md">
          <Title order={4} mb="md">Ürünler</Title>
          <Table>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Görsel</th>
                <th>Birim Fiyat</th>
                <th>Adet</th>
                <th>Toplam</th>
                <th>Stok Durumu</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td>{item.products.name}</td>
                  <td>
                    <Image
                      src={item.products.image_url}
                      width={60}
                      height={60}
                      radius="md"
                      alt={item.products.name}
                    />
                  </td>
                  <td>{item.price.toLocaleString('tr-TR')} TL</td>
                  <td>{item.quantity}</td>
                  <td>{(item.quantity * item.price).toLocaleString('tr-TR')} TL</td>
                  <td>
                    <Badge 
                      color={item.products.stock_quantity > 0 ? 'green' : 'red'}
                    >
                      {item.products.stock_quantity} adet
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Paper>

        {/* Teslimat Adresi */}
        <Paper withBorder p="md">
          <Title order={4} mb="md">Teslimat Adresi</Title>
          <Text>{order.shipping_address.fullName}</Text>
          <Text>{order.shipping_address.address}</Text>
          <Text>{order.shipping_address.city}, {order.shipping_address.zipCode}</Text>
          <Text>{order.shipping_address.phone}</Text>
        </Paper>

        {/* Fiyat Özeti */}
        <Paper withBorder p="md">
          <Stack spacing={5}>
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
        </Paper>
      </Stack>
    </Modal>
  );
};

OrderDetailsModal.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    profiles: PropTypes.shape({
      email: PropTypes.string,
      full_name: PropTypes.string,
    }),
    created_at: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    payment_method: PropTypes.string.isRequired,
    order_items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        products: PropTypes.shape({
          name: PropTypes.string.isRequired,
          image_url: PropTypes.string.isRequired,
          stock_quantity: PropTypes.number.isRequired,
        }).isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    shipping_address: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }).isRequired,
    total_amount: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    shipping_cost: PropTypes.number.isRequired,
    final_amount: PropTypes.number.isRequired,
  }),
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

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
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
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
      // orderService'i kullanarak durumu güncelle
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);

      // State'i güncelle
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? {
            ...order,
            ...updatedOrder,
            profiles: order.profiles // Profil bilgilerini koru
          } : order
        )
      );

      notifications.show({
        title: 'Başarılı',
        message: 'Sipariş durumu güncellendi',
        color: 'green',
      });
    } catch (error) {
      console.error('Update status error:', error);
      notifications.show({
        title: 'Hata',
        message: 'Durum güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.profiles?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Container size="xl" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <Loader size="xl" />
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Siparişler
      </Title>

      <Group mb="md">
        <TextInput
          placeholder="Sipariş ID veya müşteri adı ara..."
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
            <th>Müşteri</th>
            <th>Tarih</th>
            <th>Tutar</th>
            <th>Durum</th>
            <th>Ürünler</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                <Stack spacing={0}>
                  <Text size="sm">{order.profiles?.full_name}</Text>
                  <Text size="xs" color="dimmed">{order.profiles?.email}</Text>
                </Stack>
              </td>
              <td>{new Date(order.created_at).toLocaleDateString('tr-TR')}</td>
              <td>{order.final_amount.toLocaleString('tr-TR')} TL</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>
                <Stack spacing={5}>
                  {order.order_items.map((item) => (
                    <Text key={item.id} size="sm">
                      {item.products.name} ({item.quantity} adet)
                    </Text>
                  ))}
                </Stack>
              </td>
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