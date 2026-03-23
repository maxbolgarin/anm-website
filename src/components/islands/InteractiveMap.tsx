import { useEffect, useRef, useState } from 'react';

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
    mapgl: any;
  }
}

const API_KEY = '48f2d592-d4f4-4319-b6fe-22bc96e6bb10';

export default function InteractiveMap({
  markers,
  center,
  zoom = 16,
  height = '100%',
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapCenter = center || (markers.length > 0
    ? {
        lat: markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
        lng: markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
      }
    : { lat: 59.9010, lng: 30.4295 });

  useEffect(() => {
    if (window.mapgl) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://mapgl.2gis.com/api/js/v1';
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.mapgl) return;

    // Destroy previous instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
    }

    const map = new window.mapgl.Map(mapRef.current, {
      center: [mapCenter.lng, mapCenter.lat],
      zoom: zoom,
      key: API_KEY,
      pitch: 45,
      style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b',
    });

    mapInstanceRef.current = map;

    // Add markers
    markers.forEach((marker) => {
      const markerInstance = new window.mapgl.Marker(map, {
        coordinates: [marker.lng, marker.lat],
        label: {
          text: marker.title,
          offset: [0, -60],
          image: {
            url: '',
            size: [0, 0],
            padding: [6, 12, 6, 12],
          },
          color: '#B71C1C',
          fontSize: 14,
          haloRadius: 2,
          haloColor: '#ffffff',
        },
      });

      markerInstance.on('click', () => {
        window.location.href = marker.href;
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
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
