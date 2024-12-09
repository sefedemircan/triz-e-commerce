import { useEffect, useState } from 'react';
import { brandService } from '../../services/supabase/brands';
import { Container, Title, Box, Skeleton, Group, Badge } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { Link } from 'react-router-dom';

export function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await brandService.getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Markalar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  if (loading) return <Skeleton height={200} radius="md" />;

  return (
    <Box py={40}>
      <Container size="xl">
        <Group position="apart" mb={30}>
          <Group spacing="xs">
            <Title order={2} size="h3" weight={600}>
              Popüler Markalar
            </Title>
            <Badge variant="dot" color="orange" size="lg">
              Seçkin
            </Badge>
          </Group>
        </Group>

        <Carousel
          slideSize={{ base: '33.333333%', sm: '25%', md: '20%', lg: '16.666667%' }}
          slideGap="lg"
          align="start"
          slidesToScroll={2}
          controlsOffset="xl"
          loop
          withControls
          dragFree
          styles={{
            root: {
              width: '100%'
            },
            control: {
              opacity: 1,
              backgroundColor: 'white',
              border: '1px solid #eee',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              width: 40,
              height: 40,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'white',
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                opacity: 0,
                cursor: 'default',
                pointerEvents: 'none'
              }
            },
            viewport: {
              padding: '10px 0',
            }
          }}
        >
          {brands.map((brand) => (
            <Carousel.Slide key={brand.id}>
              <Box
                component={Link}
                to={`/brands/${brand.slug}`}
                sx={(theme) => ({
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 140,
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: theme.radius.md,
                  border: '1px solid #eee',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                    borderColor: theme.colors.orange[3],
                  },
                  '&::after': {
                    content: '""',
                    display: 'block',
                    paddingBottom: '100%',
                  }
                })}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '120px',
                      maxHeight: '60px',
                      objectFit: 'contain',
                      filter: 'grayscale(100%)',
                      opacity: 0.8,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.filter = 'grayscale(0%)';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.filter = 'grayscale(100%)';
                      e.currentTarget.style.opacity = '0.8';
                    }}
                  />
                </Box>
              </Box>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
} 