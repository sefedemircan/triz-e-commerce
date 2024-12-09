import { Container, SimpleGrid, Paper, Text, Title } from '@mantine/core';
import { 
  IconTruck, 
  IconShieldCheck, 
  IconCreditCard, 
  IconHeadset 
} from '@tabler/icons-react';

export function Features() {
  const features = [
    {
      icon: IconTruck,
      title: 'Ücretsiz Kargo',
      description: '500 TL üzeri alışverişlerde',
      color: 'orange'
    },
    {
      icon: IconShieldCheck,
      title: 'Güvenli Ödeme',
      description: '256-bit SSL koruması',
      color: 'green'
    },
    {
      icon: IconCreditCard,
      title: 'Taksit İmkanı',
      description: '9 taksit seçeneği',
      color: 'blue'
    },
    {
      icon: IconHeadset,
      title: '7/24 Destek',
      description: 'Canlı destek hizmeti',
      color: 'grape'
    }
  ];

  return (
    <Container size="xl" py={40}>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        {features.map((feature, index) => (
          <Paper 
            key={index} 
            p="xl" 
            radius="md" 
            withBorder
            sx={(theme) => ({
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows.sm
              }
            })}
          >
            <feature.icon size={32} color={`var(--mantine-color-${feature.color}-6)`} />
            <Text weight={500} mt="md">{feature.title}</Text>
            <Text size="sm" color="dimmed">{feature.description}</Text>
          </Paper>
        ))}
      </SimpleGrid>
    </Container>
  );
} 