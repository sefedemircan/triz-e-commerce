import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function withPerformanceTracking(WrappedComponent) {
  return function PerformanceTrackedComponent(props) {
    const location = useLocation();

    useEffect(() => {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        // Performans metriklerini analitik servisine gönder
        console.log(`Sayfa yükleme süresi (${location.pathname}): ${loadTime}ms`);
      };
    }, [location]);

    return <WrappedComponent {...props} />;
  };
} 