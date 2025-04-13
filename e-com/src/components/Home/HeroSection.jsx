import { Carousel } from '@mantine/carousel';
import { Container } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  const slides = [
    {
      image: '/images/carousel/format_webp (1).png',
      alt: t('homePage.heroSection.slides.0')
    },
    {
      image: '/images/carousel/format_webp (2).png',
      alt: t('homePage.heroSection.slides.1')
    },
    {
      image: '/images/carousel/format_webp.jpeg',
      alt: t('homePage.heroSection.slides.2')
    },
    {
      image: '/images/carousel/format_webp (1).jpeg',
      alt: t('homePage.heroSection.slides.0')
    },
    {
      image: '/images/carousel/format_webp (2).jpeg',
      alt: t('homePage.heroSection.slides.1')
    },
  ];

  return (
    <Container size="xl">
      <div className="hero-section">
        <Carousel
          withIndicators
          loop
          height={500}
          draggable
          slideSize="100%"
          align="start"
          slidesToScroll={1}
          controlsOffset="xl"
          controlSize={45}
          classNames={{
            root: 'carousel-root',
            controls: 'carousel-controls',
            indicator: 'carousel-indicator',
            indicators: 'carousel-indicators',
            control: 'carousel-control'
          }}
        >
          {slides.map((slide, index) => (
            <Carousel.Slide key={index}>
              <div className="carousel-slide">
                <img src={slide.image} alt={slide.alt} className="carousel-image" />
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </Container>
  );
};

export default HeroSection;