import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  Badge,
  Group,
  TextInput,
  ActionIcon,
  Menu,
  Text,
  LoadingOverlay,
} from '@mantine/core';
import { IconSearch, IconDotsVertical, IconUserShield, IconUserOff } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { supabase } from '../../../services/supabase/client';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Önce giriş yapan kullanıcının admin olup olmadığını kontrol et
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        notifications.show({
          title: 'Yetkisiz Erişim',
          message: 'Bu sayfaya erişim yetkiniz bulunmuyor.',
          color: 'red',
        });
        return;
      }

      // Admin ise kullanıcıları getir
      const { data: usersData, error: usersError } = await supabase
        .from('auth_users_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData);
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
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
        .eq('id', userId);

      if (error) throw error;

      notifications.show({
        title: 'Başarılı',
        message: 'Kullanıcı rolü güncellendi',
        color: 'green',
      });

      loadUsers();
    } catch (error) {
      console.error('Rol güncelleme hatası:', error);
      notifications.show({
        title: 'Hata',
        message: 'Rol güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', userId);

      if (error) throw error;

      notifications.show({
        title: 'Başarılı',
        message: `Kullanıcı ${newStatus ? 'aktif' : 'pasif'} duruma getirildi`,
        color: 'green',
      });

      loadUsers(); // Tabloyu yenile
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      notifications.show({
        title: 'Hata',
        message: 'Durum güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container size="xl">
      <Group position="apart" mb="xl">
        <Title order={2}>Kullanıcılar</Title>
        <TextInput
          placeholder="Kullanıcı ara..."
          icon={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </Group>

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>E-posta</th>
              <th style={{ textAlign: 'center' }}>Rol</th>
              <th style={{ textAlign: 'center' }}>Kayıt Tarihi</th>
              <th style={{ textAlign: 'center' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ textAlign: 'center' }}>{user.email}</td>
                <td style={{ textAlign: 'center' }}>
                  <Badge color={user.role === 'admin' ? 'red' : 'blue'}>
                    {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                  </Badge>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {new Date(user.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Menu position="bottom-end">
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Rol İşlemleri</Menu.Label>
                      <Menu.Item
                        icon={<IconUserShield size={16} />}
                        onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                      >
                        {user.role === 'admin' ? 'Kullanıcı Yap' : 'Admin Yap'}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
} 