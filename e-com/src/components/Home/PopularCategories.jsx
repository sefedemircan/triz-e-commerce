import { Container, Title, Group, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/categories.css';

const PopularCategories = () => {
  const { t } = useTranslation();

  const categories = [
    {
      id: 1,
      name: t('homePage.popularCategories.categories.electronics'),
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&fit=crop',
      link: '/kategori/elektronik'
    },
    {
      id: 2,
      name: t('homePage.popularCategories.categories.clothing'),
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&fit=crop',
      link: '/kategori/giyim'
    },
    {
      id: 3,
      name: t('homePage.popularCategories.categories.homeAndLiving'),
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1000&fit=crop',
      link: '/kategori/ev-yasam'
    },
    {
      id: 4,
      name: t('homePage.popularCategories.categories.cosmetics'),
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&fit=crop',
      link: '/kategori/kozmetik'
    },
    {
      id: 5,
      name: t('homePage.popularCategories.categories.shoesAndBags'),
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&fit=crop',
      link: '/kategori/ayakkabi-canta'
    },
    {
      id: 6,
      name: t('homePage.popularCategories.categories.sportsAndOutdoor'),
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&fit=crop',
      link: '/kategori/spor-outdoor'
    }
  ];

  return (
    <Container size="xl" py={40}>
      <Group position="apart" mb={30}>
        <Group spacing="xs">
          <Title order={2} size="h3" weight={600}>
            {t('homePage.popularCategories.title')}
          </Title>
          <Badge variant="dot" color="orange" size="lg">
            {t('homePage.popularCategories.trend')}
          </Badge>
        </Group>
      </Group>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <Link to={category.link}>
              <img src={category.image} alt={category.name} />
              <div className="category-content">
                <h3>{category.name}</h3>
                <span className="arrow">→</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default PopularCategories; 