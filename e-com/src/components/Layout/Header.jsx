import { 
  AppShell, 
  Container, 
  Group, 
  Button, 
  Text,
  Burger,
  Drawer,
  Stack,
  TextInput,
  ActionIcon,
  Badge,
  Box,
  Menu,
  Avatar,
  Indicator,
  Transition,
  Paper,
  UnstyledButton,
  HoverCard,
  Grid,
  useMantineTheme
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconShoppingCart, IconHeart, IconUser, IconLogout, IconPackage, IconChevronDown } from '@tabler/icons-react';
import { useAuthStore } from '../../stores/authStore';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useWindowScroll } from '@mantine/hooks';

const categories = [
  {
    title: 'Elektronik',
    slug: 'elektronik',
    navLink: '/kategori/elektronik'
  },
  {
    title: 'Ev & Yaşam',
    slug: 'ev-yasam',
    navLink: '/kategori/ev-yasam'
  },
  {
    title: 'Kozmetik',
    slug: 'kozmetik',
    navLink: '/kategori/kozmetik'
  },
  {
    title: 'Ayakkabı & Çanta',
    slug: 'ayakkabi-canta',
    navLink: '/kategori/ayakkabi-canta'
  },
  {
    title: 'Spor & Outdoor',
    slug: 'spor-outdoor',
    navLink: '/kategori/spor-outdoor'
  }
];

const subCategories = [
  {
    mainCategory: 'Elektronik',
    title: 'Telefon',
    items: [
      'Cep Telefonu',
      'Android Cep Telefonları',
      'iPhone iOS Telefonlar',
      'Telefon Kılıfları',
      'Şarj Cihazları',
      'Powerbank',
      'Araç İçi Telefon Tutucu',
      'iPhone Kılıflar',
      'Kulaklıklar'
    ]
  },
  {
    mainCategory: 'Elektronik',
    title: 'TV & Görüntü & Ses',
    items: [
      'Televizyon',
      'Smart TV',
      'QLED TV',
      'OLED TV',
      'TV Kumandaları',
      'Soundbar',
      'Projeksiyon Cihazı',
      'Media Player',
      'Hoparlör',
      'Kulaklık'
    ]
  },
  {
    mainCategory: 'Elektronik',
    title: 'Bilgisayar & Tablet',
    items: [
      'Bilgisayarlar',
      'Tablet',
      'Bilgisayar Bileşenleri',
      'Monitör',
      'Yazıcı & Tarayıcı',
      'Ağ & Modem',
      'Klavye',
      'Mouse',
      'Grafik Tablet',
      'Çocuk Çizim Tableti'
    ]
  },
  {
    mainCategory: 'Ev & Yaşam',
    title: 'Küçük Ev Aletleri',
    items: [
      'Süpürge',
      'Robot Süpürge',
      'Dikey Süpürge',
      'Ütü',
      'Kahve Makinesi',
      'Çay Makinesi',
      'Blender Seti',
      'Tost Makinesi',
      'Su Isıtıcı & Kettle',
      'Mikser & Mikser Seti'
    ]
  },
  {
    mainCategory: 'Ev & Yaşam',
    title: 'Beyaz Eşya',
    items: [
      'Buzdolabı',
      'Çamaşır Makinesi',
      'Bulaşık Makinesi',
      'Kurutma Makinesi',
      'Derin Dondurucu',
      'Ankastre Setler',
      'Kombi',
      'Mikrodalga Fırın',
      'Mini & Midi Fırın',
      'Aspiratör'
    ]
  },
  {
    mainCategory: 'Ev & Yaşam',
    title: 'Giyilebilir Teknoloji',
    items: [
      'Akıllı Saat',
      'Akıllı Bileklik',
      'VR Gözlük',
      'Akıllı Gözlük',
      'Akıllı Yüzük'
    ]
  },
  {
    mainCategory: 'Kozmetik',
    title: 'Kişisel Bakım Aletleri',
    items: [
      'Saç Düzleştirici',
      'Saç Maşası',
      'Saç Kurutma Makinesi',
      'Tıraş Makinesi',
      'Tartı',
      'Epilasyon Aletleri',
      'IPL Lazer Epilasyon'
    ]
  },
  {
    mainCategory: 'Kozmetik',
    title: 'Parfüm & Deodorant',
    items: [
      'Kadın Parfüm',
      'Erkek Parfüm',
      'Deodorant & Roll-on',
      'Parfüm Setleri'
    ]
  },
  {
    mainCategory: 'Kozmetik',
    title: 'Makyaj',
    items: [
      'Fondöten',
      'Maskara',
      'Ruj',
      'Göz Farı',
      'Allık',
      'Makyaj Seti'
    ]
  },
  {
    mainCategory: 'Ayakkabı & Çanta',
    title: 'Kadın Ayakkabı',
    items: [
      'Spor Ayakkabı',
      'Topuklu Ayakkabı',
      'Bot',
      'Çizme',
      'Günlük Ayakkabı',
      'Sandalet'
    ]
  },
  {
    mainCategory: 'Ayakkabı & Çanta',
    title: 'Erkek Ayakkabı',
    items: [
      'Spor Ayakkabı',
      'Klasik Ayakkabı',
      'Bot',
      'Günlük Ayakkabı',
      'Sandalet'
    ]
  },
  {
    mainCategory: 'Ayakkabı & Çanta',
    title: 'Çanta',
    items: [
      'Kadın Çanta',
      'Erkek Çanta',
      'Sırt Çantası',
      'Laptop Çantası',
      'Valiz'
    ]
  },
  {
    mainCategory: 'Spor & Outdoor',
    title: 'Spor Giyim',
    items: [
      'Eşofman',
      'Spor Ayakkabı',
      'Spor Tişört',
      'Tayt',
      'Şort',
      'Yağmurluk'
    ]
  },
  {
    mainCategory: 'Spor & Outdoor',
    title: 'Spor Aletleri',
    items: [
      'Koşu Bandı',
      'Kondisyon Bisikleti',
      'Dambıl & Ağırlık',
      'Pilates Malzemeleri',
      'Yoga Matı'
    ]
  },
  {
    mainCategory: 'Spor & Outdoor',
    title: 'Outdoor & Kamp',
    items: [
      'Çadır',
      'Kamp Sandalyesi',
      'Termos',
      'Kamp Lambası',
      'Uyku Tulumu'
    ]
  }
];

export function AppHeader() {
  const { user, signOut, userProfile } = useAuthStore();
  const { items, loadCart } = useCartStore();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const [scroll, scrollTo] = useWindowScroll();
  const [prevScroll, setPrevScroll] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categories[0].title);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef(null);
  const theme = useMantineTheme();

  useEffect(() => {
    if (user) {
      loadCart(user.id);
    }
  }, [user, loadCart]);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.offsetHeight);
    }
  }, [isDropdownVisible]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = scroll.y;
      const isScrollingDown = currentScroll > prevScroll;
      
      if (isDropdownVisible && dropdownHeight) {
        if (currentScroll > dropdownHeight) {
          setIsDropdownVisible(false);
        }
      }
      
      if (currentScroll > 100) {
        setIsVisible(!isScrollingDown);
      } else {
        setIsVisible(true);
      }
      
      setPrevScroll(currentScroll);
    };

    handleScroll();
  }, [scroll.y, prevScroll, isDropdownVisible]);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setShowSearch(false);
    }
  };

  return (
    <Box 
      component="header" 
      sx={(theme) => ({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.white,
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        transition: 'transform 300ms ease',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      })}
    >
      <Container size="xl" h={60}>
        <Group h="100%" justify="space-between">
          {/* Mobil Menü Burger */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />

          {/* Logo */}
          <Text 
            component={Link} 
            to="/" 
            size="xl" 
            fw={900}
            variant="gradient"
            gradient={{ from: 'orange', to: 'red' }}
          >
            E-Ticaret
          </Text>

          {/* Desktop Menü */}
          <Group gap={30} visibleFrom="sm" style={{ position: 'relative' }}>
            <HoverCard 
              width="100%" 
              position="bottom-start" 
              radius="md" 
              shadow="md"
              withinPortal={false}
              onOpen={() => setIsDropdownVisible(true)}
              onClose={() => setIsDropdownVisible(false)}
              styles={{
                dropdown: {
                  padding: 0,
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '1320px',
                  maxWidth: 'calc(100vw - 48px)',
                  marginTop: '1rem',
                  opacity: isVisible && isDropdownVisible ? 1 : 0,
                  visibility: isVisible && isDropdownVisible ? 'visible' : 'hidden',
                  transition: 'opacity 300ms ease, visibility 300ms ease',
                  zIndex: 99
                }
              }}
            >
              <HoverCard.Target>
                <UnstyledButton
                  sx={(theme) => ({
                    padding: '8px 12px',
                    borderRadius: theme.radius.sm,
                    color: theme.black,
                    '&:hover': {
                      backgroundColor: theme.colors.gray[0]
                    }
                  })}
                >
                  <Group gap={5}>
                    <Text fw={500}>Tüm Kategoriler</Text>
                    <IconChevronDown size={16} />
                  </Group>
                </UnstyledButton>
              </HoverCard.Target>

              <HoverCard.Dropdown p={0}>
                <Grid gutter={0}>
                  {/* Sol Sidebar - Ana Kategoriler */}
                  <Grid.Col 
                    span={3} 
                    style={{ 
                      borderRight: '1px solid #eee',
                      backgroundColor: '#f8f8f8',
                      padding: '12px 0',
                      minWidth: '240px'
                    }}
                  >
                    <Stack spacing={0}>
                      {categories.map((category) => (
                        <UnstyledButton
                          key={category.slug}
                          sx={(theme) => ({
                            width: '100%',
                            padding: '12px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: activeCategory === category.title ? 'white' : 'transparent',
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'white',
                              '& .category-text': {
                                color: theme.colors.orange[6]
                              }
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '3px',
                              backgroundColor: theme.colors.orange[6],
                              opacity: activeCategory === category.title ? 1 : 0
                            }
                          })}
                          onClick={() => setActiveCategory(category.title)}
                        >
                          <Group position="apart" style={{ width: '100%' }}>
                            <Text 
                              className="category-text"
                              size="sm"
                              sx={(theme) => ({
                                color: activeCategory === category.title ? theme.colors.orange[6] : theme.colors.gray[7],
                                fontWeight: 500
                              })}
                            >
                              {category.title}
                            </Text>
                            <IconChevronDown 
                              size={16} 
                              style={{ 
                                transform: 'rotate(-90deg)',
                                color: activeCategory === category.title ? theme.colors.orange[6] : theme.colors.gray[5]
                              }}
                            />
                          </Group>
                        </UnstyledButton>
                      ))}
                    </Stack>
                  </Grid.Col>

                  {/* Sağ Taraf - Alt Kategoriler */}
                  <Grid.Col 
                    span={9} 
                    p="xl" 
                    style={{ 
                      backgroundColor: 'white',
                      minHeight: '400px'
                    }}
                  >
                    <Grid>
                      {subCategories
                        .filter(sub => sub.mainCategory === activeCategory)
                        .map((subCategory) => (
                          <Grid.Col span={4} key={subCategory.title}>
                            <Stack spacing={8}>
                              <Text 
                                fw={600} 
                                size="sm" 
                                color="orange.6"
                                mb={10}
                              >
                                {subCategory.title}
                              </Text>
                              <Stack spacing={6}>
                                {subCategory.items.map((item) => (
                                  <Text
                                    component={Link}
                                    to={`/kategori/${activeCategory.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    key={item}
                                    size="sm"
                                    sx={(theme) => ({
                                      color: theme.colors.gray[6],
                                      textDecoration: 'none',
                                      '&:hover': {
                                        color: theme.colors.orange[6]
                                      }
                                    })}
                                  >
                                    {item}
                                  </Text>
                                ))}
                              </Stack>
                            </Stack>
                          </Grid.Col>
                        ))}
                    </Grid>
                  </Grid.Col>
                </Grid>
              </HoverCard.Dropdown>
            </HoverCard>

            {categories.map((category) => (
              <Text 
                key={category.slug}
                component={Link} 
                to={category.navLink}
                fw={500}
                sx={(theme) => ({
                  color: theme.black,
                  textDecoration: 'none',
                  '&:hover': {
                    color: theme.colors.orange[6]
                  }
                })}
              >
                {category.title}
              </Text>
            ))}
          </Group>

          {/* Sağ Menü */}
          <Group>
            {/* Arama Butonu */}
            <ActionIcon 
              variant="subtle" 
              onClick={() => setShowSearch(!showSearch)}
              size="lg"
            >
              <IconSearch size={20} />
            </ActionIcon>

            {/* Favoriler */}
            <ActionIcon 
              component={Link}
              to="/favorites"
              variant="subtle"
              size="lg"
            >
              <IconHeart size={20} />
            </ActionIcon>

            {/* Sepet */}
            <ActionIcon
              component={Link}
              to="/cart"
              size="lg"
              variant="light"
              color="gray"
            >
              <Indicator label={cartItemCount} size={16} disabled={cartItemCount === 0}>
                <IconShoppingCart size={20} />
              </Indicator>
            </ActionIcon>

            {/* Kullanıcı Menüsü */}
            {user ? (
              <Menu position="bottom-end" shadow="md">
                <Menu.Target>
                  <ActionIcon variant="subtle" size="lg">
                    <Avatar size="sm" color="orange" radius="xl">
                      {user.email[0].toUpperCase()}
                    </Avatar>
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Hesabım</Menu.Label>
                  <Menu.Item 
                    leftSection={<IconUser size={14} />}
                    component={Link}
                    to="/profile"
                  >
                    Profilim
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<IconPackage size={14} />}
                    component={Link}
                    to="/orders"
                  >
                    Siparişlerim
                  </Menu.Item>
                  {user && userProfile?.role === 'admin' && (
                    <Menu.Item component={Link} to="/admin">
                      Admin Panel
                    </Menu.Item>
                  )}
                  <Menu.Divider />
                  <Menu.Item 
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={signOut}
                  >
                    Çıkış Yap
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button component={Link} to="/login" variant="filled">
                Giriş Yap
              </Button>
            )}
          </Group>
        </Group>
      </Container>

      {/* Arama Çubuğu */}
      <Transition mounted={showSearch} transition="slide-down" duration={200}>
        {(styles) => (
          <Paper 
            style={styles} 
            shadow="sm"
            p="md"
          >
            <Container size="xl">
              <form onSubmit={handleSearch}>
                <TextInput
                  placeholder="Ürün, kategori veya marka ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  rightSection={
                    <ActionIcon variant="filled" color="orange" type="submit">
                      <IconSearch size={16} />
                    </ActionIcon>
                  }
                />
              </form>
            </Container>
          </Paper>
        )}
      </Transition>

      {/* Mobil Menü */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title="Menü"
        hiddenFrom="sm"
        overlayProps={{
          opacity: 0.5,
          blur: 4
        }}
      >
        <Stack>
          <TextInput
            placeholder="Ara..."
            rightSection={<IconSearch size={16} />}
          />
          {categories.map((category) => (
            <Button
              key={category.slug}
              component={Link}
              to={category.navLink}
              variant="subtle"
              fullWidth
              onClick={close}
            >
              {category.title}
            </Button>
          ))}
          {user ? (
            <>
              <Button component={Link} to="/profile" variant="subtle" fullWidth onClick={close}>
                Profilim
              </Button>
              <Button component={Link} to="/orders" variant="subtle" fullWidth onClick={close}>
                Siparişlerim
              </Button>
              <Button color="red" onClick={() => { signOut(); close(); }} fullWidth>
                Çıkış Yap
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" fullWidth onClick={close}>
              Giriş Yap
            </Button>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
} 