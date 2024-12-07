import { useEffect, useState } from 'react';
import {
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Stack,
  Button,
  Group,
  Text,
  Image,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { supabase } from '../../../services/supabase/client';

export function ProductForm({ initialData, onSubmit }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      original_price: initialData?.original_price || 0,
      stock_quantity: initialData?.stock_quantity || 0,
      category_id: initialData?.category_id || '',
      image_url: initialData?.image_url || '',
    },
    validate: {
      name: (value) => !value ? 'Ürün adı zorunludur' : null,
      price: (value) => value < 0 ? 'Fiyat 0\'dan küçük olamaz' : null,
      stock_quantity: (value) => value < 0 ? 'Stok 0\'dan küçük olamaz' : null,
      category_id: (value) => !value ? 'Kategori seçimi zorunludur' : null,
      image_url: (value) => !value ? 'Görsel URL zorunludur' : null,
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');

      if (error) throw error;

      setCategories(data.map(category => ({
        value: category.id,
        label: category.name,
      })));
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Form gönderilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="md">
        <TextInput
          label="Ürün Adı"
          placeholder="Örn: iPhone 14 Pro"
          required
          {...form.getInputProps('name')}
        />

        <Textarea
          label="Açıklama"
          placeholder="Ürün açıklaması..."
          minRows={3}
          {...form.getInputProps('description')}
        />

        <Group grow>
          <NumberInput
            label="Satış Fiyatı"
            placeholder="0.00"
            precision={2}
            min={0}
            required
            {...form.getInputProps('price')}
          />

          <NumberInput
            label="Liste Fiyatı (Opsiyonel)"
            description="İndirimli ürünler için orijinal fiyat"
            placeholder="0.00"
            precision={2}
            min={0}
            {...form.getInputProps('original_price')}
          />
        </Group>

        <Group grow>
          <NumberInput
            label="Stok Miktarı"
            placeholder="0"
            min={0}
            required
            {...form.getInputProps('stock_quantity')}
          />

          <Select
            label="Kategori"
            placeholder="Seçiniz"
            data={categories}
            required
            {...form.getInputProps('category_id')}
          />
        </Group>

        <TextInput
          label="Görsel URL"
          placeholder="https://..."
          required
          {...form.getInputProps('image_url')}
        />

        {form.values.image_url && (
          <Image
            src={form.values.image_url}
            alt="Ürün görseli önizleme"
            width={200}
            height={200}
            fit="contain"
          />
        )}

        <Button 
          type="submit" 
          loading={loading}
          mt="md"
        >
          {initialData ? 'Güncelle' : 'Ekle'}
        </Button>
      </Stack>
    </form>
  );
} 