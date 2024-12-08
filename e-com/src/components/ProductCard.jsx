import { 
  Card, 
  Image, 
  Text, 
  Badge, 
  Group, 
  Box,
  ActionIcon,
  Overlay,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { IconHeart, IconEye, IconShoppingCart } from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '../stores/authStore';
import { cartService } from '../services/supabase/cart';
import { useFavoriteStore } from '../stores/favoriteStore';

const ProductCard = ({ product }) => {
  const [showActions, setShowActions] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoriteStore();
  const isFav = isFavorite(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      notifications.show({
        title: 'Uyarı',
        message: 'Sepete eklemek için giriş yapmalısınız',
        color: 'yellow',
      });
      return;
    }

    try {
      await cartService.addToCart(user.id, product.id, 1);
      notifications.show({
        title: 'Başarılı',
        message: 'Ürün sepete eklendi',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Ürün sepete eklenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      notifications.show({
        title: 'Uyarı',
        message: 'Favorilere eklemek için giriş yapmalısınız',
        color: 'yellow',
      });
      return;
    }

    try {
      if (isFav) {
        await removeFromFavorites(user.id, product.id);
        notifications.show({
          title: 'Başarılı',
          message: 'Ürün favorilerden kaldırıldı',
          color: 'green',
        });
      } else {
        await addToFavorites(user.id, product.id);
        notifications.show({
          title: 'Başarılı',
          message: 'Ürün favorilere eklendi',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'İşlem sırasında bir hata oluştu',
        color: 'red',
      });
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding={0} 
      radius="md" 
      withBorder={false}
      onClick={handleProductClick}
      h="100%"
      display="flex"
      style={{ flexDirection: 'column' }}
      sx={(theme) => ({
        backgroundColor: theme.white,
        transition: 'all 200ms ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows.md,
        },
      })}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Card.Section style={{ position: 'relative' }}>
        <Image
          src={product.image_url}
          height={280}
          alt={product.name}
          styles={{
            image: {
              objectFit: 'cover',
            },
          }}
          fallbackSrc="https://placehold.co/600x400?text=Ürün+Görseli"
        />
        <Group 
          spacing={8}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: showActions ? 1 : 0,
            transform: showActions ? 'translateX(0)' : 'translateX(10px)',
            transition: 'all 200ms ease',
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 4,
            borderRadius: 4,
          }}
        >
          <ActionIcon 
            variant="transparent" 
            color="white" 
            size="md"
            onClick={handleAddToCart}
          >
            <IconShoppingCart size={18} />
          </ActionIcon>
          <ActionIcon 
            variant="transparent" 
            color={isFav ? 'red' : 'white'} 
            size="md"
            onClick={handleFavoriteClick}
          >
            <IconHeart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </ActionIcon>
          <ActionIcon 
            variant="transparent" 
            color="white" 
            size="md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
          >
            <IconEye size={18} />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Box p="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Text weight={500} size="md" lineClamp={2} style={{ flex: 1 }}>
          {product.name}
        </Text>
        
        <Box mt="auto">
          <Group position="apart" align="center">
            <Box>
              {product.original_price && product.original_price > product.price ? (
                <Group spacing={8} align="center">
                  <Text 
                    size="sm" 
                    color="dimmed" 
                    style={{ textDecoration: 'line-through' }}
                  >
                    {product.original_price.toLocaleString('tr-TR')} TL
                  </Text>
                  <Text weight={700} size="lg" color="dark">
                    {product.price.toLocaleString('tr-TR')} TL
                  </Text>
                </Group>
              ) : (
                <Text weight={700} size="lg" color="dark">
                  {product.price.toLocaleString('tr-TR')} TL
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

          {product.categories && (
            <Badge 
              variant="light" 
              color="gray" 
              size="sm" 
              component={Link}
              to={`/kategori/${product.categories.slug}`}
              mt="md"
              sx={(theme) => ({
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.colors.gray[1]
                }
              })}
            >
              {product.categories.name}
            </Badge>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default ProductCard;
export { ProductCard }; 