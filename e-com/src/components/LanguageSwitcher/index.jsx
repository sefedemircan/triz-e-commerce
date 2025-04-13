import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Menu, Group, Text } from '@mantine/core';
import { IconWorld } from '@tabler/icons-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'tr');

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <Menu position="bottom-end" shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="transparent" aria-label={t('common.language')}>
          <IconWorld size={22} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('common.language')}</Menu.Label>
        <Menu.Item onClick={() => changeLanguage('tr')}>
          <Group position="apart">
            <Text>{t('common.turkish')}</Text>
            {currentLanguage === 'tr' && <Text size="xs">✓</Text>}
          </Group>
        </Menu.Item>
        <Menu.Item onClick={() => changeLanguage('en')}>
          <Group position="apart">
            <Text>{t('common.english')}</Text>
            {currentLanguage === 'en' && <Text size="xs">✓</Text>}
          </Group>
        </Menu.Item>
        <Menu.Item onClick={() => changeLanguage('es')}>
          <Group position="apart">
            <Text>{t('common.spanish')}</Text>
            {currentLanguage === 'es' && <Text size="xs">✓</Text>}
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageSwitcher; 