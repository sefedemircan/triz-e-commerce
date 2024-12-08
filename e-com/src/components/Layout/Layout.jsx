import { AppShell, Container } from '@mantine/core';
import { AppHeader } from './Header';
import { AppFooter } from './Footer';
import { Outlet } from 'react-router-dom';
import { Box } from '@mantine/core';

export function AppLayout() {
  return (
    <Box>
      <AppHeader />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
} 