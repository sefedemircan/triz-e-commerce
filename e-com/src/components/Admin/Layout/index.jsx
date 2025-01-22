import { AppShell, Burger } from '@mantine/core';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './Navbar';
import { AdminHeader } from './Header';
import { 
  IconDashboard, 
  IconBox, 
  IconCategory, 
  IconShoppingCart, 
  IconPackage,
  IconUsers,
  IconSettings,
  IconMessageCircle,
} from '@tabler/icons-react';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: IconDashboard },
  { label: 'Ürünler', path: '/admin/products', icon: IconBox },
  { label: 'Kategoriler', path: '/admin/categories', icon: IconCategory },
  { label: 'Siparişler', path: '/admin/orders', icon: IconShoppingCart },
  { label: 'Stok Yönetimi', path: '/admin/stock', icon: IconPackage },
  { label: 'Yorum Moderasyonu', path: '/admin/reviews', icon: IconMessageCircle },
  { label: 'Kullanıcılar', path: '/admin/users', icon: IconUsers },
  { label: 'Ayarlar', path: '/admin/settings', icon: IconSettings },
];

export function AdminLayout() {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
      bg="white"
    >
      <AppShell.Header bg="white">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%',
          padding: '0 1rem'
        }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            hiddenFrom="sm"
            size="sm"
          />
          <AdminHeader />
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md" bg="white">
        <AdminNavbar menuItems={menuItems} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
} 