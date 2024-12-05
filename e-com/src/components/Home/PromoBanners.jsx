import { SimpleGrid, Card, Image, Text, Container, Box } from '@mantine/core';
import { Link } from 'react-router-dom';

const banners = [
  {
    id: 1,
    title: 'Yaz Koleksiyonu',
    description: 'Yeni sezon ürünlerde özel fiyatlar',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop',
    link: '/categories/summer'
  },
  {
    id: 2,
    title: 'Aksesuar',
    description: 'Tarzınızı tamamlayın',
    image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=800&auto=format&fit=crop',
    link: '/categories/accessories'
  },
  {
    id: 3,
    title: 'Ayakkabı',
    description: 'En rahat modeller',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    link: '/categories/shoes'
  }
];

export function PromoBanners() {
  return (
    <Box py={40}>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {banners.map((banner) => (
            <Card
              key={banner.id}
              p="lg"
              radius="md"
              component={Link}
              to={banner.link}
              sx={(theme) => ({
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              })}
            >
              <Card.Section>
                <Image
                  src={banner.image}
                  height={200}
                  alt={banner.title}
                />
              </Card.Section>

              <Text size="xl" fw={700} mt="md">
                {banner.title}
              </Text>
              <Text size="sm" color="dimmed" mt={5}>
                {banner.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
} 