import { NavLink, Stack } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconBox,
  IconCategory,
  IconShoppingCart,
  IconUsers,
  IconSettings,
} from '@tabler/icons-react';

const menuItems = [
  { label: 'Dashboard', icon: IconDashboard, path: '/admin' },
  { label: 'Ürünler', icon: IconBox, path: '/admin/products' },
  { label: 'Kategoriler', icon: IconCategory, path: '/admin/categories' },
  { label: 'Siparişler', icon: IconShoppingCart, path: '/admin/orders' },
  { label: 'Kullanıcılar', icon: IconUsers, path: '/admin/users' },
  { label: 'Ayarlar', icon: IconSettings, path: '/admin/settings' },
];

export function AdminNavbar() {
  const location = useLocation();

  return (
    <Stack spacing={0}>
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          component={Link}
          to={item.path}
          label={item.label}
          leftSection={<item.icon size={20} stroke={1.5} />}
          active={location.pathname === item.path}
          variant="filled"
          classNames={{
            root: 'nav-link',
          }}
        />
      ))}
    </Stack>
  );
} 