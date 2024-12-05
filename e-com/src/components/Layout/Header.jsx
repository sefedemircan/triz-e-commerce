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
  HoverCard
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconShoppingCart, IconHeart, IconUser, IconLogout, IconPackage, IconChevronDown } from '@tabler/icons-react';
import { useAuthStore } from '../../stores/authStore';
import { useState, useEffect } from 'react';
import { useCartStore } from '../../stores/cartStore';

const categories = [
  {
    title: 'Kadın',
    slug: 'kadin',
    subcategories: [
      { name: 'Üst Giyim', slug: 'ust-giyim' },
      { name: 'Alt Giyim', slug: 'alt-giyim' },
      { name: 'Dış Giyim', slug: 'dis-giyim' },
      { name: 'İç Giyim', slug: 'ic-giyim' }
    ]
  },
  {
    title: 'Erkek',
    slug: 'erkek',
    subcategories: [
      { name: 'Üst Giyim', slug: 'ust-giyim' },
      { name: 'Alt Giyim', slug: 'alt-giyim' },
      { name: 'Dış Giyim', slug: 'dis-giyim' },
      { name: 'İç Giyim', slug: 'ic-giyim' }
    ]
  },
  {
    title: 'Çocuk',
    slug: 'cocuk',
    subcategories: [
      { name: 'Kız Çocuk', slug: 'kiz-cocuk' },
      { name: 'Erkek Çocuk', slug: 'erkek-cocuk' },
      { name: 'Bebek', slug: 'bebek' }
    ]
  }
];

export function AppHeader() {
  const { user, signOut } = useAuthStore();
  const { items, loadCart } = useCartStore();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart(user.id);
    }
  }, [user, loadCart]);

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
        position: 'sticky',
        top: 0,
        backgroundColor: theme.white,
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
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
          <Group gap={30} visibleFrom="sm">
            {categories.map((category) => (
              <HoverCard 
                key={category.slug} 
                width={200} 
                position="bottom" 
                radius="md" 
                shadow="md"
                withinPortal
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
                      <Text fw={500}>{category.title}</Text>
                      <IconChevronDown size={16} />
                    </Group>
                  </UnstyledButton>
                </HoverCard.Target>

                <HoverCard.Dropdown>
                  <Stack gap="xs">
                    {category.subcategories.map((sub) => (
                      <UnstyledButton
                        key={sub.slug}
                        component={Link}
                        to={`/category/${category.slug}/${sub.slug}`}
                        sx={(theme) => ({
                          padding: '8px 12px',
                          borderRadius: theme.radius.sm,
                          width: '100%',
                          '&:hover': {
                            backgroundColor: theme.colors.gray[0]
                          }
                        })}
                      >
                        <Text size="sm">{sub.name}</Text>
                      </UnstyledButton>
                    ))}
                  </Stack>
                </HoverCard.Dropdown>
              </HoverCard>
            ))}
            <Text component={Link} to="/campaigns" fw={500}>Kampanyalar</Text>
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
      >
        <Stack>
          <TextInput
            placeholder="Ara..."
            rightSection={<IconSearch size={16} />}
          />
          {categories.map((category) => (
            <Stack key={category.slug} spacing={0}>
              <Button 
                variant="subtle" 
                fullWidth 
                rightSection={<IconChevronDown size={16} />}
              >
                {category.title}
              </Button>
              <Stack spacing={0} pl="md">
                {category.subcategories.map((sub) => (
                  <Button
                    key={sub.slug}
                    component={Link}
                    to={`/category/${category.slug}/${sub.slug}`}
                    variant="subtle"
                    fullWidth
                    onClick={close}
                  >
                    {sub.name}
                  </Button>
                ))}
              </Stack>
            </Stack>
          ))}
          <Button component={Link} to="/campaigns" variant="subtle" fullWidth onClick={close}>
            Kampanyalar
          </Button>
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