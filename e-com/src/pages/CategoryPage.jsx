import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Title,
  Text,
  Select,
  Group,
  Drawer,
  Stack,
  Button,
  Box,
  ActionIcon,
  Skeleton,
  Paper,
  Divider,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustments } from '@tabler/icons-react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/supabase/products';

export default function CategoryPage() {
  const { slug } = useParams();
  const normalizedSlug = slug?.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    sort: 'newest',
    priceRange: [0, 95000],
    page: 1
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        const categoryData = await productService.getCategoryBySlug(normalizedSlug);
        const { data: productsData, totalPages } = await productService.getProductsByCategory(normalizedSlug, filters);
        
        setCategory(categoryData);
        setProducts(productsData);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Kategori yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (normalizedSlug) {
      loadCategoryData();
    }
  }, [normalizedSlug, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePriceChange = (type, value) => {
    // Sadece sayı ve boş değer girişine izin ver
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setPriceRange(prev => ({
      ...prev,
      [type]: numericValue
    }));
  };

  const handlePriceFilter = () => {
    const min = Number(priceRange.min) || 0;
    const max = Number(priceRange.max) || 5000;
    
    updateFilters({
      priceRange: [min, max]
    });
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Skeleton height={50} mb="xl" />
        <Grid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
              <Skeleton height={350} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Box mb={40}>
        <Title order={1}>{category?.name}</Title>
        <Text c="dimmed" mt={10}>
          {category?.description}
        </Text>
      </Box>

      <Grid>
        {/* Sol Sidebar - Filtreler */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md">
            <Stack>
              <Text weight={500}>Fiyat Aralığı</Text>
              <Group grow>
                <TextInput
                  ref={minPriceRef}
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  rightSection={<Text size="sm" color="dimmed">TL</Text>}
                  styles={{
                    input: {
                      '&:focus': {
                        borderColor: 'var(--mantine-color-orange-6)',
                      },
                    },
                  }}
                  onClick={() => minPriceRef.current?.select()}
                />
                <TextInput
                  ref={maxPriceRef}
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  rightSection={<Text size="sm" color="dimmed">TL</Text>}
                  styles={{
                    input: {
                      '&:focus': {
                        borderColor: 'var(--mantine-color-orange-6)',
                      },
                    },
                  }}
                  onClick={() => maxPriceRef.current?.select()}
                />
              </Group>
              <Button 
                variant="light" 
                color="orange" 
                onClick={handlePriceFilter}
                fullWidth
              >
                Filtrele
              </Button>

              <Divider my="sm" />

              <Text weight={500}>Sıralama</Text>
              <Select
                value={filters.sort}
                onChange={(value) => updateFilters({ sort: value })}
                data={[
                  { value: 'newest', label: 'En Yeniler' },
                  { value: 'price-asc', label: 'Fiyat (Düşükten Yükseğe)' },
                  { value: 'price-desc', label: 'Fiyat (Yüksekten Düşüğe)' },
                  { value: 'name-asc', label: 'İsim (A-Z)' },
                  { value: 'name-desc', label: 'İsim (Z-A)' }
                ]}
              />
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Sağ Taraf - Ürünler */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Grid gutter="md">
            {products.map((product) => (
              <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4 }}>
                <ProductCard product={product} />
              </Grid.Col>
            ))}
          </Grid>

          {products.length === 0 && (
            <Paper withBorder p="xl" mt="md">
              <Text align="center">Bu kategoride henüz ürün bulunmuyor.</Text>
            </Paper>
          )}
        </Grid.Col>
      </Grid>

      {/* Mobil Filtre Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Filtreler"
        position="right"
        size="md"
      >
        {/* Drawer içeriği */}
      </Drawer>
    </Container>
  );
} 