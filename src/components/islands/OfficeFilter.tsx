import React, { useState, useEffect, useMemo } from 'react';
import OfficeCard from './OfficeCard';

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
}

export default function OfficeFilter({
  buildingSlug,
  contactPhone = '+7 (812) 336-55-64',
  contactEmail = 'arenda@ukanm.ru',
  typicalOffices = [],
}: OfficeFilterProps) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const officesDataUrl = `${baseUrl}data/offices.json`;

  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [areaMin, setAreaMin] = useState<number>(0);
  const [areaMax, setAreaMax] = useState<number>(1000);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [selectedType, setSelectedType] = useState<string>('all');

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
    return <div className="office-filter__loading">Загрузка предложений...</div>;
  }

  // ─── FULL CAPACITY STATE ───
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
              <span className="office-typical__param-label">Площадь</span>
              <span className="office-typical__param-value">{office.area}</span>
            </div>
            <div className="office-typical__param">
              <span className="office-typical__param-label">Класс</span>
              <span className="office-typical__param-value">{office.buildingClass}</span>
            </div>
            <div className="office-typical__param">
              <span className="office-typical__param-label">Тип</span>
              <span className="office-typical__param-value">{office.type}</span>
            </div>
            <div className="office-typical__param">
              <span className="office-typical__param-label">Стоимость</span>
              <span className="office-typical__param-value">{office.pricePerSqm}</span>
            </div>
          </div>
        </div>
      </div>
    );

    // ─── SINGLE BUILDING: side-by-side layout ───
    if (isSingleBuilding && typicalOffices.length > 0) {
      return (
        <div className="office-capacity office-capacity--split">
          <div className="office-capacity__card">
            <div className="office-capacity__header">
              <span className="office-capacity__badge">Заполняемость 100%</span>
              <h2 className="office-capacity__title">Все помещения заняты</h2>
              <p className="office-capacity__text">
                Оставьте заявку — мы свяжемся с вами при появлении свободных помещений
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
      );
    }

    // ─── MULTIPLE BUILDINGS: stacked layout ───
    return (
      <div className="office-capacity">
        <div className="office-capacity__card">
          <div className="office-capacity__header">
            <span className="office-capacity__badge">Заполняемость 100%</span>
            <h2 className="office-capacity__title">Все помещения заняты</h2>
            <p className="office-capacity__text">
              Оставьте заявку — мы свяжемся с вами при появлении свободных помещений
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
            <h3 className="office-typical__title">Примеры типовых офисов</h3>
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
                        <span>План помещения</span>
                      </div>
                    )}
                  </div>
                  <div className="office-typical__info">
                    <h4 className="office-typical__label">{office.label}</h4>
                    <div className="office-typical__params">
                      <div className="office-typical__param">
                        <span className="office-typical__param-label">Площадь</span>
                        <span className="office-typical__param-value">{office.area}</span>
                      </div>
                      <div className="office-typical__param">
                        <span className="office-typical__param-label">Класс</span>
                        <span className="office-typical__param-value">{office.buildingClass}</span>
                      </div>
                      <div className="office-typical__param">
                        <span className="office-typical__param-label">Тип</span>
                        <span className="office-typical__param-value">{office.type}</span>
                      </div>
                      <div className="office-typical__param">
                        <span className="office-typical__param-label">Стоимость</span>
                        <span className="office-typical__param-value">{office.pricePerSqm}</span>
                      </div>
                    </div>
                    <span className="office-typical__link">Подробнее о здании →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── OFFICES AVAILABLE STATE ───
  return (
    <div className="office-filter">
      <div className="office-filter__controls">
        {!buildingSlug && buildingOptions.length > 1 && (
          <div className="office-filter__group">
            <label className="office-filter__label">Бизнес-центр</label>
            <div className="office-filter__toggles">
              <button
                className={`office-filter__toggle ${selectedBuilding === 'all' ? 'office-filter__toggle--active' : ''}`}
                onClick={() => setSelectedBuilding('all')}
              >
                Все
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
          <label className="office-filter__label">Этаж</label>
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
          <label className="office-filter__label">Площадь, м²</label>
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
          <label className="office-filter__label">Цена, ₽/м²</label>
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
          <label className="office-filter__label">Тип</label>
          <div className="office-filter__toggles">
            <button
              className={`office-filter__toggle ${selectedType === 'all' ? 'office-filter__toggle--active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              Все
            </button>
            <button
              className={`office-filter__toggle ${selectedType === 'cabinet' ? 'office-filter__toggle--active' : ''}`}
              onClick={() => setSelectedType('cabinet')}
            >
              Кабинет
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

      <div className="office-filter__results-count">
        Найдено: <strong>{filteredOffices.length}</strong> {filteredOffices.length === 1 ? 'помещение' : 'помещений'}
      </div>

      {filteredOffices.length > 0 ? (
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
            />
          ))}
        </div>
      ) : (
        <div className="office-filter__no-results">
          <p>По выбранным фильтрам помещений не найдено.</p>
          <p>Попробуйте изменить параметры поиска или свяжитесь с нами:</p>
          <a href={`tel:${contactPhone.replace(/[\s()-]/g, '')}`}>{contactPhone}</a>
        </div>
      )}
    </div>
  );
}
