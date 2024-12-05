import { useEffect, useState } from 'react';
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
  RangeSlider,
  Checkbox,
  Button,
  Box,
  ActionIcon,
  Skeleton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustments, IconX } from '@tabler/icons-react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/supabase';

export default function CategoryPage() {
  const { slug } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({
    sort: 'newest',
    priceRange: [0, 5000],
    sizes: [],
    colors: [],
    brands: []
  });

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        // Bu fonksiyonları supabase servisinde oluşturmanız gerekecek
        const categoryData = await productService.getCategoryBySlug(slug);
        const productsData = await productService.getProductsByCategory(slug, filters);
        setCategory(categoryData);
        setProducts(productsData);
      } catch (error) {
        console.error('Kategori yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [slug, filters]);

  const sortOptions = [
    { value: 'newest', label: 'En Yeniler' },
    { value: 'price-asc', label: 'Fiyat (Düşükten Yükseğe)' },
    { value: 'price-desc', label: 'Fiyat (Yüksekten Düşüğe)' },
    { value: 'popular', label: 'En Popülerler' }
  ];

  const FilterDrawer = () => (
    <Drawer
      opened={opened}
      onClose={close}
      title="Filtreler"
      position="right"
      size="md"
      padding="lg"
    >
      <Stack spacing="xl">
        <Box>
          <Text weight={500} mb="md">Fiyat Aralığı</Text>
          <RangeSlider
            value={filters.priceRange}
            onChange={(value) => setFilters({ ...filters, priceRange: value })}
            min={0}
            max={5000}
            step={100}
            label={(value) => `${value} TL`}
            marks={[
              { value: 0, label: '0 TL' },
              { value: 2500, label: '2500 TL' },
              { value: 5000, label: '5000 TL' }
            ]}
          />
        </Box>

        <Box>
          <Text weight={500} mb="md">Beden</Text>
          <Checkbox.Group
            value={filters.sizes}
            onChange={(value) => setFilters({ ...filters, sizes: value })}
          >
            <Stack spacing="xs">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <Checkbox key={size} value={size} label={size} />
              ))}
            </Stack>
          </Checkbox.Group>
        </Box>

        <Box>
          <Text weight={500} mb="md">Renk</Text>
          <Checkbox.Group
            value={filters.colors}
            onChange={(value) => setFilters({ ...filters, colors: value })}
          >
            <Stack spacing="xs">
              {['Siyah', 'Beyaz', 'Kırmızı', 'Mavi', 'Yeşil'].map((color) => (
                <Checkbox key={color} value={color} label={color} />
              ))}
            </Stack>
          </Checkbox.Group>
        </Box>

        <Box>
          <Text weight={500} mb="md">Marka</Text>
          <Checkbox.Group
            value={filters.brands}
            onChange={(value) => setFilters({ ...filters, brands: value })}
          >
            <Stack spacing="xs">
              {['Nike', 'Adidas', 'Puma', 'Reebok'].map((brand) => (
                <Checkbox key={brand} value={brand} label={brand} />
              ))}
            </Stack>
          </Checkbox.Group>
        </Box>

        <Button 
          onClick={close}
          variant="filled"
          color="orange"
          fullWidth
        >
          Filtreleri Uygula
        </Button>
      </Stack>
    </Drawer>
  );

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Skeleton height={50} mb="xl" />
        <Grid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid.Col key={i} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
              <Skeleton height={350} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group position="apart" mb={30}>
        <Box>
          <Title order={1} size="h2" mb={8}>
            {category?.name || 'Kategori'}
          </Title>
          <Text c="dimmed">
            {products.length} ürün bulundu
          </Text>
        </Box>
        <Group>
          <Select
            value={filters.sort}
            onChange={(value) => setFilters({ ...filters, sort: value })}
            data={sortOptions}
            size="sm"
            w={200}
          />
          <ActionIcon 
            variant="light"
            size="lg"
            onClick={open}
            color="orange"
          >
            <IconAdjustments size={20} />
          </ActionIcon>
        </Group>
      </Group>

      <Grid gutter="xl">
        {products.map((product) => (
          <Grid.Col key={product.id} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
            <ProductCard product={product} />
          </Grid.Col>
        ))}
      </Grid>

      <FilterDrawer />
    </Container>
  );
} 