import { useState } from 'react';
import './BuildingTabs.css';

interface BuildingTabData {
  name: string;
  fullName: string;
  slug: string;
  buildingClass: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  stats: { value: string | number; label: string; unit?: string }[];
}

interface Props {
  buildings: BuildingTabData[];
  contactHref?: string;
}

export default function BuildingTabs({ buildings, contactHref = '/arenda/' }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = buildings[activeIndex];

  // Show up to 6 gallery images
  const displayImages = active.galleryImages.slice(0, 6);

  return (
    <div className="building-tabs">
      <div className="building-tabs__header">
        <span className="building-tabs__label">Наши объекты:</span>
        <div className="building-tabs__tab-list" role="tablist">
          {buildings.map((b, i) => (
            <button
              key={b.slug}
              role="tab"
              aria-selected={i === activeIndex}
              className={`building-tabs__tab ${i === activeIndex ? 'building-tabs__tab--active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              {b.fullName}
            </button>
          ))}
        </div>
      </div>

      <div className="building-tabs__content" role="tabpanel">
        <div className="building-tabs__top">
          <div className="building-tabs__info">
            <div className="building-tabs__class-badge">{active.buildingClass}</div>
            <p className="building-tabs__description">{active.description}</p>
            <div className="building-tabs__stats">
              {active.stats.map((stat, i) => (
                <div key={i} className="building-tabs__stat">
                  <span className="building-tabs__stat-value">
                    {stat.value}{stat.unit ? ` ${stat.unit}` : ''}
                  </span>
                  <span className="building-tabs__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="building-tabs__actions">
              <a href={`/buildings/${active.slug}/`} className="btn btn--primary">
                Подробнее
              </a>
              <a href={contactHref} className="btn btn--outline">
                Узнать о свободных площадях
              </a>
            </div>
          </div>
          <div className="building-tabs__hero">
            <img
              src={active.heroImage}
              alt={`Бизнес-центр ${active.name}`}
              className="building-tabs__hero-img"
              loading="eager"
            />
          </div>
        </div>

        <div className="building-tabs__gallery">
          {displayImages.map((img, i) => (
            <div key={i} className="building-tabs__gallery-item">
              <img
                src={img}
                alt={`${active.name} — фото ${i + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
