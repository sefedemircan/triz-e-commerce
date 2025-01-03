import { useState } from 'react';
import {
  Container,
  Title,
  Tabs,
  Paper,
  Text,
  Stack,
  Group,
  Button,
  Grid,
  TextInput,
  PasswordInput,
  Switch,
  Textarea,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuthStore } from '../../stores/authStore';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const { user, userProfile } = useAuthStore();

  const personalForm = useForm({
    initialValues: {
      email: user?.email || '',
      fullName: userProfile?.full_name || '',
      phone: userProfile?.phone || '',
      birthDate: userProfile?.birth_date || '',
      gender: userProfile?.gender || '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçersiz email'),
      phone: (value) => (value && !/^[0-9]{10}$/.test(value) ? 'Geçersiz telefon numarası' : null),
    },
  });

  const addressForm = useForm({
    initialValues: {
      address: userProfile?.address || '',
      city: userProfile?.city || '',
      district: userProfile?.district || '',
      zipCode: userProfile?.zip_code || '',
    },
    validate: {
      zipCode: (value) => (value && !/^[0-9]{5}$/.test(value) ? 'Geçersiz posta kodu' : null),
    },
  });

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) => 
        value && value.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Şifreler eşleşmiyor' : null,
    },
  });

  const handleUpdatePersonal = async (values) => {
    try {
      // Kişisel bilgileri güncelleme işlemi
      console.log('Güncellenecek kişisel bilgiler:', values);
      notifications.show({
        title: 'Başarılı',
        message: 'Kişisel bilgileriniz güncellendi',
        color: 'green',
      });
    } catch (err) {
      console.error('Kişisel bilgi güncelleme hatası:', err);
      notifications.show({
        title: 'Hata',
        message: 'Bilgileriniz güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const handleUpdateAddress = async (values) => {
    try {
      // Adres bilgilerini güncelleme işlemi
      console.log('Güncellenecek adres bilgileri:', values);
      notifications.show({
        title: 'Başarılı',
        message: 'Adres bilgileriniz güncellendi',
        color: 'green',
      });
    } catch (err) {
      console.error('Adres güncelleme hatası:', err);
      notifications.show({
        title: 'Hata',
        message: 'Adres bilgileriniz güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const handleUpdatePassword = async (values) => {
    try {
      // Şifre güncelleme işlemi
      console.log('Şifre güncelleme bilgileri:', values);
      notifications.show({
        title: 'Başarılı',
        message: 'Şifreniz güncellendi',
        color: 'green',
      });
    } catch (err) {
      console.error('Şifre güncelleme hatası:', err);
      notifications.show({
        title: 'Hata',
        message: 'Şifreniz güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Hesabım
      </Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="personal">Kişisel Bilgiler</Tabs.Tab>
          <Tabs.Tab value="address">Adres Bilgileri</Tabs.Tab>
          <Tabs.Tab value="password">Şifre Değiştir</Tabs.Tab>
          <Tabs.Tab value="notifications">Bildirim Tercihleri</Tabs.Tab>
        </Tabs.List>

        {/* Kişisel Bilgiler */}
        <Tabs.Panel value="personal">
          <Paper withBorder p="xl">
            <form onSubmit={personalForm.onSubmit(handleUpdatePersonal)}>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Ad Soyad"
                    placeholder="Ad Soyad"
                    {...personalForm.getInputProps('fullName')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Email"
                    placeholder="ornek@email.com"
                    {...personalForm.getInputProps('email')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Telefon"
                    placeholder="5XX XXX XX XX"
                    {...personalForm.getInputProps('phone')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Doğum Tarihi"
                    placeholder="GG.AA.YYYY"
                    {...personalForm.getInputProps('birthDate')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Cinsiyet"
                    placeholder="Seçiniz"
                    data={[
                      { value: 'male', label: 'Erkek' },
                      { value: 'female', label: 'Kadın' },
                      { value: 'other', label: 'Diğer' }
                    ]}
                    {...personalForm.getInputProps('gender')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Group position="right" mt="xl">
                    <Button type="submit">Değişiklikleri Kaydet</Button>
                  </Group>
                </Grid.Col>
              </Grid>
            </form>
          </Paper>
        </Tabs.Panel>

        {/* Adres Bilgileri */}
        <Tabs.Panel value="address">
          <Paper withBorder p="xl">
            <form onSubmit={addressForm.onSubmit(handleUpdateAddress)}>
              <Grid>
                <Grid.Col span={12}>
                  <Textarea
                    label="Adres"
                    placeholder="Adres"
                    minRows={3}
                    {...addressForm.getInputProps('address')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Şehir"
                    placeholder="Şehir"
                    {...addressForm.getInputProps('city')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="İlçe"
                    placeholder="İlçe"
                    {...addressForm.getInputProps('district')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Posta Kodu"
                    placeholder="34XXX"
                    {...addressForm.getInputProps('zipCode')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Group position="right" mt="xl">
                    <Button type="submit">Değişiklikleri Kaydet</Button>
                  </Group>
                </Grid.Col>
              </Grid>
            </form>
          </Paper>
        </Tabs.Panel>

        {/* Şifre Değiştir */}
        <Tabs.Panel value="password">
          <Paper withBorder p="xl">
            <form onSubmit={passwordForm.onSubmit(handleUpdatePassword)}>
              <Grid>
                <Grid.Col span={6}>
                  <PasswordInput
                    label="Mevcut Şifre"
                    {...passwordForm.getInputProps('currentPassword')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <PasswordInput
                    label="Yeni Şifre"
                    {...passwordForm.getInputProps('newPassword')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <PasswordInput
                    label="Yeni Şifre Tekrar"
                    {...passwordForm.getInputProps('confirmPassword')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Group position="right" mt="xl">
                    <Button type="submit">Şifreyi Güncelle</Button>
                  </Group>
                </Grid.Col>
              </Grid>
            </form>
          </Paper>
        </Tabs.Panel>

        {/* Bildirim Tercihleri */}
        <Tabs.Panel value="notifications">
          <Paper withBorder p="xl">
            <Stack spacing="lg">
              <Group position="apart">
                <div>
                  <Text>Email Bildirimleri</Text>
                  <Text size="sm" color="dimmed">Kampanya ve indirimlerden haberdar olun</Text>
                </div>
                <Switch defaultChecked size="lg" />
              </Group>

              <Group position="apart">
                <div>
                  <Text>SMS Bildirimleri</Text>
                  <Text size="sm" color="dimmed">Siparişlerinizle ilgili SMS bildirimleri alın</Text>
                </div>
                <Switch defaultChecked size="lg" />
              </Group>

              <Group position="apart">
                <div>
                  <Text>Tavsiye Bildirimleri</Text>
                  <Text size="sm" color="dimmed">Size özel ürün tavsiyeleri alın</Text>
                </div>
                <Switch defaultChecked size="lg" />
              </Group>

              <Group position="right" mt="xl">
                <Button>Tercihleri Kaydet</Button>
              </Group>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
} 