import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  Table,
  ActionIcon,
  Text,
  Badge,
  Menu,
  TextInput,
  Modal,
} from '@mantine/core';
import { IconEdit, IconTrash, IconDotsVertical, IconPlus, IconSearch } from '@tabler/icons-react';
import { productService } from '../../../services/supabase/products';
import { ProductForm } from '../../../components/Admin/ProductForm';
import { notifications } from '@mantine/notifications';

// Stil tanımlamaları
const imageStyles = {
  wrapper: {
    width: 80,
    height: 80,
    minWidth: 80,
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--mantine-color-gray-3)',
    margin: '0 auto', // Görseli hücre içinde ortala
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
  nameCell: {
    minWidth: 250,
  },
  categoryCell: {
    width: 150,
  },
  priceCell: {
    width: 120,
  },
  stockCell: {
    width: 100,
  },
  statusCell: {
    width: 120,
  },
  actionsCell: {
    width: 80,
  }
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await productService.getProducts({});
      setProducts(data);
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Ürünler yüklenirken bir hata oluştu',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpened(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        await productService.deleteProduct(productId);
        notifications.show({
          title: 'Başarılı',
          message: 'Ürün başarıyla silindi',
          color: 'green',
        });
        loadProducts();
      } catch (error) {
        notifications.show({
          title: 'Hata',
          message: 'Ürün silinirken bir hata oluştu',
          color: 'red',
        });
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, formData);
        notifications.show({
          title: 'Başarılı',
          message: 'Ürün başarıyla güncellendi',
          color: 'green',
        });
      } else {
        await productService.createProduct(formData);
        notifications.show({
          title: 'Başarılı',
          message: 'Ürün başarıyla eklendi',
          color: 'green',
        });
      }
      setModalOpened(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error('İşlem hatası:', error);
      notifications.show({
        title: 'Hata',
        message: error.message || 'İşlem sırasında bir hata oluştu',
        color: 'red',
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container size="xl">
      <Group position="apart" mb="xl">
        <Title order={2}>Ürünler</Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => {
            setSelectedProduct(null);
            setModalOpened(true);
          }}
        >
          Yeni Ürün
        </Button>
      </Group>

      <TextInput
        placeholder="Ürün ara..."
        icon={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb="md"
      />

      <Table>
        <thead>
          <tr>
            <th style={tableStyles.th}>Görsel</th>
            <th style={tableStyles.th}>Ürün Adı</th>
            <th style={tableStyles.th}>Kategori</th>
            <th style={tableStyles.th}>Fiyat</th>
            <th style={tableStyles.th}>Stok</th>
            <th style={tableStyles.th}>Durum</th>
            <th style={tableStyles.th}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td style={{ ...tableStyles.td, ...tableStyles.imageCell }}>
                <div style={imageStyles.wrapper}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={imageStyles.image}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/80x80?text=Resim+Yok';
                    }}
                  />
                </div>
              </td>
              <td style={{ ...tableStyles.td, ...tableStyles.nameCell }}>
                {product.name}
              </td>
              <td style={{ ...tableStyles.td, ...tableStyles.categoryCell }}>
                {product.categories?.name}
              </td>
              <td style={{ ...tableStyles.td, ...tableStyles.priceCell }}>
                {product.price.toLocaleString('tr-TR')} TL
              </td>
              <td style={{ ...tableStyles.td, ...tableStyles.stockCell }}>
                {product.stock_quantity}
              </td>
              <td style={{ ...tableStyles.td, ...tableStyles.statusCell }}>
                <Badge
                  color={product.stock_quantity > 0 ? 'green' : 'red'}
                  style={{ margin: '0 auto' }} // Badge'i ortala
                >
                  {product.stock_quantity > 0 ? 'Stokta' : 'Tükendi'}
                </Badge>
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
                      onClick={() => handleEdit(product)}
                    >
                      Düzenle
                    </Menu.Item>
                    <Menu.Item
                      icon={<IconTrash size={16} />}
                      color="red"
                      onClick={() => handleDelete(product.id)}
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
          setSelectedProduct(null);
        }}
        title={selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
        size="lg"
      >
        <ProductForm
          initialData={selectedProduct}
          onSubmit={handleSubmit}
        />
      </Modal>
    </Container>
  );
} 