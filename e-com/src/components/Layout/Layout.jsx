import { AppShell, Container } from '@mantine/core';
import { AppHeader } from './Header';
import { AppFooter } from './Footer';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
        <AppFooter />
      </AppShell.Main>
    </AppShell>
  );
} 