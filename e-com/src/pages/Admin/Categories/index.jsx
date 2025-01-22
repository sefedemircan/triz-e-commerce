import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  Table,
  ActionIcon,
  Text,
  Image,
  Menu,
  TextInput,
  Modal,
} from '@mantine/core';
import { IconEdit, IconTrash, IconDotsVertical, IconPlus, IconSearch } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { CategoryForm } from '../../../components/Admin/CategoryForm';
import { supabase } from '../../../services/supabase/client';

// Stil tanımlaması ekleyelim
const imageStyles = {
  wrapper: {
    width: 80,
    height: 80,
    minWidth: 80, // Tablonun sıkışmasını önler
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--mantine-color-gray-3)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
};

const tableStyles = {
  th: {
    textAlign: 'center',
    backgroundColor: 'var(--mantine-color-gray-0)',
    padding: '12px',
  },
  td: {
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: '12px',
  },
  imageCell: {
    width: 100,
    padding: '8px',
  },
  actionsCell: {
    width: 100,
    padding: '8px',
  },
  nameCell: {
    minWidth: 200,
  },
  slugCell: {
    minWidth: 150,
  }
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      //console.log('Kategoriler yükleniyor...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      //console.log('Yüklenen kategoriler:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Detaylı hata:', error);
      notifications.show({
        title: 'Hata',
        message: 'Kategoriler yüklenirken bir hata oluştu: ' + error.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalOpened(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);

        if (error) throw error;

        notifications.show({
          title: 'Başarılı',
          message: 'Kategori başarıyla silindi',
          color: 'green',
        });
        loadCategories();
      } catch (error) {
        notifications.show({
          title: 'Hata',
          message: 'Kategori silinirken bir hata oluştu',
          color: 'red',
        });
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      if (selectedCategory) {
        // Güncelleme
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            slug: slug,
            image_url: formData.image_url,
          })
          .eq('id', selectedCategory.id);

        if (error) throw error;

        notifications.show({
          title: 'Başarılı',
          message: 'Kategori başarıyla güncellendi',
          color: 'green',
        });
      } else {
        // Yeni kategori ekleme
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: formData.name,
            slug: slug,
            image_url: formData.image_url,
          }]);

        if (error) throw error;

        notifications.show({
          title: 'Başarılı',
          message: 'Kategori başarıyla eklendi',
          color: 'green',
        });
      }

      setModalOpened(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      notifications.show({
        title: 'Hata',
        message: 'İşlem sırasında bir hata oluştu: ' + error.message,
        color: 'red',
      });
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container size="xl">
        <Text>Yükleniyor...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group position="apart" mb="xl">
        <Title order={2}>Kategoriler</Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => {
            setSelectedCategory(null);
            setModalOpened(true);
          }}
        >
          Yeni Kategori
        </Button>
      </Group>

      <TextInput
        placeholder="Kategori ara..."
        icon={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="md"
      />

      <Table>
        <thead>
          <tr>
            <th style={tableStyles.th}>Görsel</th>
            <th style={tableStyles.th}>Kategori Adı</th>
            <th style={tableStyles.th}>Slug</th>
            <th style={tableStyles.th}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.id}>
              <td style={{ ...tableStyles.td, ...tableStyles.imageCell }}>
                <div style={{ ...imageStyles.wrapper, margin: '0 auto' }}>
                  <img
                    src={category.image_url}
                    alt={category.name}
                    style={imageStyles.image}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/80x80?text=Resim+Yok';
                    }}
                  />
                </div>
              </td>
              <td style={{ ...tableStyles.td, ...tableStyles.nameCell }}>
                {category.name}
              </td>
              <td style={{ ...tableStyles.td, ...tableStyles.slugCell }}>
                {category.slug}
              </td>
              <td style={{ ...tableStyles.td, ...tableStyles.actionsCell }}>
                <Menu position="bottom-end">
                  <Menu.Target>
                    <ActionIcon style={{ margin: '0 auto' }}>
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<IconEdit size={16} />}
                      onClick={() => handleEdit(category)}
                    >
                      Düzenle
                    </Menu.Item>
                    <Menu.Item
                      icon={<IconTrash size={16} />}
                      color="red"
                      onClick={() => handleDelete(category.id)}
                    >
                      Sil
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
        size="md"
      >
        <CategoryForm
          initialData={selectedCategory}
          onSubmit={handleSubmit}
        />
      </Modal>
    </Container>
  );
} 