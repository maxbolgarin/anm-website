import { useEffect, useRef, useState } from 'react';
import { withBase } from '@utils/withBase';

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  address: string;
  href: string;
}

interface InteractiveMapProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

const API_KEY = 'bd3c1f9f-c6c5-494c-84e7-4de8b22f2a54';

export default function InteractiveMap({
  markers,
  center,
  zoom = 16,
  height = '100%',
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(false);

  const mapCenter = center || (markers.length > 0
    ? {
        lat: markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
        lng: markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
      }
    : { lat: 59.9010, lng: 30.4295 });

  // Load Yandex Maps 2.1 API
  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => setMapLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      window.ymaps.ready(() => setMapLoaded(true));
    };
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map once API is ready
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.ymaps) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
      mapInstanceRef.current = null;
    }

    const map = new window.ymaps.Map(mapRef.current, {
      center: [mapCenter.lat, mapCenter.lng],
      zoom: zoom,
      controls: ['zoomControl'],
    }, {
      suppressMapOpenBlock: true,
    });

    mapInstanceRef.current = map;

    // Add markers
    markers.forEach((marker) => {
      const placemark = new window.ymaps.Placemark(
        [marker.lat, marker.lng],
        {
          hintContent: marker.title,
          balloonContentHeader: `<strong>${marker.title}</strong>`,
          balloonContentBody: marker.address,
          balloonContentFooter: `<a href="${withBase(marker.href)}" style="color:#8A1538">Подробнее</a>`,
        },
        {
          preset: 'islands#redDotIcon',
          iconColor: '#B8003C',
        },
      );

      placemark.events.add('click', () => {
        // Open balloon on click, link inside leads to building page
      });

      map.geoObjects.add(placemark);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, markers, mapCenter, zoom]);

  if (error) {
    // Graceful fallback: a quiet panel with a direct link to Yandex Maps
    const yandexHref = `https://yandex.ru/maps/?pt=${mapCenter.lng},${mapCenter.lat}&z=${zoom ?? 16}&l=map`;
    return (
      <div style={{
        width: '100%',
        height,
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        backgroundColor: '#F5F3EF',
        color: '#5C5C5C',
        fontSize: '0.875rem',
        textAlign: 'center',
        padding: '24px',
      }}>
        <span>Пр. Обуховской Обороны, 70 · м. Елизаровская</span>
        <a
          href={yandexHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#141414', fontWeight: 500, borderBottom: '1px solid #CFCBC4', paddingBottom: '4px' }}
        >
          Открыть в Яндекс Картах
        </a>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height, minHeight: '300px' }}
    >
      {!mapLoaded && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#6b6b6b',
          fontSize: '0.875rem',
        }}>
          Загрузка карты...
        </div>
      )}
    </div>
  );
}
