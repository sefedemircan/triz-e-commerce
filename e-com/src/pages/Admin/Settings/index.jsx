import { useState } from 'react';
import {
  Container,
  Title,
  Paper,
  TextInput,
  NumberInput,
  Button,
  Stack,
  Group,
  Text,
  Divider,
  Switch,
  Tabs,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { supabase } from '../../../services/supabase/client';

export default function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'E-Ticaret',
    siteDescription: 'Online Alışveriş Sitesi',
    contactEmail: 'info@example.com',
    contactPhone: '+90 555 555 55 55',
    address: 'İstanbul, Türkiye',
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 500,
    standardShippingCost: 29.90,
    expressShippingCost: 49.90,
    isExpressShippingEnabled: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    isIyzicoEnabled: true,
    isCreditCardEnabled: true,
    isTransferEnabled: true,
    iyzicoApiKey: '****',
    iyzicoSecretKey: '****',
  });

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          type: 'general',
          data: generalSettings
        });

      if (error) throw error;

      notifications.show({
        title: 'Başarılı',
        message: 'Genel ayarlar güncellendi',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Ayarlar güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          type: 'shipping',
          data: shippingSettings
        });

      if (error) throw error;

      notifications.show({
        title: 'Başarılı',
        message: 'Kargo ayarları güncellendi',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Ayarlar güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          type: 'payment',
          data: paymentSettings
        });

      if (error) throw error;

      notifications.show({
        title: 'Başarılı',
        message: 'Ödeme ayarları güncellendi',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Ayarlar güncellenirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Ayarlar
      </Title>

      <Tabs defaultValue="general">
        <Tabs.List mb="xl">
          <Tabs.Tab value="general">Genel</Tabs.Tab>
          <Tabs.Tab value="shipping">Kargo</Tabs.Tab>
          <Tabs.Tab value="payment">Ödeme</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
          <Paper withBorder p="md">
            <form onSubmit={handleGeneralSubmit}>
              <Stack>
                <TextInput
                  label="Site Adı"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    siteName: e.target.value
                  }))}
                />

                <TextInput
                  label="Site Açıklaması"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    siteDescription: e.target.value
                  }))}
                />

                <TextInput
                  label="İletişim Email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    contactEmail: e.target.value
                  }))}
                />

                <TextInput
                  label="İletişim Telefon"
                  value={generalSettings.contactPhone}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    contactPhone: e.target.value
                  }))}
                />

                <TextInput
                  label="Adres"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                />

                <Button type="submit">Kaydet</Button>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="shipping">
          <Paper withBorder p="md">
            <form onSubmit={handleShippingSubmit}>
              <Stack>
                <NumberInput
                  label="Ücretsiz Kargo Limiti (TL)"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(value) => setShippingSettings(prev => ({
                    ...prev,
                    freeShippingThreshold: value
                  }))}
                  min={0}
                  step={10}
                />

                <NumberInput
                  label="Standart Kargo Ücreti (TL)"
                  value={shippingSettings.standardShippingCost}
                  onChange={(value) => setShippingSettings(prev => ({
                    ...prev,
                    standardShippingCost: value
                  }))}
                  min={0}
                  precision={2}
                />

                <Group position="apart">
                  <Text>Hızlı Kargo</Text>
                  <Switch
                    checked={shippingSettings.isExpressShippingEnabled}
                    onChange={(e) => setShippingSettings(prev => ({
                      ...prev,
                      isExpressShippingEnabled: e.currentTarget.checked
                    }))}
                  />
                </Group>

                {shippingSettings.isExpressShippingEnabled && (
                  <NumberInput
                    label="Hızlı Kargo Ücreti (TL)"
                    value={shippingSettings.expressShippingCost}
                    onChange={(value) => setShippingSettings(prev => ({
                      ...prev,
                      expressShippingCost: value
                    }))}
                    min={0}
                    precision={2}
                  />
                )}

                <Button type="submit">Kaydet</Button>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="payment">
          <Paper withBorder p="md">
            <form onSubmit={handlePaymentSubmit}>
              <Stack>
                <Group position="apart">
                  <Text>Iyzico Ödeme</Text>
                  <Switch
                    checked={paymentSettings.isIyzicoEnabled}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev,
                      isIyzicoEnabled: e.currentTarget.checked
                    }))}
                  />
                </Group>

                {paymentSettings.isIyzicoEnabled && (
                  <>
                    <TextInput
                      label="Iyzico API Key"
                      value={paymentSettings.iyzicoApiKey}
                      onChange={(e) => setPaymentSettings(prev => ({
                        ...prev,
                        iyzicoApiKey: e.target.value
                      }))}
                    />

                    <TextInput
                      label="Iyzico Secret Key"
                      type="password"
                      value={paymentSettings.iyzicoSecretKey}
                      onChange={(e) => setPaymentSettings(prev => ({
                        ...prev,
                        iyzicoSecretKey: e.target.value
                      }))}
                    />
                  </>
                )}

                <Divider />

                <Group position="apart">
                  <Text>Kredi Kartı</Text>
                  <Switch
                    checked={paymentSettings.isCreditCardEnabled}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev,
                      isCreditCardEnabled: e.currentTarget.checked
                    }))}
                  />
                </Group>

                <Group position="apart">
                  <Text>Havale/EFT</Text>
                  <Switch
                    checked={paymentSettings.isTransferEnabled}
                    onChange={(e) => setPaymentSettings(prev => ({
                      ...prev,
                      isTransferEnabled: e.currentTarget.checked
                    }))}
                  />
                </Group>

                <Button type="submit">Kaydet</Button>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
} 