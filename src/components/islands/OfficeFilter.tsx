import React, { useState, useEffect, useMemo } from 'react';
import OfficeCard from './OfficeCard';
import { withBase } from '@utils/withBase';

interface Office {
  id: string;
  buildingSlug: string;
  buildingName: string;
  area: number;
  floor: number;
  class: string;
  type: 'cabinet' | 'open-space';
  address: string;
  pricePerSqm: number;
  totalPrice: number;
  photos: string[];
  available: boolean;
  description?: string;
  descriptionEn?: string;
  features?: string[];
  featuresEn?: string[];
  ceilingHeight?: number;
  leaseTerms?: {
    minTerm?: string;
    minTermEn?: string;
    deposit?: string;
    depositEn?: string;
    includes?: string[];
    includesEn?: string[];
    extra?: string[];
    extraEn?: string[];
  };
}

interface TypicalOffice {
  label: string;
  planImage: string;
  area: string;
  buildingClass: string;
  type: string;
  pricePerSqm: string;
  href: string;
}

interface OfficeFilterProps {
  buildingSlug?: string;
  contactPhone?: string;
  contactEmail?: string;
  typicalOffices?: TypicalOffice[];
  locale?: string;
  /** When this building has no offices, suggest checking the other building */
  otherBuildingName?: string;
  otherBuildingOfficesUrl?: string;
}

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function OfficeFilter({
  buildingSlug,
  contactPhone = '+7 (812) 336-55-64',
  contactEmail = 'arenda@ukanm.ru',
  typicalOffices = [],
  locale = 'ru',
  otherBuildingName,
  otherBuildingOfficesUrl,
}: OfficeFilterProps) {
  const isEn = locale === 'en';
  const officesDataUrl = withBase('/data/offices.json');

  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [areaMin, setAreaMin] = useState<number>(0);
  const [areaMax, setAreaMax] = useState<number>(1000);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [selectedType, setSelectedType] = useState<string>('all');

  // For multi-office browsing: current index for arrow navigation
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(officesDataUrl)
      .then((res) => res.json())
      .then((data: Office[]) => {
        const available = data.filter((o) => o.available);
        const scoped = buildingSlug
          ? available.filter((o) => o.buildingSlug === buildingSlug)
          : available;
        setOffices(scoped);

        if (scoped.length > 0) {
          setAreaMin(Math.min(...scoped.map((o) => o.area)));
          setAreaMax(Math.max(...scoped.map((o) => o.area)));
          setPriceMin(Math.min(...scoped.map((o) => o.pricePerSqm)));
          setPriceMax(Math.max(...scoped.map((o) => o.pricePerSqm)));
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [buildingSlug, officesDataUrl]);

  const buildingOptions = useMemo(() => {
    const slugs = [...new Set(offices.map((o) => o.buildingSlug))];
    return slugs.map((slug) => ({
      slug,
      name: offices.find((o) => o.buildingSlug === slug)?.buildingName || slug,
    }));
  }, [offices]);

  const floorOptions = useMemo(() => {
    return [...new Set(offices.map((o) => o.floor))].sort((a, b) => a - b);
  }, [offices]);

  const dataAreaMin = useMemo(() => offices.length > 0 ? Math.min(...offices.map((o) => o.area)) : 0, [offices]);
  const dataAreaMax = useMemo(() => offices.length > 0 ? Math.max(...offices.map((o) => o.area)) : 1000, [offices]);
  const dataPriceMin = useMemo(() => offices.length > 0 ? Math.min(...offices.map((o) => o.pricePerSqm)) : 0, [offices]);
  const dataPriceMax = useMemo(() => offices.length > 0 ? Math.max(...offices.map((o) => o.pricePerSqm)) : 5000, [offices]);

  const filteredOffices = useMemo(() => {
    return offices.filter((o) => {
      if (selectedBuilding !== 'all' && o.buildingSlug !== selectedBuilding) return false;
      if (selectedFloors.length > 0 && !selectedFloors.includes(o.floor)) return false;
      if (o.area < areaMin || o.area > areaMax) return false;
      if (o.pricePerSqm < priceMin || o.pricePerSqm > priceMax) return false;
      if (selectedType !== 'all' && o.type !== selectedType) return false;
      return true;
    });
  }, [offices, selectedBuilding, selectedFloors, areaMin, areaMax, priceMin, priceMax, selectedType]);

  const toggleFloor = (floor: number) => {
    setSelectedFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };

  if (loading) {
    return <div className="office-filter__loading">{isEn ? 'Loading offices...' : 'Загрузка предложений...'}</div>;
  }

  // ─── FULL CAPACITY STATE (0 offices) ───
  if (offices.length === 0) {
    const isSingleBuilding = typicalOffices.length === 1;

    const typicalCard = (office: TypicalOffice) => (
      <div key={office.label} className="office-typical__card">
        <div className="office-typical__image-wrap">
          {office.planImage ? (
            <img src={office.planImage} alt={office.label} className="office-typical__image" />
          ) : (
            <div className="office-typical__image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>План помещения</span>
            </div>
          )}
        </div>
        <div className="office-typical__info">
          <h4 className="office-typical__label">{office.label}</h4>
          <div className="office-typical__params">
            <div className="office-typical__param">
              <span className="office-typical__param-label">{isEn ? 'Area' : 'Площадь'}</span>
              <span className="office-typical__param-value">{office.area}</span>
            </div>
            <div className="office-typical__param">
              <span className="office-typical__param-label">{isEn ? 'Class' : 'Класс'}</span>
              <span className="office-typical__param-value">{office.buildingClass}</span>
            </div>
            <div className="office-typical__param">
              <span className="office-typical__param-label">{isEn ? 'Type' : 'Тип'}</span>
              <span className="office-typical__param-value">{office.type}</span>
            </div>
            <div className="office-typical__param">
              <span className="office-typical__param-label">{isEn ? 'Price' : 'Стоимость'}</span>
              <span className="office-typical__param-value">{office.pricePerSqm}</span>
            </div>
          </div>
        </div>
      </div>
    );

    if (isSingleBuilding && typicalOffices.length > 0) {
      return (
        <div className="office-capacity office-capacity--with-suggestion">
          <div className="office-capacity--split">
            <div className="office-capacity__card">
              <div className="office-capacity__header">
                <span className="office-capacity__badge">{isEn ? '100% Occupancy' : 'Заполняемость 100%'}</span>
                <h2 className="office-capacity__title">{isEn ? 'All Spaces Occupied' : 'Все помещения заняты'}</h2>
                <p className="office-capacity__text">
                  {isEn ? 'Submit a request — we\'ll contact you when spaces become available' : 'Оставьте заявку — мы свяжемся с вами при появлении свободных помещений'}
                </p>
              </div>
              <div className="office-capacity__contacts">
                <a href={`tel:${contactPhone.replace(/[\s()-]/g, '')}`} className="office-capacity__phone">
                  {contactPhone}
                </a>
                <a href={`mailto:${contactEmail}`} className="office-capacity__email">
                  {contactEmail}
                </a>
              </div>
            </div>
            <div className="office-typical office-typical--single">
              {typicalCard(typicalOffices[0])}
            </div>
          </div>

          {otherBuildingName && otherBuildingOfficesUrl && (
            <div className="office-capacity__other">
              <div className="office-capacity__other-inner">
                <div className="office-capacity__other-text">
                  <span className="office-capacity__other-badge">
                    {isEn ? 'Available Now' : 'Есть свободные'}
                  </span>
                  <p className="office-capacity__other-desc">
                    {isEn
                      ? `There are available offices in ${otherBuildingName}. View current options:`
                      : `В ${otherBuildingName} есть свободные помещения. Посмотрите актуальные предложения:`}
                  </p>
                </div>
                <a href={otherBuildingOfficesUrl} className="office-capacity__other-link">
                  {isEn
                    ? `Offices in ${otherBuildingName}`
                    : `Офисы в ${otherBuildingName}`}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 10h10M11 6l4 4-4 4" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="office-capacity">
        <div className="office-capacity__card">
          <div className="office-capacity__header">
            <span className="office-capacity__badge">{isEn ? '100% Occupancy' : 'Заполняемость 100%'}</span>
            <h2 className="office-capacity__title">{isEn ? 'All Spaces Occupied' : 'Все помещения заняты'}</h2>
            <p className="office-capacity__text">
              {isEn ? 'Submit a request — we\'ll contact you when spaces become available' : 'Оставьте заявку — мы свяжемся с вами при появлении свободных помещений'}
            </p>
          </div>
          <div className="office-capacity__contacts">
            <a href={`tel:${contactPhone.replace(/[\s()-]/g, '')}`} className="office-capacity__phone">
              {contactPhone}
            </a>
            <a href={`mailto:${contactEmail}`} className="office-capacity__email">
              {contactEmail}
            </a>
          </div>
        </div>

        {typicalOffices.length > 0 && (
          <div className="office-typical">
            <h3 className="office-typical__title">{isEn ? 'Typical Office Examples' : 'Примеры типовых офисов'}</h3>
            <div className="office-typical__grid">
              {typicalOffices.map((office) => (
                <a key={office.label} href={office.href} className="office-typical__card">
                  <div className="office-typical__image-wrap">
                    {office.planImage ? (
                      <img src={office.planImage} alt={office.label} className="office-typical__image" />
                    ) : (
                      <div className="office-typical__image-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        <span>{isEn ? 'Floor Plan' : 'План помещения'}</span>
                      </div>
                    )}
                  </div>
                  <div className="office-typical__info">
                    <h4 className="office-typical__label">{office.label}</h4>
                    <div className="office-typical__params">
                      <div className="office-typical__param">
                        <span className="office-typical__param-label">{isEn ? 'Area' : 'Площадь'}</span>
                        <span className="office-typical__param-value">{office.area}</span>
                      </div>
                      <div className="office-typical__param">
                        <span className="office-typical__param-label">{isEn ? 'Class' : 'Класс'}</span>
                        <span className="office-typical__param-value">{office.buildingClass}</span>
                      </div>
                      <div className="office-typical__param">
                        <span className="office-typical__param-label">{isEn ? 'Type' : 'Тип'}</span>
                        <span className="office-typical__param-value">{office.type}</span>
                      </div>
                      <div className="office-typical__param">
                        <span className="office-typical__param-label">{isEn ? 'Price' : 'Стоимость'}</span>
                        <span className="office-typical__param-value">{office.pricePerSqm}</span>
                      </div>
                    </div>
                    <span className="office-typical__link">{isEn ? 'More about the building →' : 'Подробнее о здании →'}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── SINGLE OFFICE DETAIL VIEW ───
  if (offices.length === 1) {
    return (
      <OfficeDetailView
        office={offices[0]}
        isEn={isEn}
        contactPhone={contactPhone}
        contactEmail={contactEmail}
      />
    );
  }

  // ─── MULTIPLE OFFICES — FILTER + GRID (2+) ───
  // When there are few offices (2-3), show a simpler nav instead of full filter panel
  const showFullFilters = offices.length > 3;

  return (
    <div className="office-filter">
      {showFullFilters && (
        <div className="office-filter__controls">
          {!buildingSlug && buildingOptions.length > 1 && (
            <div className="office-filter__group">
              <label className="office-filter__label">{isEn ? 'Business Center' : 'Бизнес-центр'}</label>
              <div className="office-filter__toggles">
                <button
                  className={`office-filter__toggle ${selectedBuilding === 'all' ? 'office-filter__toggle--active' : ''}`}
                  onClick={() => setSelectedBuilding('all')}
                >
                  {isEn ? 'All' : 'Все'}
                </button>
                {buildingOptions.map((b) => (
                  <button
                    key={b.slug}
                    className={`office-filter__toggle ${selectedBuilding === b.slug ? 'office-filter__toggle--active' : ''}`}
                    onClick={() => setSelectedBuilding(b.slug)}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="office-filter__group">
            <label className="office-filter__label">{isEn ? 'Floor' : 'Этаж'}</label>
            <div className="office-filter__toggles">
              {floorOptions.map((floor) => (
                <button
                  key={floor}
                  className={`office-filter__toggle ${selectedFloors.includes(floor) ? 'office-filter__toggle--active' : ''}`}
                  onClick={() => toggleFloor(floor)}
                >
                  {floor}
                </button>
              ))}
            </div>
          </div>

          <div className="office-filter__group">
            <label className="office-filter__label">{isEn ? 'Area, m²' : 'Площадь, м²'}</label>
            <div className="office-filter__range">
              <input
                type="number"
                className="office-filter__input"
                value={areaMin}
                min={dataAreaMin}
                max={dataAreaMax}
                onChange={(e) => setAreaMin(Number(e.target.value))}
                placeholder="от"
              />
              <span className="office-filter__range-sep">—</span>
              <input
                type="number"
                className="office-filter__input"
                value={areaMax}
                min={dataAreaMin}
                max={dataAreaMax}
                onChange={(e) => setAreaMax(Number(e.target.value))}
                placeholder="до"
              />
            </div>
          </div>

          <div className="office-filter__group">
            <label className="office-filter__label">{isEn ? 'Price, ₽/m²' : 'Цена, ₽/м²'}</label>
            <div className="office-filter__range">
              <input
                type="number"
                className="office-filter__input"
                value={priceMin}
                min={dataPriceMin}
                max={dataPriceMax}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                placeholder="от"
              />
              <span className="office-filter__range-sep">—</span>
              <input
                type="number"
                className="office-filter__input"
                value={priceMax}
                min={dataPriceMin}
                max={dataPriceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                placeholder="до"
              />
            </div>
          </div>

          <div className="office-filter__group">
            <label className="office-filter__label">{isEn ? 'Type' : 'Тип'}</label>
            <div className="office-filter__toggles">
              <button
                className={`office-filter__toggle ${selectedType === 'all' ? 'office-filter__toggle--active' : ''}`}
                onClick={() => setSelectedType('all')}
              >
                {isEn ? 'All' : 'Все'}
              </button>
              <button
                className={`office-filter__toggle ${selectedType === 'cabinet' ? 'office-filter__toggle--active' : ''}`}
                onClick={() => setSelectedType('cabinet')}
              >
                {isEn ? 'Private Office' : 'Кабинет'}
              </button>
              <button
                className={`office-filter__toggle ${selectedType === 'open-space' ? 'office-filter__toggle--active' : ''}`}
                onClick={() => setSelectedType('open-space')}
              >
                Open Space
              </button>
            </div>
          </div>
        </div>
      )}

      {/* For small sets (2-3), show a simple tab-like nav */}
      {!showFullFilters && offices.length > 1 && (
        <div className="office-filter__tabs">
          {offices.map((o, i) => (
            <button
              key={o.id}
              className={`office-filter__tab ${currentIndex === i ? 'office-filter__tab--active' : ''}`}
              onClick={() => setCurrentIndex(i)}
            >
              <span className="office-filter__tab-floor">
                {isEn ? 'Floor' : 'Этаж'} {o.floor}
              </span>
              <span className="office-filter__tab-area">{o.area} {isEn ? 'm²' : 'м²'}</span>
            </button>
          ))}
        </div>
      )}

      {showFullFilters && (
        <div className="office-filter__results-count">
          {isEn ? 'Found: ' : 'Найдено: '}<strong>{filteredOffices.length}</strong> {filteredOffices.length === 1 ? (isEn ? 'space' : 'помещение') : (isEn ? 'spaces' : 'помещений')}
        </div>
      )}

      {/* If using tabs (2-3 offices), show detail view for selected office */}
      {!showFullFilters && offices.length > 1 ? (
        <OfficeDetailView
          office={offices[currentIndex]}
          isEn={isEn}
          contactPhone={contactPhone}
          contactEmail={contactEmail}
        />
      ) : (
        /* Grid mode for 4+ offices */
        filteredOffices.length > 0 ? (
          <div className="office-filter__grid">
            {filteredOffices.map((office) => (
              <OfficeCard
                key={office.id}
                id={office.id}
                buildingName={office.buildingName}
                area={office.area}
                floor={office.floor}
                classRating={office.class}
                type={office.type}
                address={office.address}
                pricePerSqm={office.pricePerSqm}
                totalPrice={office.totalPrice}
                photoCount={office.photos.length}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="office-filter__no-results">
            <p>{isEn ? 'No spaces found matching your criteria.' : 'По выбранным фильтрам помещений не найдено.'}</p>
            <p>{isEn ? 'Try adjusting your filters or contact us:' : 'Попробуйте изменить параметры поиска или свяжитесь с нами:'}</p>
            <a href={`tel:${contactPhone.replace(/[\s()-]/g, '')}`}>{contactPhone}</a>
          </div>
        )
      )}
    </div>
  );
}


// ─── Reusable detail view for a single office (used in both single and tab modes) ───
function OfficeDetailView({
  office,
  isEn,
  contactPhone,
  contactEmail,
}: {
  office: Office;
  isEn: boolean;
  contactPhone: string;
  contactEmail: string;
}) {
  const [activePhoto, setActivePhoto] = useState(0);

  const typeLabel = office.type === 'cabinet'
    ? (isEn ? 'Private Office' : 'Кабинет')
    : (isEn ? 'Open Space' : 'Открытое пространство');
  const description = isEn ? office.descriptionEn : office.description;
  const features = isEn ? office.featuresEn : office.features;
  const terms = office.leaseTerms;
  const minTerm = isEn ? terms?.minTermEn : terms?.minTerm;
  const deposit = isEn ? terms?.depositEn : terms?.deposit;
  const includes = isEn ? terms?.includesEn : terms?.includes;
  const extra = isEn ? terms?.extraEn : terms?.extra;

  return (
    <div className="office-detail">
      <div className="office-detail__layout">
        <div className="office-detail__gallery-wrap">
          <div className="office-detail__gallery">
            {office.photos.length > 0 ? (
              <img
                src={withBase(office.photos[activePhoto])}
                alt={`${office.buildingName} — ${isEn ? 'photo' : 'фото'} ${activePhoto + 1}`}
                className="office-detail__hero-img"
              />
            ) : (
              <div className="office-detail__hero-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="2" y="2" width="20" height="20" rx="2" />
                  <path d="M2 17l5-5 4 4 4-6 7 7" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                </svg>
                <span>{isEn ? 'Photos coming soon' : 'Фото скоро появятся'}</span>
              </div>
            )}
          </div>

          {office.photos.length > 1 && (
            <div className="office-detail__thumbs">
              {office.photos.map((photo, i) => (
                <button
                  key={i}
                  className={`office-detail__thumb ${activePhoto === i ? 'office-detail__thumb--active' : ''}`}
                  onClick={() => setActivePhoto(i)}
                  aria-label={`${isEn ? 'Photo' : 'Фото'} ${i + 1}`}
                >
                  <img src={withBase(photo)} alt="" className="office-detail__thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="office-detail__info">
          <div className="office-detail__badges">
            <span className="office-detail__badge office-detail__badge--available">
              {isEn ? 'Available' : 'Свободно'}
            </span>
            <span className="office-detail__badge office-detail__badge--class">
              {isEn ? 'Class' : 'Класс'} {office.class}
            </span>
            <span className="office-detail__badge office-detail__badge--type">
              {typeLabel}
            </span>
          </div>

          <div className="office-detail__stats">
            <div className="office-detail__stat">
              <span className="office-detail__stat-value">{office.area}</span>
              <span className="office-detail__stat-unit">{isEn ? 'm²' : 'м²'}</span>
              <span className="office-detail__stat-label">{isEn ? 'area' : 'площадь'}</span>
            </div>
            <div className="office-detail__stat">
              <span className="office-detail__stat-value">{office.floor}</span>
              <span className="office-detail__stat-label">{isEn ? 'floor' : 'этаж'}</span>
            </div>
            {office.ceilingHeight && (
              <div className="office-detail__stat">
                <span className="office-detail__stat-value">{office.ceilingHeight}</span>
                <span className="office-detail__stat-unit">{isEn ? 'm' : 'м'}</span>
                <span className="office-detail__stat-label">{isEn ? 'ceiling' : 'потолки'}</span>
              </div>
            )}
          </div>

          {description && (
            <p className="office-detail__description">{description}</p>
          )}

          {features && features.length > 0 && (
            <div className="office-detail__features">
              {features.map((f, i) => (
                <span key={i} className="office-detail__feature">{f}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="office-detail__bottom">
        <div className="office-detail__pricing-block">
          <div className="office-detail__price-row">
            <div className="office-detail__price-main">
              <span className="office-detail__price-value">{formatNumber(office.totalPrice)}</span>
              <span className="office-detail__price-currency">{isEn ? '₽/month' : '₽/мес'}</span>
            </div>
            <div className="office-detail__price-per-sqm">
              {formatNumber(office.pricePerSqm)} {isEn ? '₽/m²' : '₽/м²'}
            </div>
          </div>

          {terms && (
            <div className="office-detail__terms">
              {minTerm && (
                <div className="office-detail__term">
                  <span className="office-detail__term-label">{isEn ? 'Lease term' : 'Срок аренды'}</span>
                  <span className="office-detail__term-value">{minTerm}</span>
                </div>
              )}
              {deposit && (
                <div className="office-detail__term">
                  <span className="office-detail__term-label">{isEn ? 'Deposit' : 'Обеспечительный платёж'}</span>
                  <span className="office-detail__term-value">{deposit}</span>
                </div>
              )}
              {includes && includes.length > 0 && (
                <div className="office-detail__term">
                  <span className="office-detail__term-label">{isEn ? 'Included' : 'Включено'}</span>
                  <span className="office-detail__term-value">{includes.join(', ')}</span>
                </div>
              )}
              {extra && extra.length > 0 && (
                <div className="office-detail__term">
                  <span className="office-detail__term-label">{isEn ? 'Separately' : 'Отдельно'}</span>
                  <span className="office-detail__term-value">{extra.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="office-detail__cta">
          <p className="office-detail__cta-text">
            {isEn
              ? 'Direct lease from the building owner. Contact us to schedule a viewing:'
              : 'Прямая аренда от собственника здания. Свяжитесь с нами для просмотра:'}
          </p>
          <div className="office-detail__cta-contacts">
            <a href={`tel:${contactPhone.replace(/[\s()-]/g, '')}`} className="office-detail__cta-phone">
              {contactPhone}
            </a>
            <a href={`mailto:${contactEmail}`} className="office-detail__cta-email">
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
