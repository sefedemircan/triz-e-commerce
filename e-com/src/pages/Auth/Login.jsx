import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Center,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Geçersiz email"),
      password: (value) =>
        value.length < 6 ? "Şifre en az 6 karakter olmalıdır" : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      await signIn(values.email, values.password);
      notifications.show({
        title: "Başarılı",
        message: "Giriş yapıldı",
        color: "green",
      });
      navigate("/");
    } catch (error) {
      notifications.show({
        title: "Hata",
        message: error.message,
        color: "red",
      });
    }
  };

  return (
    <Box h="calc(100vh - 60px)" // Header yüksekliğini çıkarıyoruz
    >
      <Center h="100%">
        <Container size={600} px="xl">
          <Paper withBorder shadow="xl" p={50} radius="md">
            <Title ta="center" fw={900} size="2.5rem" mb="xl">
              Hoş Geldiniz!
            </Title>
            <Text c="dimmed" size="lg" ta="center" mb={30}>
              Hesabınız yok mu?{" "}
              <Link to="/register" style={{ color: "var(--mantine-color-blue-6)" }}>
                Hesap Oluştur
              </Link>
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email"
                placeholder="ornek@email.com"
                required
                size="md"
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Şifre"
                placeholder="Şifreniz"
                required
                size="md"
                mt="xl"
                {...form.getInputProps("password")}
              />
              <Button type="submit" fullWidth mt="xl" size="md">
                Giriş Yap
              </Button>
            </form>
          </Paper>
        </Container>
      </Center>
    </Box>
  );
}
