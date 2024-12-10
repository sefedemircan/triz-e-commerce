import { Group, Text, Menu, UnstyledButton, Avatar } from '@mantine/core';
import { IconLogout, IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';

export function AdminHeader() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Group position="apart" w="100%">
      <Text size="lg" weight={700}>
        Admin Panel
      </Text>

      <Menu position="bottom-end" shadow="md">
        <Menu.Target>
          <UnstyledButton>
            <Group spacing="xs">
              <Avatar color="orange" radius="xl">
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {user?.email}
                </Text>
                <Text color="dimmed" size="xs">
                  Admin
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item 
            icon={<IconHome size={14} />}
            onClick={() => navigate('/')}
          >
            Ana Sayfa
          </Menu.Item>
          <Menu.Item 
            color="red" 
            icon={<IconLogout size={14} />}
            onClick={handleLogout}
          >
            Çıkış Yap
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
} 