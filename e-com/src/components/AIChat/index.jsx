import { useState } from 'react';
import {
  ActionIcon,
  Modal,
  Paper,
  Text,
  TextInput,
  Button,
  Stack,
  Group,
  Avatar,
  Box,
  ScrollArea,
  Loader,
  Badge,
} from '@mantine/core';
import { IconRobot, IconSend } from '@tabler/icons-react';
import { supabase } from '../../services/supabase/client';
import { useAuthStore } from '../../stores/authStore';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Merhaba! Ben AI yardımcınızım. Size nasıl yardımcı olabilirim? Sipariş takibi, ürünler veya diğer konularda sorularınızı yanıtlayabilirim.'
};

async function getOrderInfo(userId) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      created_at,
      total_amount,
      final_amount,
      shipping_cost,
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

  if (error) throw error;
  return orders;
}

async function getProductInfo(query) {
  const cleanQuery = query
    .replace(/telefon|fiyat|ürün|var mı|kaç|tl|lira|para|ne kadar|\?/gi, '')
    .trim();

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      stock_quantity,
      description,
      categories (
        name
      )
    `)
    .or(`name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`)
    .order('price', { ascending: true })
    .limit(5);

  if (error) throw error;
  return products;
}

async function generateResponse(input, userId) {
  const lowercaseInput = input.toLowerCase();
  let response = '';

  try {
    // Sipariş sorgulama
    if (lowercaseInput.includes('sipariş') || lowercaseInput.includes('siparişim')) {
      const orders = await getOrderInfo(userId);
      
      if (orders.length === 0) {
        return 'Henüz hiç siparişiniz bulunmuyor.';
      }

      const lastOrder = orders[0];
      const orderStatus = {
        pending: 'Onay Bekliyor',
        processing: 'Hazırlanıyor',
        shipped: 'Kargoya Verildi',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal Edildi'
      };

      response = `Son ${orders.length} siparişiniz:\n\n`;
      
      orders.forEach(order => {
        response += `📦 Sipariş #${order.id}\n`;
        response += `Durum: ${orderStatus[order.status]}\n`;
        response += `Tarih: ${new Date(order.created_at).toLocaleDateString('tr-TR')}\n`;
        response += `Ürünler:\n`;
        
        order.order_items.forEach(item => {
          response += `- ${item.products.name} (${item.quantity} adet)\n`;
        });
        
        response += `Toplam: ${order.final_amount.toLocaleString('tr-TR')} TL\n\n`;
      });

      return response;
    }

    // Ürün sorgulama
    if (lowercaseInput.includes('ürün') || lowercaseInput.includes('fiyat') || 
        lowercaseInput.includes('telefon') || lowercaseInput.includes('kaç')) {
      
      // Arama terimini temizle
      const searchTerms = lowercaseInput
        .replace(/ürün|fiyat|var mı|kaç|tl|lira|para|ne kadar|fiyatı|fiyatları|\?/g, '')
        .trim();

      if (searchTerms.length < 2) {
        return 'Lütfen aramak istediğiniz ürünü belirtin. Örnek: "iPhone fiyatı nedir?" veya "Laptop var mı?"';
      }

      const products = await getProductInfo(searchTerms);
      
      if (products.length === 0) {
        return `Üzgünüm, "${searchTerms}" ile ilgili ürün bulunamadı. Farklı bir arama terimi deneyebilir misiniz?\nÖrnek: "Samsung" veya "iPhone" gibi.`;
      }

      response = `"${searchTerms}" araması için bulunan ürünler:\n\n`;
      products.forEach(product => {
        response += `📱 ${product.name}\n`;
        if (product.categories?.name) {
          response += `📂 Kategori: ${product.categories.name}\n`;
        }
        response += `💰 Fiyat: ${product.price.toLocaleString('tr-TR')} TL\n`;
        response += `📦 Stok: ${product.stock_quantity > 0 ? `${product.stock_quantity} adet mevcut` : 'Stokta yok'}\n`;
        if (product.description) {
          const shortDesc = product.description.length > 100 
            ? product.description.slice(0, 100) + '...' 
            : product.description;
          response += `ℹ️ ${shortDesc}\n`;
        }
        response += '\n';
      });

      if (products.length === 5) {
        response += '* Daha fazla ürün mevcut. Lütfen daha spesifik bir arama yapın.\n\n';
      }

      response += 'Başka bir ürün hakkında bilgi almak ister misiniz?';
      return response;
    }

    // İade sorgulama
    if (lowercaseInput.includes('iade')) {
      const orders = await getOrderInfo(userId);
      const recentOrders = orders.filter(order => 
        new Date(order.created_at) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      );

      if (recentOrders.length === 0) {
        return 'Son 14 gün içinde iade edilebilecek bir siparişiniz bulunmuyor.';
      }

      response = 'İade edilebilecek siparişleriniz:\n\n';
      recentOrders.forEach(order => {
        response += `📦 Sipariş #${order.id}\n`;
        response += `Tarih: ${new Date(order.created_at).toLocaleDateString('tr-TR')}\n`;
        response += `Ürünler:\n`;
        order.order_items.forEach(item => {
          response += `- ${item.products.name}\n`;
        });
        response += '\n';
      });

      response += 'İade işlemi için müşteri hizmetlerimizle iletişime geçebilirsiniz.';
      return response;
    }

    // Varsayılan yanıt
    return 'Size nasıl yardımcı olabilirim? Sipariş takibi, ürün bilgisi veya iade işlemleri hakkında sorularınızı yanıtlayabilirim.';

  } catch (error) {
    console.error('Veri çekme hatası:', error);
    return 'Üzgünüm, şu anda bilgileri getirirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
  }
}

export default function AIChat() {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateResponse(input, user?.id);
      
      const aiResponse = {
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI yanıt hatası:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya müşteri hizmetleri ile iletişime geçin.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            [`@media (max-width: ${theme.breakpoints.sm})`]: {
              width: 50,
              height: 50,
            },
          })}
        >
          <IconRobot size={28} />
        </ActionIcon>
      </div>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Group>
            <Avatar color="orange" radius="xl">AI</Avatar>
            <Text>AI Yardımcı</Text>
          </Group>
        }
        size="lg"
        padding="md"
        styles={{
          modal: {
            zIndex: 10000
          }
        }}
      >
        <Stack spacing="md">
          <ScrollArea h={400} offsetScrollbars>
            <Stack spacing="md">
              {messages.map((message, index) => (
                <Paper
                  key={index}
                  p="sm"
                  radius="md"
                  bg={message.role === 'user' ? 'orange.1' : 'gray.0'}
                  style={{
                    marginLeft: message.role === 'user' ? 'auto' : 0,
                    marginRight: message.role === 'user' ? 0 : 'auto',
                    maxWidth: '80%',
                  }}
                >
                  <Group spacing="sm" align="flex-start">
                    <Avatar
                      color={message.role === 'user' ? 'orange' : 'gray'}
                      radius="xl"
                    >
                      {message.role === 'user' ? 'K' : 'AI'}
                    </Avatar>
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" weight={500} mb={4}>
                        {message.role === 'user' ? 'Siz' : 'AI Yardımcı'}
                      </Text>
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              ))}
              {loading && (
                <Paper
                  p="sm"
                  radius="md"
                  bg="gray.0"
                  style={{ marginRight: 'auto', maxWidth: '80%' }}
                >
                  <Group spacing="sm" align="center">
                    <Avatar color="gray" radius="xl">AI</Avatar>
                    <Loader size="sm" />
                  </Group>
                </Paper>
              )}
            </Stack>
          </ScrollArea>

          <Group align="flex-start" spacing="sm">
            <TextInput
              placeholder="Mesajınızı yazın..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ flex: 1 }}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              variant="filled"
              color="orange"
            >
              <IconSend size={16} />
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
} 