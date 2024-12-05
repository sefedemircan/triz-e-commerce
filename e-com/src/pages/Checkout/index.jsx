import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Grid,
  Paper,
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  Text,
  Radio,
  Divider,
  Card,
  Image,
  Box,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { notifications } from '@mantine/notifications';
import { IconCreditCard } from '@tabler/icons-react';
import { orderService } from '../../services/supabase/orders';

const paymentMethods = [
  { value: 'credit-card', label: 'Kredi Kartı' },
  { value: 'bank-transfer', label: 'Havale/EFT' },
];

const cities = [
  'İstanbul',
  'Ankara',
  'İzmir',
  // ... diğer şehirler
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { clearCart } = useCartStore();
  
  // Sepet verilerini al
  const checkoutData = JSON.parse(localStorage.getItem('checkout_data') || '{}');
  const { items, totalAmount, shippingMethod, shippingCost, discount, finalAmount } = checkoutData;

  // Sepet boşsa ana sayfaya yönlendir
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      notifications.show({
        title: 'Hata',
        message: 'Lütfen tüm alanları doldurun',
        color: 'red',
      });
      return;
    }

    try {
      const orderData = {
        userId: user.id,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount,
        shippingCost,
        discount,
        finalAmount,
        items,
      };

      await orderService.createOrder(orderData);

      // Sepeti temizle
      await clearCart(user.id);
      localStorage.removeItem('checkout_data');
      
      notifications.show({
        title: 'Başarılı',
        message: 'Siparişiniz alındı',
        color: 'green',
      });
      
      navigate('/orders');
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Sipariş oluşturulurken bir hata oluştu',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Ödeme</Title>

      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack spacing="md">
              {/* Teslimat Bilgileri */}
              <Paper withBorder p="md">
                <Title order={3} mb="md">Teslimat Bilgileri</Title>
                <Stack spacing="sm">
                  <TextInput
                    label="Ad Soyad"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  <TextInput
                    label="E-posta"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <TextInput
                    label="Telefon"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <TextInput
                    label="Adres"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                  <Group grow>
                    <Select
                      label="Şehir"
                      data={cities}
                      value={formData.city}
                      onChange={(value) => setFormData({ ...formData, city: value })}
                    />
                    <TextInput
                      label="Posta Kodu"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </Group>
                </Stack>
              </Paper>

              {/* Ödeme Yöntemi */}
              <Paper withBorder p="md">
                <Title order={3} mb="md">Ödeme Yöntemi</Title>
                <Radio.Group
                  value={formData.paymentMethod}
                  onChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <Stack spacing="sm">
                    {paymentMethods.map((method) => (
                      <Radio key={method.value} value={method.value} label={method.label} />
                    ))}
                  </Stack>
                </Radio.Group>

                {formData.paymentMethod === 'credit-card' && (
                  <Stack spacing="sm" mt="md">
                    <TextInput
                      label="Kart Numarası"
                      icon={<IconCreditCard size={16} />}
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      maxLength={19}
                    />
                    <TextInput
                      label="Kart Üzerindeki İsim"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    />
                    <Group grow>
                      <TextInput
                        label="Son Kullanma Tarihi"
                        placeholder="AA/YY"
                        value={formData.cardExpiry}
                        onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                        maxLength={5}
                      />
                      <TextInput
                        label="CVC"
                        value={formData.cardCVC}
                        onChange={(e) => setFormData({ ...formData, cardCVC: e.target.value })}
                        maxLength={3}
                      />
                    </Group>
                  </Stack>
                )}
              </Paper>
            </Stack>
          </Grid.Col>

          {/* Sipariş Özeti */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder>
              <Stack spacing="md">
                <Title order={3}>Sipariş Özeti</Title>
                
                {/* Ürünler */}
                <Stack spacing="sm">
                  {items.map((item) => (
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
                            {item.quantity} adet x {item.products.price.toLocaleString('tr-TR')} TL
                          </Text>
                        </Box>
                        <Text weight={500}>
                          {(item.quantity * item.products.price).toLocaleString('tr-TR')} TL
                        </Text>
                      </Group>
                    </Card>
                  ))}
                </Stack>

                <Divider />

                {/* Fiyat Detayları */}
                <Stack spacing="xs">
                  <Group style={{ justifyContent: 'space-between' }}>
                    <Text size="sm">Ara Toplam</Text>
                    <Text weight={500}>{totalAmount.toLocaleString('tr-TR')} TL</Text>
                  </Group>

                  {discount > 0 && (
                    <Group style={{ justifyContent: 'space-between' }} color="green">
                      <Text size="sm">İndirim</Text>
                      <Text weight={500} color="green">
                        -{discount.toLocaleString('tr-TR')} TL
                      </Text>
                    </Group>
                  )}

                  <Group style={{ justifyContent: 'space-between' }}>
                    <Text size="sm">Kargo</Text>
                    <Text weight={500}>
                      {shippingCost === 0 
                        ? 'Ücretsiz' 
                        : `${shippingCost.toLocaleString('tr-TR')} TL`}
                    </Text>
                  </Group>

                  <Divider />

                  <Group style={{ justifyContent: 'space-between' }}>
                    <Text weight={500}>Toplam</Text>
                    <Text size="lg" weight={700} color="dark">
                      {finalAmount.toLocaleString('tr-TR')} TL
                    </Text>
                  </Group>
                </Stack>

                <Button 
                  type="submit" 
                  color="orange" 
                  size="lg" 
                  fullWidth
                >
                  Siparişi Tamamla
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </form>
    </Container>
  );
} 