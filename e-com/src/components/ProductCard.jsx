import { 
  Card, 
  Image, 
  Text, 
  Badge, 
  Group, 
  Box,
  ActionIcon,
  Overlay,
  Button,
  Stack
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconHeart, IconEye, IconShoppingCart } from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '../stores/authStore';
import { cartService } from '../services/supabase/cart';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuthStore();
  
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      notifications.show({
        title: 'Giriş Yapın',
        message: 'Favorilere eklemek için giriş yapmalısınız',
        color: 'yellow'
      });
      return;
    }
    notifications.show({
      title: 'Başarılı',
      message: 'Ürün favorilere eklendi',
      color: 'green'
    });
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    // Hızlı görüntüleme modalı açılacak
  };

  const calculateDiscount = () => {
    if (!product.original_price) return null;
    const discount = ((product.original_price - product.price) / product.original_price) * 100;
    return Math.round(discount);
  };

  const discount = calculateDiscount();

  return (
    <Card 
      p={0}
      radius="md" 
      withBorder
      component={Link}
      to={`/products/${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      pos="relative"
      sx={(theme) => ({
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows.lg
        }
      })}
    >
      {discount && (
        <Badge 
          color="red" 
          variant="filled"
          pos="absolute"
          top={10}
          left={10}
          style={{ zIndex: 2 }}
          size="lg"
          radius="sm"
        >
          %{discount} İndirim
        </Badge>
      )}

      <Card.Section>
        <Box pos="relative">
          <Image
            src={product.image_url}
            height={280}
            alt={product.name}
            fit="cover"
          />
          
          {isHovered && (
            <Overlay 
              opacity={0.3} 
              center
              blur={3}
              style={{ zIndex: 1 }}
            >
              <Stack align="center" spacing="xs">
                <Button 
                  variant="white" 
                  leftIcon={<IconEye size={18} />}
                  radius="xl"
                  size="md"
                >
                  Hızlı Bak
                </Button>
                <Button 
                  variant="filled"
                  color="orange"
                  leftIcon={<IconShoppingCart size={18} />}
                  radius="xl"
                  size="md"
                >
                  Sepete Ekle
                </Button>
              </Stack>
            </Overlay>
          )}
        </Box>
      </Card.Section>

      <Box p="lg">
        <Text size="sm" color="dimmed" mb={4} tt="uppercase">
          {product.categories?.name}
        </Text>
        <Text weight={600} size="lg" lineClamp={2} mb={12}>
          {product.name}
        </Text>
        <Group position="apart" align="center">
          <Box>
            <Text weight={800} size="xl" color="orange">
              {product.price.toLocaleString('tr-TR')} TL
            </Text>
            {product.original_price && (
              <Text size="sm" color="dimmed" td="line-through">
                {product.original_price.toLocaleString('tr-TR')} TL
              </Text>
            )}
          </Box>
          {product.stock_quantity > 0 ? (
            <Badge variant="dot" color="green" size="lg">
              Stokta
            </Badge>
          ) : (
            <Badge variant="dot" color="red" size="lg">
              Tükendi
            </Badge>
          )}
        </Group>
      </Box>
    </Card>
  );
};

export default ProductCard;
export { ProductCard }; 