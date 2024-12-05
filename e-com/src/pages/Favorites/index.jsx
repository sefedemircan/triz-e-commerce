import { useEffect } from 'react';
import {
  Container,
  Title,
  SimpleGrid,
  Text,
  Button,
  Paper,
  Stack,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useFavoriteStore } from '../../stores/favoriteStore';
import ProductCard from '../../components/ProductCard';

export default function Favorites() {
  const { user } = useAuthStore();
  const { favorites, loading, loadFavorites } = useFavoriteStore();

  useEffect(() => {
    if (user) {
      loadFavorites(user.id);
    }
  }, [user]);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Text>Yükleniyor...</Text>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Paper p="xl" radius="md" withBorder>
          <Stack align="center" spacing="md">
            <Title order={2}>Favorileriniz Boş</Title>
            <Text c="dimmed">Favori ürününüz bulunmuyor.</Text>
            <Button component={Link} to="/products" variant="light">
              Ürünlere Göz At
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Favorilerim
      </Title>

      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
        {favorites.map((favorite) => (
          <ProductCard key={favorite.id} product={favorite.products} />
        ))}
      </SimpleGrid>
    </Container>
  );
} 