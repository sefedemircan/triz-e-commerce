import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Select,
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Text,
  Pagination,
  SimpleGrid,
  Box,
  Drawer,
  ActionIcon,
  Loader,
  Input,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFilter, IconSearch } from '@tabler/icons-react';
import { productService } from '../../services/supabase/products';
import ProductCard from '../../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  // Filtreler
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    priceRange: [0, 5000],
    page: parseInt(searchParams.get('page')) || 1
  });

  // Geçici fiyat aralığı state'i
  const [tempPriceRange, setTempPriceRange] = useState(filters.priceRange);

  // Yerel input değerleri için state'ler
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  const sortOptions = [
    { value: 'newest', label: 'En Yeniler' },
    { value: 'price-asc', label: 'Fiyat (Düşükten Yükseğe)' },
    { value: 'price-desc', label: 'Fiyat (Yüksekten Düşüğe)' },
    { value: 'name-asc', label: 'İsim (A-Z)' },
    { value: 'name-desc', label: 'İsim (Z-A)' }
  ];

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await productService.getProducts({
        search: filters.search,
        category: filters.category,
        sort: filters.sort,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        page: filters.page
      });
      setProducts(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Products loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateFilters({ page: 1 });
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // URL'i güncelle
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  // Input değerlerini formatlama ve validasyon fonksiyonları
  const handleMinPriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Sadece rakamları al
    setMinPriceInput(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Sadece rakamları al
    setMaxPriceInput(value);
  };

  const handlePriceFilter = () => {
    const minValue = parseInt(minPriceInput) || 0;
    const maxValue = parseInt(maxPriceInput) || 5000;
    
    setTempPriceRange([minValue, maxValue]);
    updateFilters({ 
      priceRange: [minValue, maxValue], 
      page: 1 
    });
  };

  const PriceInput = ({ value, onChange, label, placeholder }) => (
    <div style={{ flex: 1 }}>
      <Text size="sm" mb={4}>{label}</Text>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '36px',
            padding: '0 45px 0 12px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            textAlign: 'right',
            outline: 'none',
          }}
          onFocus={(e) => e.target.style.borderColor = '#228be6'}
          onBlur={(e) => e.target.style.borderColor = '#ced4da'}
        />
        <span style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#868e96',
          fontSize: '14px',
          pointerEvents: 'none'
        }}>
          TL
        </span>
      </div>
    </div>
  );

  const FilterSidebar = () => (
    <Stack spacing="md">
      <Paper withBorder p="md">
        <Text weight={500} mb="md">Fiyat Aralığı</Text>
        <Stack spacing="xs">
          <Group grow>
            <PriceInput
              label="Min"
              value={minPriceInput}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setMinPriceInput(value);
              }}
              placeholder="0"
            />
            <PriceInput
              label="Max"
              value={maxPriceInput}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setMaxPriceInput(value);
              }}
              placeholder="5000"
            />
          </Group>
          <Group grow mt="xs">
            {[500, 1000, 2000, 5000].map((price) => (
              <Button
                key={price}
                variant="light"
                size="xs"
                onClick={() => {
                  setMinPriceInput('0');
                  setMaxPriceInput(price.toString());
                  setTempPriceRange([0, price]);
                  updateFilters({ priceRange: [0, price], page: 1 });
                }}
              >
                {price.toLocaleString('tr-TR')} TL
              </Button>
            ))}
          </Group>
          <Button 
            onClick={handlePriceFilter}
            variant="filled"
            color="orange"
            fullWidth
            mt="sm"
          >
            Filtrele
          </Button>
        </Stack>
      </Paper>

      <Paper withBorder p="md">
        <Text weight={500} mb="md">Kategoriler</Text>
        <Stack spacing="xs">
          {/* Kategorileri buraya ekle */}
        </Stack>
      </Paper>
    </Stack>
  );

  return (
    <Container size="xl" py="xl">
      {/* Mobil Filtre Butonu */}
      <Box mb="md" hiddenFrom="sm">
        <Button 
          variant="light"
          fullWidth
          onClick={open}
        >
          <Group>
            <IconFilter size={20} />
            <span>Filtrele</span>
          </Group>
        </Button>
      </Box>

      <Grid>
        {/* Filtreler - Desktop */}
        <Grid.Col span={{ base: 0, sm: 3 }} visibleFrom="sm">
          <FilterSidebar />
        </Grid.Col>

        {/* Ürünler */}
        <Grid.Col span={{ base: 12, sm: 9 }}>
          {/* Üst Bar */}
          <Paper withBorder p="md" mb="md">
            <Group position="apart">
              <form onSubmit={handleSearch} style={{ flex: 1 }}>
                <TextInput
                  placeholder="Ürün ara..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  rightSection={
                    <ActionIcon type="submit" variant="filled" color="orange">
                      <IconSearch size={16} />
                    </ActionIcon>
                  }
                />
              </form>
              <Select
                value={filters.sort}
                onChange={(value) => updateFilters({ sort: value })}
                data={sortOptions}
                w={200}
              />
            </Group>
          </Paper>

          {/* Ürün Listesi */}
          {loading ? (
            <Stack align="center" py="xl">
              <Loader />
            </Stack>
          ) : (
            <>
              <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </SimpleGrid>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <Group position="center" mt="xl">
                  <Pagination
                    total={totalPages}
                    value={filters.page}
                    onChange={(page) => updateFilters({ page })}
                  />
                </Group>
              )}
            </>
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
        <FilterSidebar />
      </Drawer>
    </Container>
  );
} 