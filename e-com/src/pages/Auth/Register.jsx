import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçersiz email'),
      password: (value) => (value.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Şifreler eşleşmiyor' : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      await signUp(values.email, values.password);
      notifications.show({
        title: 'Başarılı',
        message: 'Hesabınız oluşturuldu. Email adresinizi onaylayın.',
        color: 'green',
      });
      navigate('/login');
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: error.message,
        color: 'red',
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Yeni Hesap Oluştur
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Zaten hesabınız var mı?{' '}
        <Link to="/login" style={{ color: 'var(--mantine-color-blue-6)' }}>
          Giriş Yap
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="ornek@email.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Şifre"
            placeholder="Şifreniz"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Şifre Tekrar"
            placeholder="Şifrenizi tekrar girin"
            required
            mt="md"
            {...form.getInputProps('confirmPassword')}
          />
          <Button type="submit" fullWidth mt="xl">
            Hesap Oluştur
          </Button>
        </form>
      </Paper>
    </Container>
  );
} 