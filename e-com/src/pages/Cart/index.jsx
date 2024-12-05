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
  Box,
  TextInput,
  Radio,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { supabase } from '../../services/supabase/client';

export default function Cart() {
  const { user } = useAuthStore();
  const { 
    items, 
    loading, 
    loadCart, 
    removeFromCart, 
    updateQuantity 
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard'); // standard, express
  
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.products.price * item.quantity),
    0
  ).toFixed(2);
  
  const shippingOptions = {
    standard: {
      price: totalAmount >= 500 ? 0 : 29.90,
      title: 'Standart Teslimat',
      description: '3-5 iş günü',
      estimatedDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')
    },
    express: {
      price: 49.90,
      title: 'Hızlı Teslimat',
      description: '1-2 iş günü',
      estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')
    }
  };

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (!data) {
        notifications.show({
          title: 'Hata',
          message: 'Geçersiz kupon kodu',
          color: 'red',
        });
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        notifications.show({
          title: 'Hata',
          message: 'Bu kupon kodunun süresi dolmuş',
          color: 'red',
        });
        return;
      }

      if (data.min_cart_amount > totalAmount) {
        notifications.show({
          title: 'Hata',
          message: `Bu kuponu kullanmak için minimum sepet tutarı ${data.min_cart_amount.toLocaleString('tr-TR')} TL olmalıdır`,
          color: 'red',
        });
        return;
      }

      setAppliedCoupon(data);
      notifications.show({
        title: 'Başarılı',
        message: 'Kupon kodu uygulandı',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Kupon kodu uygulanırken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    let discount = 0;
    if (appliedCoupon.discount_type === 'percentage') {
      discount = (totalAmount * appliedCoupon.discount_value) / 100;
    } else {
      discount = appliedCoupon.discount_value;
    }

    if (appliedCoupon.max_discount) {
      discount = Math.min(discount, appliedCoupon.max_discount);
    }

    return discount;
  };

  const discount = calculateDiscount();
  const shippingCost = shippingOptions[shippingMethod].price;
  const finalAmount = Number(totalAmount) - discount + shippingCost;

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
              <Group align="start" style={{ flexWrap: 'nowrap' }}>
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
            
            {/* Kupon Kodu */}
            <TextInput
              label="Kupon Kodu"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              rightSection={
                <Button 
                  variant="light" 
                  size="xs"
                  onClick={handleApplyCoupon}
                >
                  Uygula
                </Button>
              }
              placeholder="Kupon kodunuz"
            />

            {/* Kargo Seçenekleri */}
            <Radio.Group
              label="Kargo Seçeneği"
              value={shippingMethod}
              onChange={setShippingMethod}
            >
              {Object.entries(shippingOptions).map(([key, option]) => (
                <Paper key={key} withBorder p="xs" mb="xs">
                  <Radio value={key} label={
                    <div>
                      <Group position="apart">
                        <Text size="sm" weight={500}>{option.title}</Text>
                        <Text size="sm" weight={500}>
                          {option.price === 0 ? 'Ücretsiz' : `${option.price.toLocaleString('tr-TR')} TL`}
                        </Text>
                      </Group>
                      <Text size="xs" color="dimmed">{option.description}</Text>
                      <Text size="xs" color="dimmed">
                        Tahmini Teslimat: {option.estimatedDate}
                      </Text>
                    </div>
                  } />
                </Paper>
              ))}
            </Radio.Group>

            {/* Fiyat Detayları */}
            <Group position="apart">
              <Text>Ara Toplam</Text>
              <Text weight={500}>{totalAmount.toLocaleString('tr-TR')} TL</Text>
            </Group>

            {discount > 0 && (
              <Group position="apart" color="green">
                <Text>İndirim</Text>
                <Text weight={500} color="green">
                  -{discount.toLocaleString('tr-TR')} TL
                </Text>
              </Group>
            )}

            <Group position="apart">
              <Text>Kargo</Text>
              <Text weight={500}>
                {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toLocaleString('tr-TR')} TL`}
              </Text>
            </Group>

            <Divider />
            
            <Group position="apart">
              <Text weight={500}>Toplam</Text>
              <Text size="xl" weight={700} color="dark">
                {finalAmount.toLocaleString('tr-TR')} TL
              </Text>
            </Group>

            <Button 
              variant="filled" 
              color="orange" 
              size="md" 
              fullWidth
              component={Link}
              to="/checkout"
              onClick={() => {
                // Sepet bilgilerini localStorage'a kaydedelim
                localStorage.setItem('checkout_data', JSON.stringify({
                  items,
                  totalAmount: Number(totalAmount),
                  shippingMethod,
                  shippingCost,
                  discount,
                  finalAmount,
                  appliedCoupon
                }));
              }}
            >
              Ödemeye Geç
            </Button>
          </Stack>
        </Card>
      </Group>
    </Container>
  );
} 