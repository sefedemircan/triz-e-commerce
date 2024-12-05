import { Stack } from '@mantine/core';
import { HeroSection } from '../components/Home/HeroSection';
import { FeaturedProducts } from '../components/Home/FeaturedProducts';
import { PromoBanners } from '../components/Home/PromoBanners';
import PopularCategories from '../components/Home/PopularCategories';

export function HomePage() {
  return (
    <Stack spacing={0}>
      <HeroSection />
      <PopularCategories />
      <FeaturedProducts />
      <PromoBanners />
    </Stack>
  );
} 