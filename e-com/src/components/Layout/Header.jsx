import { 
  Container, 
  Group, 
  Button, 
  Text,
  Burger,
  Drawer,
  Stack,
  TextInput,
  ActionIcon,
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
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconShoppingCart, IconHeart, IconUser, IconLogout, IconPackage, IconChevronDown } from '@tabler/icons-react';
import { useAuthStore } from '../../stores/authStore';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useWindowScroll } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const categories = [
  {
    title: 'electronics',
    slug: 'elektronik',
    navLink: '/kategori/elektronik'
  },
  {
    title: 'homeAndLiving',
    slug: 'ev-yasam',
    navLink: '/kategori/ev-yasam'
  },
  {
    title: 'cosmetics',
    slug: 'kozmetik',
    navLink: '/kategori/kozmetik'
  },
  {
    title: 'shoesAndBags',
    slug: 'ayakkabi-canta',
    navLink: '/kategori/ayakkabi-canta'
  },
  {
    title: 'sportsAndOutdoor',
    slug: 'spor-outdoor',
    navLink: '/kategori/spor-outdoor'
  }
];

const subCategories = [
  {
    mainCategory: 'electronics',
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
    mainCategory: 'electronics',
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
    mainCategory: 'electronics',
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
    mainCategory: 'homeAndLiving',
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
    mainCategory: 'homeAndLiving',
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
    mainCategory: 'homeAndLiving',
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
    mainCategory: 'cosmetics',
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
    mainCategory: 'cosmetics',
    title: 'Parfüm & Deodorant',
    items: [
      'Kadın Parfüm',
      'Erkek Parfüm',
      'Deodorant & Roll-on',
      'Parfüm Setleri'
    ]
  },
  {
    mainCategory: 'cosmetics',
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
    mainCategory: 'shoesAndBags',
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
    mainCategory: 'shoesAndBags',
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
    mainCategory: 'shoesAndBags',
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
    mainCategory: 'sportsAndOutdoor',
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
    mainCategory: 'sportsAndOutdoor',
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
    mainCategory: 'sportsAndOutdoor',
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

const categoryButtonStyles = {
  root: {
    width: '100%',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: '#fff',
    },

    '&.active': {
      backgroundColor: '#fff',
    }
  }
};

export function AppHeader() {
  const { t } = useTranslation();
  const { user, signOut, userProfile } = useAuthStore();
  const { items, loadCart } = useCartStore();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const [scroll] = useWindowScroll();
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
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
                    <Text fw={500}>{t('homePage.header.allCategories')}</Text>
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
                      padding: '12px 0',
                      minWidth: '240px',
                      height: '500px',
                      overflowY: 'auto',
                      backgroundColor: '#f8f8f8'
                    }}
                  >
                    <Stack spacing={0}>
                      {categories.map((category) => (
                        <UnstyledButton
                          key={category.slug}
                          styles={categoryButtonStyles}
                          className={activeCategory === category.title ? 'active' : ''}
                          onMouseEnter={() => setActiveCategory(category.title)}
                        >
                          <Group style={{ width: '100%' }}>
                            <Text 
                              className="category-text"
                              size="sm"
                              style={{ 
                                color: activeCategory === category.title ? theme.colors.orange[6] : theme.colors.gray[7],
                                fontWeight: 500,
                                transition: 'color 0.2s ease'
                              }}
                            >
                              {t(`homePage.categories.${category.title}`)}
                            </Text>
                            <IconChevronDown 
                              className="category-icon"
                              size={16} 
                              style={{ 
                                transform: 'rotate(-90deg)',
                                color: activeCategory === category.title ? theme.colors.orange[6] : theme.colors.gray[5],
                                transition: 'color 0.2s ease'
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
                      height: '500px',
                      overflowY: 'auto',
                      position: 'relative',
                      zIndex: 2
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
                                    to={`/kategori/${categories.find(cat => cat.title === activeCategory).slug}/${item.toLowerCase().replace(/\s+/g, '-')}`}
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
                {t(`homePage.categories.${category.title}`)}
              </Text>
            ))}
          </Group>

          {/* Sağ Menü */}
          <Group gap={10}>
            <ActionIcon
              variant="transparent"
              onClick={() => setShowSearch(!showSearch)}
              aria-label={t('homePage.header.search')}
            >
              <IconSearch size={22} />
            </ActionIcon>
            
            {/* Dil Değiştirici */}
            <LanguageSwitcher />

            <Link to="/favorites">
              <ActionIcon variant="transparent" aria-label={t('homePage.header.favorites')}>
                <IconHeart size={22} />
              </ActionIcon>
            </Link>

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
                  <Menu.Label>{t('homePage.header.myAccount')}</Menu.Label>
                  <Menu.Item 
                    leftSection={<IconUser size={14} />}
                    component={Link}
                    to="/profile"
                  >
                    {t('homePage.header.profile')}
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<IconPackage size={14} />}
                    component={Link}
                    to="/orders"
                  >
                    {t('homePage.header.orders')}
                  </Menu.Item>
                  {user && userProfile?.role === 'admin' && (
                    <Menu.Item component={Link} to="/admin">
                      {t('homePage.header.adminPanel')}
                    </Menu.Item>
                  )}
                  <Menu.Divider />
                  <Menu.Item 
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={signOut}
                  >
                    {t('homePage.header.logout')}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button component={Link} to="/login" variant="filled">
                {t('homePage.header.login')}
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
                  placeholder={t('homePage.header.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  rightSection={
                    <ActionIcon variant="filled" color="orange" type="submit">
                      <IconSearch size={16} />
                    </ActionIcon>
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowSearch(false);
                    }
                  }}
                  autoFocus
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
        title={t('homePage.header.menu')}
        hiddenFrom="sm"
        overlayProps={{
          opacity: 0.5,
          blur: 4
        }}
      >
        <Stack>
          <TextInput
            placeholder={t('homePage.header.search')}
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
              {t(`homePage.categories.${category.title}`)}
            </Button>
          ))}
          {user ? (
            <>
              <Button component={Link} to="/profile" variant="subtle" fullWidth onClick={close}>
                {t('homePage.header.profile')}
              </Button>
              <Button component={Link} to="/orders" variant="subtle" fullWidth onClick={close}>
                {t('homePage.header.orders')}
              </Button>
              <Button color="red" onClick={() => { signOut(); close(); }} fullWidth>
                {t('homePage.header.logout')}
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" fullWidth onClick={close}>
              {t('homePage.header.login')}
            </Button>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
} 