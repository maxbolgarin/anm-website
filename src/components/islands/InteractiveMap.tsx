import React, { useEffect, useRef, useState } from 'react';

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

export default function InteractiveMap({
  markers,
  center,
  zoom = 15,
  height = '100%',
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapCenter = center || (markers.length > 0
    ? {
        lat: markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
        lng: markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
      }
    : { lat: 59.9075, lng: 30.4267 });

  useEffect(() => {
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(() => setMapLoaded(true));
      };
      document.head.appendChild(script);
    } else {
      window.ymaps.ready(() => setMapLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = new window.ymaps.Map(mapRef.current, {
      center: [mapCenter.lat, mapCenter.lng],
      zoom: zoom,
      controls: ['zoomControl', 'fullscreenControl'],
    });

    markers.forEach((marker) => {
      const placemark = new window.ymaps.Placemark(
        [marker.lat, marker.lng],
        {
          balloonContentHeader: `<strong>${marker.title}</strong>`,
          balloonContentBody: `
            <p>${marker.address}</p>
            <a href="${marker.href}" style="color: #B71C1C; font-weight: 600;">Подробнее</a>
          `,
          hintContent: marker.title,
        },
        {
          preset: 'islands#redDotIcon',
        }
      );
      map.geoObjects.add(placemark);
    });

    if (markers.length > 1) {
      map.setBounds(map.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 50,
      });
    }

    return () => {
      map.destroy();
    };
  }, [mapLoaded, markers, mapCenter, zoom]);

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
