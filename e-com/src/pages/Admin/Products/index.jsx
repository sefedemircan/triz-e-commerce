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
  Badge,
  Menu,
  TextInput,
  Modal,
} from '@mantine/core';
import { IconEdit, IconTrash, IconDotsVertical, IconPlus, IconSearch } from '@tabler/icons-react';
import { productService } from '../../../services/supabase/products';
import { ProductForm } from '../../../components/Admin/ProductForm';
import { notifications } from '@mantine/notifications';

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
      notifications.show({
        title: 'Hata',
        message: 'İşlem sırasında bir hata oluştu',
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
          leftIcon={<IconPlus size={20} />}
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
            <th>Görsel</th>
            <th>Ürün Adı</th>
            <th>Kategori</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <Image
                  src={product.image_url}
                  width={60}
                  height={60}
                  fit="contain"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.categories?.name}</td>
              <td>{product.price.toLocaleString('tr-TR')} TL</td>
              <td>{product.stock_quantity}</td>
              <td>
                <Badge
                  color={product.stock_quantity > 0 ? 'green' : 'red'}
                >
                  {product.stock_quantity > 0 ? 'Stokta' : 'Tükendi'}
                </Badge>
              </td>
              <td>
                <Menu>
                  <Menu.Target>
                    <ActionIcon>
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