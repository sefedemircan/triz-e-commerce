import { Carousel } from '@mantine/carousel';
import { Container } from '@mantine/core';

const HeroSection = () => {
  const slides = [
    {
      image: '/images/carousel/format_webp (1).png',
      alt: 'Yaz İndirimleri'
    },
    {
      image: '/images/carousel/format_webp (2).png',
      alt: 'Özel Koleksiyon'
    },
    {
      image: '/images/carousel/format_webp.jpeg',
      alt: 'Yeni Sezon Ürünleri'
    },
    {
      image: '/images/carousel/format_webp (1).jpeg',
      alt: 'Yaz İndirimleri'
    },
    {
      image: '/images/carousel/format_webp (2).jpeg',
      alt: 'Özel Koleksiyon'
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