import { Container, Grid, Text, Stack, Group, ActionIcon, Box, Divider } from '@mantine/core';
import { IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandYoutube } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function AppFooter() {
  const footerLinks = {
    'Kurumsal': [
      { label: 'Hakkımızda', link: '/about' },
      { label: 'İletişim', link: '/contact' },
      { label: 'Kariyer', link: '/careers' },
      { label: 'Blog', link: '/blog' }
    ],
    'Müşteri Hizmetleri': [
      { label: 'Sıkça Sorulan Sorular', link: '/faq' },
      { label: 'Kargo ve Teslimat', link: '/shipping' },
      { label: 'İade ve Değişim', link: '/returns' },
      { label: 'Gizlilik Politikası', link: '/privacy' }
    ],
    'Kategoriler': [
      { label: 'Kadın', link: '/category/women' },
      { label: 'Erkek', link: '/category/men' },
      { label: 'Çocuk', link: '/category/kids' },
      { label: 'Aksesuar', link: '/category/accessories' }
    ]
  };

  const socialMedia = [
    { icon: IconBrandFacebook, link: 'https://facebook.com' },
    { icon: IconBrandTwitter, link: 'https://twitter.com' },
    { icon: IconBrandInstagram, link: 'https://instagram.com' },
    { icon: IconBrandYoutube, link: 'https://youtube.com' }
  ];

  return (
    <Box 
      component="footer" 
      bg="gray.0"
      mt="xl"
      pt={50}
      pb={20}
    >
      <Container size="xl">
        <Grid>
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid.Col key={title} span={{ base: 12, sm: 6, md: 3 }}>
              <Stack spacing="md">
                <Text size="lg" weight={600}>{title}</Text>
                {links.map((link) => (
                  <Text
                    key={link.label}
                    component={Link}
                    to={link.link}
                    size="sm"
                    c="dimmed"
                    sx={(theme) => ({
                      '&:hover': {
                        color: theme.colors.orange[6],
                        textDecoration: 'none'
                      }
                    })}
                  >
                    {link.label}
                  </Text>
                ))}
              </Stack>
            </Grid.Col>
          ))}

          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack spacing="md">
              <Text size="lg" weight={600}>Bizi Takip Edin</Text>
              <Group spacing="md">
                {socialMedia.map((social, index) => (
                  <ActionIcon
                    key={index}
                    component="a"
                    href={social.link}
                    target="_blank"
                    variant="subtle"
                    color="gray"
                    size="lg"
                    radius="xl"
                  >
                    <social.icon size={22} />
                  </ActionIcon>
                ))}
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my={30} />
        
        <Group position="apart">
          <Text size="sm" c="dimmed">
            © 2024 E-Ticaret. Tüm hakları saklıdır.
          </Text>
          <Group spacing="xl">
            <Text 
              component={Link} 
              to="/terms" 
              size="sm" 
              c="dimmed"
              sx={(theme) => ({
                '&:hover': {
                  color: theme.colors.orange[6],
                  textDecoration: 'none'
                }
              })}
            >
              Kullanım Koşulları
            </Text>
            <Text 
              component={Link} 
              to="/privacy" 
              size="sm" 
              c="dimmed"
              sx={(theme) => ({
                '&:hover': {
                  color: theme.colors.orange[6],
                  textDecoration: 'none'
                }
              })}
            >
              Gizlilik Politikası
            </Text>
          </Group>
        </Group>
      </Container>
    </Box>
  );
} 