import { useForm } from '@mantine/form';
import { TextInput, Stack, Button } from '@mantine/core';

const defaultImages = {
  'elektronik': 'https://images.unsplash.com/photo-1635870723802-e88d76ae324e?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'giyim': 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&h=500&fit=crop',
  'ev-yasam': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=500&h=500&fit=crop',
  'kozmetik': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'ayakkabi-canta': 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'spor-outdoor': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&h=500&fit=crop'
};

export function CategoryForm({ initialData, onSubmit }) {
  const form = useForm({
    initialValues: {
      name: initialData?.name || '',
      image_url: initialData?.image_url || ''
    },
    validate: {
      name: (value) => !value ? 'Kategori adı zorunludur' : null,
      image_url: (value) => !value ? 'Görsel URL zorunludur' : null,
    },
  });

  const handleSubmit = (values) => {
    // Eğer image_url boş bırakıldıysa, varsayılan görseli kullan
    const slug = values.name
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

    const image_url = values.image_url || defaultImages[slug] || defaultImages['elektronik'];
    
    onSubmit({
      ...values,
      image_url
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Kategori Adı"
          placeholder="Örn: Elektronik"
          required
          {...form.getInputProps('name')}
        />

        <TextInput
          label="Görsel URL"
          placeholder="https://... (Boş bırakılırsa varsayılan görsel kullanılır)"
          {...form.getInputProps('image_url')}
        />

        <Button type="submit">
          {initialData ? 'Güncelle' : 'Ekle'}
        </Button>
      </Stack>
    </form>
  );
} 