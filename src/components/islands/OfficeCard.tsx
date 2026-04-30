import React from 'react';

interface OfficeCardProps {
  id: string;
  buildingName: string;
  area: number;
  floor: number;
  classRating: string;
  type: 'cabinet' | 'open-space';
  address: string;
  pricePerSqm: number;
  totalPrice: number;
  photoCount: number;
  locale?: string;
}

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function OfficeCard({
  buildingName,
  area,
  floor,
  classRating,
  type,
  address,
  pricePerSqm,
  totalPrice,
  photoCount,
  locale = 'ru',
}: OfficeCardProps) {
  const isEn = locale === 'en';
  const typeLabel = type === 'cabinet' ? (isEn ? 'Private Office' : 'Кабинет') : (isEn ? 'Open Space' : 'Открытое пространство');

  return (
    <div className="office-card">
      <div className="office-card__header">
        <span className="office-card__building">{buildingName}</span>
        <span className="office-card__class">{classRating}</span>
      </div>

      <div className="office-card__stats">
        <div className="office-card__stat">
          <span className="office-card__stat-value">{formatNumber(area)}</span>
          <span className="office-card__stat-unit">{isEn ? 'm²' : 'м²'}</span>
        </div>
        <div className="office-card__stat">
          <span className="office-card__stat-value">{floor}</span>
          <span className="office-card__stat-label">{isEn ? 'floor' : 'этаж'}</span>
        </div>
      </div>

      <div className="office-card__meta">
        <span className="office-card__type">{typeLabel}</span>
        <span className="office-card__address">{address}</span>
      </div>

      <div className="office-card__pricing">
        <div className="office-card__price-main">
          <span className="office-card__price-value">{formatNumber(pricePerSqm)}</span>
          <span className="office-card__price-unit">{isEn ? '₽/m² per month' : '₽/м² в месяц'}</span>
        </div>
        <div className="office-card__price-total">
          <span>{formatNumber(totalPrice)} {isEn ? '₽/mo' : '₽/мес'}</span>
        </div>
      </div>

      {photoCount > 0 && (
        <div className="office-card__photos">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 3H2a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zm-1 8H3l2.5-4 2 2.5L10 7l3 4z"/>
          </svg>
          <span>{photoCount} {isEn ? 'photos' : 'фото'}</span>
        </div>
      )}
    </div>
  );
}
