import { useEffect, useState } from 'react';
import {
  Table,
  Group,
  Text,
  Button,
  TextInput,
  NumberInput,
  Modal,
  Stack,
  Badge,
  Tabs,
  ScrollArea,
  Select
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { stockService } from '../../../services/supabase/stock';

export default function StockManagement() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState('');
  const [movementType, setMovementType] = useState('in');
  const [activeTab, setActiveTab] = useState('low-stock');

  // Düşük stoklu ürünleri getir
  const fetchLowStockProducts = async () => {
    try {
      const data = await stockService.getLowStockProducts();
      setLowStockProducts(data);
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: `Stok bilgileri alınamadı: ${error.message}`,
        color: 'red'
      });
    }
  };

  // Stok geçmişini getir
  const fetchStockHistory = async (productId) => {
    try {
      const data = await stockService.getStockHistory(productId);
      setStockHistory(data);
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: `Stok geçmişi alınamadı: ${error.message}`,
        color: 'red'
      });
    }
  };

  // Stok hareketi ekle
  const handleAddMovement = async () => {
    try {
      await stockService.addStockMovement(
        selectedProduct.id,
        quantity,
        movementType,
        note
      );
      
      notifications.show({
        title: 'Başarılı',
        message: 'Stok hareketi eklendi',
        color: 'green'
      });
      
      setIsModalOpen(false);
      fetchLowStockProducts();
      if (selectedProduct) {
        fetchStockHistory(selectedProduct.id);
      }
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: `Stok hareketi eklenemedi: ${error.message}`,
        color: 'red'
      });
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="low-stock">Düşük Stok</Tabs.Tab>
          <Tabs.Tab value="stock-history">Stok Geçmişi</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="low-stock">
          <ScrollArea>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Ürün Adı</Table.Th>
                  <Table.Th>Kategori</Table.Th>
                  <Table.Th>Stok Miktarı</Table.Th>
                  <Table.Th>İşlemler</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {lowStockProducts.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td>{product.name}</Table.Td>
                    <Table.Td>{product.categories?.name}</Table.Td>
                    <Table.Td>
                      <Badge color={product.stock_quantity <= 5 ? 'red' : 'yellow'}>
                        {product.stock_quantity}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group>
                        <Button
                          size="xs"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          Stok Ekle
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => {
                            setSelectedProduct(product);
                            fetchStockHistory(product.id);
                            setActiveTab('stock-history');
                          }}
                        >
                          Geçmiş
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="stock-history">
          {selectedProduct && (
            <>
              <Text size="lg" fw={500} mb="md">
                {selectedProduct.name} - Stok Geçmişi
              </Text>
              <ScrollArea>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tarih</Table.Th>
                      <Table.Th>İşlem</Table.Th>
                      <Table.Th>Miktar</Table.Th>
                      <Table.Th>Not</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {stockHistory.map((movement) => (
                      <Table.Tr key={movement.id}>
                        <Table.Td>
                          {new Date(movement.created_at).toLocaleString('tr-TR')}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={
                              movement.movement_type.includes('in')
                                ? 'green'
                                : 'red'
                            }
                          >
                            {movement.movement_type === 'in'
                              ? 'Giriş'
                              : movement.movement_type === 'out'
                              ? 'Çıkış'
                              : movement.movement_type === 'adjustment_in'
                              ? 'Düzeltme (+)'
                              : 'Düzeltme (-)'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>{movement.quantity}</Table.Td>
                        <Table.Td>{movement.note}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            </>
          )}
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Stok Hareketi Ekle"
      >
        <Stack>
          <Select
            label="Hareket Tipi"
            value={movementType}
            onChange={setMovementType}
            data={[
              { value: 'in', label: 'Stok Girişi' },
              { value: 'out', label: 'Stok Çıkışı' }
            ]}
          />
          <NumberInput
            label="Miktar"
            value={quantity}
            onChange={(val) => setQuantity(val)}
            min={1}
          />
          <TextInput
            label="Not"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Stok hareketi için not ekleyin"
          />
          <Button onClick={handleAddMovement}>Kaydet</Button>
        </Stack>
      </Modal>
    </div>
  );
} 