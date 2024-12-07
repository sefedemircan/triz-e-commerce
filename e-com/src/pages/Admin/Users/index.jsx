import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  Badge,
  Menu,
  ActionIcon,
  Text,
  Group,
  TextInput,
  Select,
  Avatar,
} from '@mantine/core';
import { IconDotsVertical, IconSearch } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { supabase } from '../../../services/supabase/client';

const userRoles = [
  { value: 'user', label: 'Kullanıcı', color: 'blue' },
  { value: 'admin', label: 'Admin', color: 'red' },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Kullanıcı profil bilgilerini al
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

      if (profileError) throw profileError;

      // Auth ve profil verilerini birleştir
      const mergedUsers = authUsers.users.map(user => ({
        ...user,
        profile: profiles.find(profile => profile.user_id === user.id) || {}
      }));

      setUsers(mergedUsers);
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Kullanıcılar yüklenirken bir hata oluştu',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      notifications.show({
        title: 'Başarılı',
        message: 'Kullanıcı rolü güncellendi',
        color: 'green',
      });

      loadUsers();
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Rol güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const handleUserStatus = async (userId, isActive) => {
    try {
      if (isActive) {
        await supabase.auth.admin.updateUserById(userId, { banned: false });
      } else {
        await supabase.auth.admin.updateUserById(userId, { banned: true });
      }

      notifications.show({
        title: 'Başarılı',
        message: `Kullanıcı ${isActive ? 'aktifleştirildi' : 'devre dışı bırakıldı'}`,
        color: 'green',
      });

      loadUsers();
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'İşlem sırasında bir hata oluştu',
        color: 'red',
      });
    }
  };

  const getRoleBadge = (role) => {
    const roleInfo = userRoles.find(r => r.value === role);
    return (
      <Badge color={roleInfo?.color || 'gray'}>
        {roleInfo?.label || role}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.profile.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Kullanıcılar
      </Title>

      <Group mb="md">
        <TextInput
          placeholder="Email ara..."
          icon={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Rol Filtrele"
          value={roleFilter}
          onChange={setRoleFilter}
          data={[
            { value: '', label: 'Tümü' },
            ...userRoles
          ]}
          style={{ width: 200 }}
        />
      </Group>

      <Table>
        <thead>
          <tr>
            <th>Kullanıcı</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Durum</th>
            <th>Kayıt Tarihi</th>
            <th>Son Giriş</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <Group spacing="sm">
                  <Avatar 
                    color="blue" 
                    radius="xl"
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Text size="sm" weight={500}>
                      {user.profile.full_name || 'İsimsiz Kullanıcı'}
                    </Text>
                    <Text size="xs" color="dimmed">
                      ID: {user.id}
                    </Text>
                  </div>
                </Group>
              </td>
              <td>{user.email}</td>
              <td>{getRoleBadge(user.profile.role || 'user')}</td>
              <td>
                <Badge 
                  color={user.banned ? 'red' : 'green'}
                >
                  {user.banned ? 'Devre Dışı' : 'Aktif'}
                </Badge>
              </td>
              <td>{new Date(user.created_at).toLocaleDateString('tr-TR')}</td>
              <td>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('tr-TR') : '-'}</td>
              <td>
                <Menu>
                  <Menu.Target>
                    <ActionIcon>
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Rol Değiştir</Menu.Label>
                    {userRoles.map((role) => (
                      <Menu.Item
                        key={role.value}
                        onClick={() => handleRoleChange(user.id, role.value)}
                        disabled={user.profile.role === role.value}
                      >
                        <Group>
                          <Badge color={role.color} size="xs" variant="dot" />
                          <Text size="sm">{role.label}</Text>
                        </Group>
                      </Menu.Item>
                    ))}
                    <Menu.Divider />
                    <Menu.Item
                      color={user.banned ? 'green' : 'red'}
                      onClick={() => handleUserStatus(user.id, user.banned)}
                    >
                      {user.banned ? 'Aktifleştir' : 'Devre Dışı Bırak'}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
} 