import { useState, useRef, useEffect } from 'react';

interface FacilityPin {
  id: string;
  label: string;
  icon: string;
  /** Optional stroke-based overlay path (e.g. smoke) */
  strokeIcon?: string;
  /** Position as percentage of image width/height */
  x: number;
  y: number;
  /** Which building: 1 = Fidel, 2 = ANM, 0 = shared */
  building: 0 | 1 | 2;
  /** Optional category for color coding */
  category: 'food' | 'fitness' | 'parking' | 'admin' | 'utility' | 'leisure' | 'transport';
  /** Optional rotation in degrees for directional icons */
  rotation?: number;
}

// --- SVG icon paths (Material Symbols style, 24x24 viewBox) ---
const ICONS = {
  // Fork + knife (столовая)
  restaurant: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
  // Coffee cup (кафе)
  cafe: 'M2 21h18v-2H2M20 8h-2V5h2m0-2H4v10a4 4 0 004 4h6a4 4 0 004-4v-3h2a2 2 0 002-2V5a2 2 0 00-2-2z',
  // Dumbbell (фитнес-студия)
  fitness: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43 1.43 1.43 2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z',
  // Pull-up bar / outdoor fitness (турники)
  outdoorGym: 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z',
  // Cigarette body (курилка)
  smoking: 'M3 16h12v3H3zm13 0h1.5v3H16zm2.5 0H20v3h-1.5z',
  // S-curve smoke angled ~30° left from right end of cigarette
  smoke: 'M15 15.5c-.8-1.8-2.8-2-3.2-3.8-.4-1.8 1.2-3 .8-4.8-.4-1.8-2.8-2.2-3.2-4',
  // P letter (паркинг)
  parking: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z',
  // Walking person (прогулочная зона)
  walk: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
  // Flame (котельная)
  flame: 'M13.5 .67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z',
  // SPb metro logo — uses 'spb' viewBox, rendered separately
  metro: 'SPB_METRO',
  // Tram / streetcar
  tram: 'M19 16.94V8.5c0-2.79-2.61-3.4-5.5-3.5l1.35-1.85C15.12 2.77 14.63 2 14 2H10c-.63 0-1.12.77-.85 1.15L10.5 5C7.61 5.1 5 5.71 5 8.5v8.44c0 1.45 1.19 2.56 2.5 2.56L6 21v1h2l2-2h4l2 2h2v-1l-1.5-1.5c1.31 0 2.5-1.11 2.5-2.56zM9.5 17c-.83 0-1.5-.67-1.5-1.5S8.67 14 9.5 14s1.5.67 1.5 1.5S10.33 17 9.5 17zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 12H7V8.5c0-.78.81-1.5 2-1.5h6c1.19 0 2 .72 2 1.5V12z',
  // Car (въезд/выезд)
  car: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
};

const facilities: FacilityPin[] = [
  // === Building 1 — Fidel (red brick, left side) ===
  { id: 'canteen-fidel',  label: 'Столовая',        icon: ICONS.restaurant, x: 31, y: 46, building: 1, category: 'food' },
  { id: 'cafe-fidel',     label: 'Кафе',             icon: ICONS.cafe,       x: 19, y: 55, building: 1, category: 'food' },
  { id: 'fitness-fidel',  label: 'Фитнес-студия',    icon: ICONS.fitness,    x: 39, y: 49, building: 1, category: 'fitness' },
  { id: 'bars-fidel',     label: 'Турники',          icon: ICONS.outdoorGym, x: 22, y: 52, building: 1, category: 'fitness' },
  { id: 'smoking-fidel',  label: 'Курилка',          icon: ICONS.smoking, strokeIcon: ICONS.smoke, x: 25, y: 49, building: 1, category: 'leisure' },
  { id: 'parking-fidel',  label: 'Паркинг',          icon: ICONS.parking,    x: 12, y: 50, building: 1, category: 'parking' },
  { id: 'walk',           label: 'Прогулочная зона',  icon: ICONS.walk,       x: 8,  y: 43, building: 1, category: 'fitness' },

  // === Building 2 — АНМ / АБК (beige/white, right side) ===
  { id: 'canteen-anm',    label: 'Столовая',         icon: ICONS.restaurant, x: 70, y: 36, building: 2, category: 'food' },
  { id: 'cafe-anm',       label: 'Кафе',             icon: ICONS.cafe,       x: 67, y: 43, building: 2, category: 'food' },
  { id: 'smoking-anm',    label: 'Курилка',          icon: ICONS.smoking, strokeIcon: ICONS.smoke, x: 76, y: 38, building: 2, category: 'leisure' },
  { id: 'parking-anm',    label: 'Паркинг',          icon: ICONS.parking,    x: 72, y: 48, building: 2, category: 'parking' },

  // === Shared / territory ===
  { id: 'parking-mid',    label: 'Паркинг',          icon: ICONS.parking,    x: 45, y: 60, building: 0, category: 'parking' },
  { id: 'boiler',         label: 'Котельная',         icon: ICONS.flame,      x: 59, y: 50, building: 0, category: 'utility' },

  // === Transport direction indicators ===
  { id: 'metro',          label: 'м. Елизаровская →', icon: ICONS.metro, x: 95, y: 23, building: 0, category: 'transport', rotation: -90 },
  { id: 'tram',           label: 'Трамвайная остановка ↓', icon: ICONS.tram,  x: 90, y: 90, building: 0, category: 'transport', rotation: 0 },

  // === Car entry/exit indicators (arrow shape, rotation = CSS degrees, base points →) ===
  { id: 'car-entry-1',    label: 'Въезд на территорию',  icon: ICONS.car, x: 94, y: 35, building: 0, category: 'transport', rotation: 180 },
  { id: 'car-exit-1',     label: 'Выезд с территории',   icon: ICONS.car, x: 94, y: 45, building: 0, category: 'transport', rotation: 0 },
  { id: 'car-entry-2',    label: 'Въезд на территорию',  icon: ICONS.car, x: 92, y: 69, building: 0, category: 'transport', rotation: 180 },
  { id: 'car-exit-2',     label: 'Выезд с территории',   icon: ICONS.car, x: 91, y: 73, building: 0, category: 'transport', rotation: 0 },

  // === Building labels (no icon, text only) ===
  { id: 'label-fidel',    label: 'БЦ Фидель',        icon: '',               x: 34, y: 27, building: 1, category: 'admin' },
  { id: 'label-anm',      label: 'БЦ АНМ',           icon: '',               x: 61, y: 23, building: 2, category: 'admin' },
];

const categoryColors: Record<string, { bg: string; border: string; icon: string }> = {
  food:    { bg: '#FFF5F5', border: '#B8003C', icon: '#B8003C' },
  fitness: { bg: '#F0FAF0', border: '#2E7D32', icon: '#2E7D32' },
  parking: { bg: '#F5F0FF', border: '#5C3D8F', icon: '#5C3D8F' },
  admin:   { bg: '#FFF8ED', border: '#B38026', icon: '#B38026' },
  utility: { bg: '#F0F0F0', border: '#3F4F55', icon: '#3F4F55' },
  leisure: { bg: '#EDF7FF', border: '#1565C0', icon: '#1565C0' },
  transport: { bg: 'rgba(240,240,240,0.8)', border: '#9E9E9E', icon: '#757575' },
};

const categoryLabels: Record<string, string> = {
  food: 'Питание',
  fitness: 'Фитнес',
  parking: 'Паркинг',
  utility: 'Инженерия',
  leisure: 'Зоны отдыха',
  transport: 'Транспорт',
};

export default function TerritoryMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if image already loaded before hydration
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, []);

  // Close tooltip on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePin(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const categories = Array.from(new Set(facilities.filter(f => f.icon).map(f => f.category)));

  const visibleFacilities = facilities.filter(f => {
    if (!activeCategory) return true;
    // Always show building labels
    if (!f.icon) return true;
    return f.category === activeCategory;
  });

  return (
    <div className="territory-map-wrap" ref={containerRef}>
      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: `1.5px solid ${!activeCategory ? '#B8003C' : '#E0E0E0'}`,
            background: !activeCategory ? '#B8003C' : '#fff',
            color: !activeCategory ? '#fff' : '#3F4F55',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 150ms ease-out',
            fontFamily: 'Tahoma, Geneva, Verdana, sans-serif',
          }}
        >
          Все
        </button>
        {categories.map(cat => {
          const c = categoryColors[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: `1.5px solid ${isActive ? c.border : '#E0E0E0'}`,
                background: isActive ? c.bg : '#fff',
                color: isActive ? c.icon : '#3F4F55',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 150ms ease-out',
                fontFamily: 'Tahoma, Geneva, Verdana, sans-serif',
              }}
            >
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      {/* Map container */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}>
        <img
          ref={imgRef}
          src="/territory/territory-map.jpg"
          alt="Аэрофотоснимок территории Александро-Невской Мануфактуры"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            aspectRatio: '2400 / 1475',
            background: '#F5F0E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#6B6B6B', fontSize: '14px' }}>Загрузка карты...</span>
          </div>
        )}

        {/* Pins overlay */}
        {imageLoaded && visibleFacilities.map((pin) => {
          const isLabel = !pin.icon;
          const colors = categoryColors[pin.category];
          const isActive = activePin === pin.id;

          if (isLabel) {
            // Building number labels
            return (
              <div
                key={pin.id}
                style={{
                  position: 'absolute',
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(4px)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#3F4F55',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Tahoma, Geneva, Verdana, sans-serif',
                  border: `1.5px solid ${colors.border}`,
                  letterSpacing: '0.02em',
                  zIndex: 5,
                  opacity: activeCategory ? 0.5 : 1,
                  transition: 'opacity 250ms ease-out',
                }}
              >
                {pin.label}
              </div>
            );
          }

          const isCarPin = pin.icon === ICONS.car;
          const isDroplet = pin.rotation !== undefined && !isCarPin;
          const isDirectional = isDroplet || isCarPin;

          // Arrow chevron clip-path: pentagon pointing right →
          // Rotated via CSS rotate to point in the desired direction
          const arrowClip = 'polygon(0% 5%, 60% 5%, 100% 50%, 60% 95%, 0% 95%, 12% 50%)';

          return (
            <div
              key={pin.id}
              style={{
                position: 'absolute',
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 20 : 10,
                transition: 'opacity 250ms ease-out',
                opacity: activeCategory && activeCategory !== pin.category ? 0.2 : (pin.category === 'transport' ? 0.65 : 1),
              }}
            >
              {/* Pin button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePin(isActive ? null : pin.id);
                }}
                onMouseEnter={() => setActivePin(pin.id)}
                onMouseLeave={() => setActivePin(null)}
                style={{
                  width: isCarPin ? '44px' : (isDroplet ? '40px' : '36px'),
                  height: isCarPin ? '34px' : (isDroplet ? '40px' : '36px'),
                  borderRadius: isCarPin ? '0' : (isDroplet ? '50% 50% 50% 0' : '50%'),
                  clipPath: isCarPin ? arrowClip : undefined,
                  border: isCarPin ? 'none' : `2px solid ${colors.border}`,
                  background: isCarPin ? colors.bg : colors.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  rotate: isCarPin
                    ? `${pin.rotation || 0}deg`
                    : (isDroplet ? `${(pin.rotation || 0) - 45}deg` : undefined),
                  boxShadow: isCarPin
                    ? (isActive ? `0 4px 12px rgba(0,0,0,0.25)` : '0 2px 6px rgba(0,0,0,0.18)')
                    : (isActive
                      ? `0 0 0 3px ${colors.border}33, 0 4px 12px rgba(0,0,0,0.2)`
                      : '0 2px 6px rgba(0,0,0,0.15)'),
                  transition: 'all 200ms ease-out',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  padding: 0,
                  // Visible border via box-shadow for clipped elements
                  filter: isCarPin ? `drop-shadow(0 0 1px ${colors.border}) drop-shadow(0 1px 3px rgba(0,0,0,0.15))` : undefined,
                }}
                aria-label={pin.label}
              >
                {pin.icon === 'SPB_METRO' ? (
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 2e7 1.508e7"
                    fill={colors.icon}
                    style={isDroplet ? { rotate: `${-((pin.rotation || 0) - 45)}deg` } : undefined}
                  >
                    <path d="m6026765 2907127c-299804-1015676-1113594-904356-1.67e6 -431300-1370626 1266075-3155291 3923495-2013094 7.75e6 956578 3241739 4936901 5314839 4936901 5314839h-4.64e6s-2395828-2685264-2.61e6 -5843500c-271260-3993020 1327930-6511332 3183988-8153020 1741824-1544365 3398006-2003480 3398006-2003480l3387831 1.11e7 3387831-1.11e7s1656182 459116 3398006 2003480c1856058 1641687 3455248 4.16e6 3183988 8153020-214173 3158236-2.61e6 5843500-2.61e6 5843500h-4.64e6s3.98e6 -2073100 4936900-5314839c1142197-3826069-642468-6483489-2013094-7.75e6 -556826-473056-1370617-584376-1.67e6 431300-1027971 3241740-3973210 1.253e7 -3973210 1.253e7s-2945239-9291363-3973210-1.253e7z" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={colors.icon}
                    style={isDirectional ? { rotate: isCarPin
                      ? `${-(pin.rotation || 0)}deg`
                      : `${-((pin.rotation || 0) - 45)}deg` } : undefined}
                  >
                    <path d={pin.icon} />
                    {pin.strokeIcon && (
                      <path
                        d={pin.strokeIcon}
                        fill="none"
                        stroke={colors.icon}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                )}
              </button>

              {/* Tooltip */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  fontFamily: 'Tahoma, Geneva, Verdana, sans-serif',
                  border: `1px solid ${colors.border}22`,
                  zIndex: 30,
                }}>
                  {pin.label}
                  {/* Arrow */}
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid #fff',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
