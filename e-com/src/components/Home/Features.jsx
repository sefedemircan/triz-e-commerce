import { Container, SimpleGrid, Paper, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { 
  IconTruck, 
  IconShieldCheck, 
  IconCreditCard, 
  IconHeadset 
} from '@tabler/icons-react';

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: IconTruck,
      title: t('homePage.features.freeShipping.title'),
      description: t('homePage.features.freeShipping.description'),
      color: 'orange'
    },
    {
      icon: IconShieldCheck,
      title: t('homePage.features.securePayment.title'),
      description: t('homePage.features.securePayment.description'),
      color: 'green'
    },
    {
      icon: IconCreditCard,
      title: t('homePage.features.installment.title'),
      description: t('homePage.features.installment.description'),
      color: 'blue'
    },
    {
      icon: IconHeadset,
      title: t('homePage.features.support.title'),
      description: t('homePage.features.support.description'),
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