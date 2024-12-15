import { useState } from 'react';
import {
  ActionIcon,
  Drawer,
  Paper,
  Text,
  Stack,
  Group,
  Avatar,
  Box,
  Button,
  Overlay,
} from '@mantine/core';
import { IconRobot, IconX } from '@tabler/icons-react';
import { supabase } from '../../services/supabase/client';
import { useAuthStore } from '../../stores/authStore';

// Ana menü seçenekleri
const MAIN_MENU = [
  { id: 'orders', title: 'Siparişlerim' },
  { id: 'returns', title: 'İade & İptaller' },
  { id: 'issues', title: 'Eksik / Yanlış / Hasarlı Ürün' },
  { id: 'promotions', title: 'Kupon & Kampanyalar' },
  { id: 'account', title: 'Üyelik & Hesap İşlemlerim' }
];

// Alt menü seçenekleri
const SUB_MENUS = {
  orders: [
    { id: 'order_status', title: 'Sipariş Durumu Sorgula' },
    { id: 'last_orders', title: 'Son Siparişlerim' },
    { id: 'order_tracking', title: 'Kargo Takibi' }
  ],
  returns: [
    { id: 'return_request', title: 'İade Talebi Oluştur' },
    { id: 'cancel_order', title: 'Sipariş İptali' },
    { id: 'return_status', title: 'İade Durumu Sorgula' }
  ],
  issues: [
    { id: 'missing_product', title: 'Eksik Ürün Bildirimi' },
    { id: 'wrong_product', title: 'Yanlış Ürün Bildirimi' },
    { id: 'damaged_product', title: 'Hasarlı Ürün Bildirimi' }
  ],
  promotions: [
    { id: 'active_coupons', title: 'Aktif Kuponlarım' },
    { id: 'campaigns', title: 'Güncel Kampanyalar' },
    { id: 'loyalty_points', title: 'Puan Durumum' }
  ],
  account: [
    { id: 'profile_info', title: 'Profil Bilgilerim' },
    { id: 'address_info', title: 'Adres Bilgilerim' },
    { id: 'payment_methods', title: 'Ödeme Yöntemlerim' }
  ]
};

// Her işlem için yapılacak aksiyonlar
const ACTIONS = {
  order_status: async (userId) => {
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (!orders?.length) {
      return 'Aktif siparişiniz bulunmamaktadır.';
    }

    const order = orders[0];
    const statusMap = {
      pending: 'Onay Bekliyor',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };

    return `Son siparişinizin durumu: ${statusMap[order.status]}\nSipariş Tarihi: ${new Date(order.created_at).toLocaleDateString('tr-TR')}`;
  },
  
  last_orders: async (userId) => {
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          products (
            name,
            price
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!orders?.length) {
      return 'Henüz bir sipariş geçmişiniz bulunmamaktadır.';
    }

    let response = 'Son 5 siparişiniz:\n\n';
    orders.forEach(order => {
      response += `📦 Sipariş #${order.id}\n`;
      response += `Tarih: ${new Date(order.created_at).toLocaleDateString('tr-TR')}\n`;
      response += `Tutar: ${order.final_amount.toLocaleString('tr-TR')} TL\n`;
      response += `Ürünler:\n`;
      order.order_items.forEach(item => {
        response += `- ${item.products.name} (${item.quantity} adet)\n`;
      });
      response += '\n';
    });

    return response;
  },

  profile_info: async (userId) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      return 'Profil bilgilerinize ulaşılamadı.';
    }

    return `Profil Bilgileriniz:\n\nAd: ${profile.full_name || 'Belirtilmemiş'}\nE-posta: ${profile.email}\nTelefon: ${profile.phone || 'Belirtilmemiş'}\nDoğum Tarihi: ${profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}`;
  },

  // Diğer aksiyonlar için benzer şekilde fonksiyonlar eklenebilir...
};

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'E-Ticaret\'e hoş geldiniz 👋. Canlı destek görüşmeleriniz kalite standartları gereği kayıt altına alınmaktadır. Kişisel verilerinizin işlenmesine yönelik detaylı bilgi için lütfen "İşlem Rehberi" sekmesi altındaki Aydınlatma Metnimizi inceleyiniz.'
};

const MENU_ICONS = {
  orders: '📦',
  returns: '↩️',
  issues: '⚠️',
  promotions: '🎯',
  account: '👤',
  order_status: '🔍',
  last_orders: '📋',
  order_tracking: '🚚',
  return_request: '📝',
  cancel_order: '❌',
  return_status: '📊',
  missing_product: '❓',
  wrong_product: '❗',
  damaged_product: '💔',
  active_coupons: '🎟️',
  campaigns: '🏷️',
  loyalty_points: '⭐',
  profile_info: '📱',
  address_info: '📍',
  payment_methods: '💳'
};

export default function AIChat() {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [currentMenu, setCurrentMenu] = useState('main');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleMenuSelect = async (menuId, title) => {
    const icon = MENU_ICONS[menuId] || '';
    
    // Kullanıcı seçimini mesaj olarak ekle
    setMessages(prev => [...prev, {
      role: 'user',
      content: `${icon} ${title}`
    }]);

    if (SUB_MENUS[menuId]) {
      setCurrentMenu(menuId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `${title} menüsündesiniz. Size nasıl yardımcı olabilirim?\n\nAşağıdaki seçeneklerden birini seçebilir veya "Ana Menüye Dön" butonunu kullanabilirsiniz.`
      }]);
    } else if (ACTIONS[menuId]) {
      if (!user) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ Bu işlemi gerçekleştirmek için giriş yapmanız gerekmektedir. Lütfen giriş yaptıktan sonra tekrar deneyiniz.'
        }]);
        return;
      }

      setLoading(true);
      try {
        const response = await ACTIONS[menuId](user?.id);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response
        }]);
        
        // Kısa bir süre bekleyip yeni mesaj göster
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '✨ Başka bir konuda yardımcı olabilir miyim?\n\nAna menüden yeni bir seçim yapabilirsiniz.'
          }]);
        }, 1000);
        
        setCurrentMenu('main');
      } catch (error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '❌ Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'
        }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setCurrentMenu('main');
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🏠 Ana menüye döndünüz.\n\nSize nasıl yardımcı olabilirim?'
    }]);
  };

  const renderContent = () => {
    if (currentMenu === 'main') {
      return (
        <Stack spacing={0}>
          {MAIN_MENU.map((item) => (
            <Button
              key={item.id}
              variant="subtle"
              color="orange"
              fullWidth
              onClick={() => handleMenuSelect(item.id, item.title)}
              styles={{
                root: {
                  height: '50px',
                  borderRadius: 0,
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor: '#fff4e6'
                  }
                },
                label: {
                  justifyContent: 'flex-start',
                }
              }}
            >
              {MENU_ICONS[item.id]} {item.title}
            </Button>
          ))}
        </Stack>
      );
    }

    return (
      <Stack spacing={0}>
        <Button
          variant="subtle"
          color="orange"
          fullWidth
          onClick={handleBack}
          styles={{
            root: {
              height: '50px',
              borderRadius: 0,
              fontWeight: 500,
              borderBottom: '1px solid #eee',
              '&:hover': {
                backgroundColor: '#fff4e6'
              }
            },
            label: {
              justifyContent: 'flex-start',
            }
          }}
        >
          ← Ana Menüye Dön
        </Button>

        {SUB_MENUS[currentMenu]?.map((item) => (
          <Button
            key={item.id}
            variant="subtle"
            color="orange"
            fullWidth
            onClick={() => handleMenuSelect(item.id, item.title)}
            styles={{
              root: {
                height: '50px',
                borderRadius: 0,
                fontWeight: 400,
                '&:hover': {
                  backgroundColor: '#fff4e6'
                }
              },
              label: {
                justifyContent: 'flex-start',
              }
            }}
          >
            {MENU_ICONS[item.id]} {item.title}
          </Button>
        ))}
      </Stack>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          zIndex: 9999,
        }}
      >
        <ActionIcon
          variant="filled"
          color="orange"
          size={50}
          radius="xl"
          onClick={() => setOpened(true)}
          sx={(theme) => ({
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
            },
          })}
        >
          <IconRobot size={28} />
        </ActionIcon>
      </div>

      {opened && (
        <Overlay
          opacity={0.3}
          color="#000"
          zIndex={9998}
          onClick={() => setOpened(false)}
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}

      <Drawer
        opened={opened}
        onClose={() => {
          setOpened(false);
          setCurrentMenu('main');
          setMessages([INITIAL_MESSAGE]);
        }}
        position="right"
        size="md"
        withCloseButton={false}
        styles={(theme) => ({
          header: { display: 'none' },
          body: { padding: 0 },
          drawer: {
            boxShadow: '-4px 0 28px rgba(0, 0, 0, 0.1)',
          }
        })}
      >
        {/* Header */}
        <Box 
          p="md" 
          bg="orange" 
          style={{ 
            color: 'white',
            position: 'relative',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text size="lg" weight={500}>Asistan</Text>
          <ActionIcon 
            variant="transparent" 
            color="white"
            onClick={() => setOpened(false)}
          >
            <IconX size={20} />
          </ActionIcon>
        </Box>

        {/* Hoşgeldiniz Mesajı */}
        <Box p="md" bg="gray.0">
          <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {INITIAL_MESSAGE.content}
          </Text>
        </Box>

        {/* Mesajlar */}
        {messages.length > 1 && (
          <Box 
            p="md" 
            style={{ 
              maxHeight: 'calc(100vh - 300px)',
              overflowY: 'auto'
            }}
          >
            {messages.slice(1).map((message, index) => (
              <Paper
                key={index}
                p="sm"
                radius="md"
                bg={message.role === 'user' ? 'orange.1' : 'gray.0'}
                style={{
                  marginBottom: '8px',
                  marginLeft: message.role === 'user' ? 'auto' : 0,
                  marginRight: message.role === 'user' ? 0 : 'auto',
                  maxWidth: '80%',
                }}
              >
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Text>
              </Paper>
            ))}
            {loading && (
              <Paper p="sm" radius="md" bg="gray.0">
                <Text size="sm">Yanıt hazırlanıyor...</Text>
              </Paper>
            )}
          </Box>
        )}

        {/* Menü İçeriği */}
        {renderContent()}

        {/* Alt Bilgi */}
        <Box 
          p="md" 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            borderTop: '1px solid #eee',
            backgroundColor: 'white'
          }}
        >
          <Text size="xs" color="dimmed" align="center">
            Sizden yanıt alınamadığı takdirde görüşmemiz sistem tarafından sonlandırılacaktır.
          </Text>
        </Box>
      </Drawer>
    </div>
  );
} 