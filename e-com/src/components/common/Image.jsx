import { useState, useEffect } from 'react';
import { Skeleton } from '@mantine/core';

export function OptimizedImage({ src, alt, width, height, ...props }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setImageSrc('https://placehold.co/600x400?text=Resim+Yüklenemedi');
      setIsLoading(false);
    };
  }, [src]);

  if (isLoading) {
    return <Skeleton width={width} height={height} />;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  );
} 