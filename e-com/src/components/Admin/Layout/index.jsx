import { AppShell, Burger } from '@mantine/core';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './Navbar';
import { AdminHeader } from './Header';

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
        <AdminNavbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
} 