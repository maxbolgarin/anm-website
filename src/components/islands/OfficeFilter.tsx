import React, { useState, useEffect, useMemo } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
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
  /** Offices baked in at build time so listings are in the static HTML (SEO); refreshed from offices.json on the client */
  initialOffices?: Office[];
  /** Every business centre, so the switcher can show one with no free spaces as a disabled "0" */
  buildings?: { slug: string; name: string }[];
}

function scopeOffices(data: Office[], buildingSlug?: string): Office[] {
  const available = data.filter((o) => o.available);
  return buildingSlug ? available.filter((o) => o.buildingSlug === buildingSlug) : available;
}

function rangeOf(list: Office[], key: 'area' | 'pricePerSqm', fallback: [number, number]): [number, number] {
  if (list.length === 0) return fallback;
  const values = list.map((o) => o[key]);
  return [Math.min(...values), Math.max(...values)];
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
  initialOffices,
  buildings = [],
}: OfficeFilterProps) {
  const isEn = locale === 'en';
  const officesDataUrl = withBase('/data/offices.json');

  const initialScoped = initialOffices ? scopeOffices(initialOffices, buildingSlug) : [];
  const [initAreaMin, initAreaMax] = rangeOf(initialScoped, 'area', [0, 1000]);
  const [initPriceMin, initPriceMax] = rangeOf(initialScoped, 'pricePerSqm', [0, 5000]);

  const [offices, setOffices] = useState<Office[]>(initialScoped);
  const [loading, setLoading] = useState(!initialOffices);

  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [areaMin, setAreaMin] = useState<number>(initAreaMin);
  const [areaMax, setAreaMax] = useState<number>(initAreaMax);
  const [priceMin, setPriceMin] = useState<number>(initPriceMin);
  const [priceMax, setPriceMax] = useState<number>(initPriceMax);
  const [selectedType, setSelectedType] = useState<string>('all');

  // For multi-office browsing: current index for arrow navigation
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(officesDataUrl)
      .then((res) => res.json())
      .then((data: Office[]) => {
        const scoped = scopeOffices(data, buildingSlug);
        setOffices(scoped);

        if (scoped.length > 0) {
          const [aMin, aMax] = rangeOf(scoped, 'area', [0, 1000]);
          const [pMin, pMax] = rangeOf(scoped, 'pricePerSqm', [0, 5000]);
          setAreaMin(aMin);
          setAreaMax(aMax);
          setPriceMin(pMin);
          setPriceMax(pMax);
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

  // ─── Switcher data: every business centre, with its number of free spaces ───
  const counts = new Map<string, number>();
  offices.forEach((o) => counts.set(o.buildingSlug, (counts.get(o.buildingSlug) ?? 0) + 1));

  const centres = (buildings.length
    ? buildings
    : [...new Map(offices.map((o) => [o.buildingSlug, { slug: o.buildingSlug, name: o.buildingName }])).values()]
  ).map((b) => ({ ...b, count: counts.get(b.slug) ?? 0 }));

  const telHref = `tel:${contactPhone.replace(/[\s()-]/g, '')}`;

  const switcher = (!buildingSlug && centres.length > 1) ? (
    <div className="office-browse__switch" role="group" aria-label={isEn ? 'Business centre' : 'Бизнес-центр'}>
      <button
        type="button"
        className={`office-browse__chip${selectedBuilding === 'all' && offices.length > 0 ? ' is-active' : ''}`}
        onClick={() => { setSelectedBuilding('all'); setCurrentIndex(0); }}
        disabled={offices.length === 0}
      >
        {isEn ? 'All' : 'Все'}<span className="office-browse__chip-count">{offices.length}</span>
      </button>
      {centres.map((b) => (
        <button
          key={b.slug}
          type="button"
          className={`office-browse__chip${selectedBuilding === b.slug ? ' is-active' : ''}`}
          onClick={() => { setSelectedBuilding(b.slug); setCurrentIndex(0); }}
          disabled={b.count === 0}
          title={b.count === 0 ? (isEn ? 'No free spaces at the moment' : 'Сейчас свободных помещений нет') : undefined}
        >
          {b.name}<span className="office-browse__chip-count">{b.count}</span>
        </button>
      ))}
    </div>
  ) : null;

  // ─── Nothing free anywhere ───
  if (offices.length === 0) {
    return (
      <div className="office-filter">
        <div className="office-browse">{switcher}</div>
        <div className="office-note">
          <h2 className="office-note__title">
            {isEn ? 'All spaces are currently let' : 'Сейчас все помещения заняты'}
          </h2>
          <p className="office-note__text">
            {isEn
              ? 'Call the leasing department — we will tell you what is coming up for renewal and add you to the waiting list.'
              : 'Позвоните в коммерческий отдел — расскажем, что освобождается в ближайшее время, и внесём вас в лист ожидания.'}
          </p>
          <div className="office-note__contacts">
            <a href={telHref} className="office-note__phone">{contactPhone}</a>
            <a href={`mailto:${contactEmail}`} className="office-note__email">{contactEmail}</a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Browse: switcher (+ list when there is more than one space) + the sheet ───
  const visible = filteredOffices;
  const current = visible[Math.min(currentIndex, visible.length - 1)] ?? visible[0];
  const showList = visible.length > 1;

  const select = (i: number) => {
    setCurrentIndex(i);
    if (typeof document !== 'undefined') {
      const el = document.getElementById('office-sheet');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="office-filter">
      <div className="office-browse">
        {switcher}

        {showList && (
          <div className="office-browse__list" role="list">
            <div className="office-browse__head" aria-hidden="true">
              <span>{isEn ? 'Space' : 'Помещение'}</span>
              <span>{isEn ? 'Area' : 'Площадь'}</span>
              <span>{isEn ? 'Floor' : 'Этаж'}</span>
              <span>{isEn ? 'Layout' : 'Планировка'}</span>
              <span>{isEn ? 'Rate' : 'Ставка'}</span>
              <span>{isEn ? 'Per month' : 'В месяц'}</span>
            </div>
            {visible.map((o, i) => (
              <button
                key={o.id}
                type="button"
                role="listitem"
                className={`office-browse__row${current && o.id === current.id ? ' is-active' : ''}`}
                onClick={() => select(i)}
                aria-current={current && o.id === current.id ? 'true' : undefined}
              >
                <span className="office-browse__cell office-browse__cell--name">
                  <span className="office-browse__office">
                    {isEn ? `Office ${o.id.split('-').pop()}` : `Офис №${o.id.split('-').pop()}`}
                  </span>
                  <span className="office-browse__building">{o.buildingName}</span>
                </span>
                <span className="office-browse__cell">
                  <span className="office-browse__mob-label">{isEn ? 'Area' : 'Площадь'}</span>
                  {String(o.area).replace('.', isEn ? '.' : ',')} {isEn ? 'm²' : 'м²'}
                </span>
                <span className="office-browse__cell">
                  <span className="office-browse__mob-label">{isEn ? 'Floor' : 'Этаж'}</span>
                  {o.floor}
                </span>
                <span className="office-browse__cell">
                  <span className="office-browse__mob-label">{isEn ? 'Layout' : 'Планировка'}</span>
                  {o.type === 'cabinet' ? (isEn ? 'Private office' : 'Кабинетная') : 'Open space'}
                </span>
                <span className="office-browse__cell">
                  <span className="office-browse__mob-label">{isEn ? 'Rate' : 'Ставка'}</span>
                  {formatNumber(o.pricePerSqm)} ₽/{isEn ? 'm²' : 'м²'}
                </span>
                <span className="office-browse__cell office-browse__cell--price">
                  <span className="office-browse__mob-label">{isEn ? 'Per month' : 'В месяц'}</span>
                  {formatNumber(o.totalPrice)} ₽
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {current && (
        <div id="office-sheet" className="office-browse__sheet">
          <OfficeDetailView
            office={current}
            isEn={isEn}
            contactPhone={contactPhone}
            contactEmail={contactEmail}
          />
        </div>
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
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const number = office.id.split('-').pop() ?? office.id;
  const buildingName = isEn
    ? (office.buildingSlug === 'anm' ? 'Business Center ANM' : 'Business Loft Fidel')
    : office.buildingName;
  const address = isEn
    ? (office.buildingSlug === 'anm' ? 'Obukhovskoy Oborony Ave. 70, bldg. 2' : 'Obukhovskoy Oborony Ave. 70')
    : office.address;
  const title = isEn ? `Office ${number}` : `Офис №${number}`;
  const typeLabel = office.type === 'cabinet'
    ? (isEn ? 'Private offices' : 'Кабинетная')
    : (isEn ? 'Open space' : 'Open space');
  const description = isEn ? office.descriptionEn : office.description;
  const features = isEn ? office.featuresEn : office.features;
  const terms = office.leaseTerms;
  const minTerm = isEn ? terms?.minTermEn : terms?.minTerm;
  const deposit = isEn ? terms?.depositEn : terms?.deposit;
  const includes = isEn ? terms?.includesEn : terms?.includes;
  const extra = isEn ? terms?.extraEn : terms?.extra;
  const area = String(office.area).replace('.', isEn ? '.' : ',');
  const sqm = isEn ? 'm²' : 'м²';

  // Photos first, floor plan last (like a presentation sheet)
  const isPlan = (p: string) => /plan/i.test(p);
  const photos = [...office.photos.filter((p) => !isPlan(p)), ...office.photos.filter(isPlan)];
  const planIndex = photos.findIndex(isPlan);
  const tiles = photos.slice(0, 6);
  const hiddenCount = photos.length - tiles.length;

  const specs: { label: string; value: string }[] = [
    { label: isEn ? 'Area, m²' : 'Площадь, м²', value: area },
    { label: isEn ? 'Rent per month' : 'Цена за месяц', value: `${formatNumber(office.totalPrice)} ₽` },
    { label: isEn ? 'Floor' : 'Этаж', value: String(office.floor) },
    { label: isEn ? 'Layout' : 'Планировка', value: typeLabel },
    { label: isEn ? 'Class' : 'Класс', value: office.class },
    ...(office.ceilingHeight ? [{ label: isEn ? 'Ceiling height' : 'Высота потолков', value: `${String(office.ceilingHeight).replace('.', isEn ? '.' : ',')} ${isEn ? 'm' : 'м'}` }] : []),
    { label: isEn ? `Rate per ${sqm}` : `Ставка за ${sqm}`, value: `${formatNumber(office.pricePerSqm)} ₽` },
    ...(minTerm ? [{ label: isEn ? 'Lease term' : 'Срок аренды', value: minTerm }] : []),
    ...(deposit ? [{ label: isEn ? 'Security deposit' : 'Обеспечительный платёж', value: deposit }] : []),
  ];

  const subject = encodeURIComponent(isEn
    ? `Viewing request: ${title}, ${buildingName}`
    : `Запрос на просмотр: ${title}, ${buildingName}`);
  const mailHref = `mailto:${contactEmail}?subject=${subject}`;
  const telHref = `tel:${contactPhone.replace(/[\s()-]/g, '')}`;

  return (
    <article className="office-detail">
      <header className="office-detail__head">
        <div>
          <p className="office-detail__eyebrow">
            <span className="office-detail__status">{isEn ? 'Available' : 'Свободно'}</span>
            <span>{buildingName}</span>
            <span aria-hidden="true">·</span>
            <span>{address}</span>
          </p>
          <h2 className="office-detail__title">{title}</h2>
        </div>
      </header>

      <div className="office-detail__layout">
        <div className="office-detail__info">
          <dl className="office-detail__specs">
            {specs.map((s) => (
              <div key={s.label} className="office-detail__spec">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          {description && <p className="office-detail__description">{description}</p>}

          {features && features.length > 0 && (
            <ul className="office-detail__features">
              {features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          )}

        </div>

        <div className="office-detail__media">
          {tiles.length > 0 ? (
            <div className={`office-detail__mosaic office-detail__mosaic--${Math.min(tiles.length, 6)}`}>
              {tiles.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  className={`office-detail__tile${isPlan(p) ? ' office-detail__tile--plan' : ''}`}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`${isEn ? 'Open photo' : 'Открыть фото'} ${i + 1}`}
                >
                  <img
                    src={withBase(p)}
                    alt={`${title}, ${buildingName} — ${isPlan(p) ? (isEn ? 'floor plan' : 'планировка') : `${isEn ? 'photo' : 'фото'} ${i + 1}`}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  {i === tiles.length - 1 && hiddenCount > 0 && (
                    <span className="office-detail__more">+{hiddenCount}</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="office-detail__placeholder">
              <span>{isEn ? 'Photos coming soon' : 'Фото скоро появятся'}</span>
            </div>
          )}
        </div>
      </div>

      {(includes?.length || extra?.length || planIndex >= 0) ? (
        <div className="office-detail__terms-band">
          {includes && includes.length > 0 && (
            <div className="office-detail__term">
              <dt>{isEn ? 'Included in the rent' : 'Включено в стоимость'}</dt>
              <dd>{includes.join(', ')}</dd>
            </div>
          )}
          {extra && extra.length > 0 && (
            <div className="office-detail__term">
              <dt>{isEn ? 'Paid separately' : 'Оплачивается отдельно'}</dt>
              <dd>{extra.join(', ')}</dd>
            </div>
          )}
          {planIndex >= 0 && (
            <div className="office-detail__term office-detail__term--doc">
              <dt>{isEn ? 'Floor plan' : 'Планировка'}</dt>
              <dd>
                <button type="button" className="office-detail__doc" onClick={() => setLightboxIndex(planIndex)}>
                  <span>{isEn ? 'Open the plan' : 'Открыть планировку'}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M4 4h16v16H4z" /><path d="M4 12h9v8M13 4v5h7" />
                  </svg>
                </button>
              </dd>
            </div>
          )}
        </div>
      ) : null}

      <footer className="office-detail__cta">
        <div className="office-detail__price">
          <span className="office-detail__price-label">{isEn ? 'Monthly rent' : 'Аренда в месяц'}</span>
          <span className="office-detail__price-value">{formatNumber(office.totalPrice)} ₽</span>
          <span className="office-detail__price-note">
            {formatNumber(office.pricePerSqm)} ₽/{sqm} · {isEn ? 'direct lease from the owner' : 'прямая аренда от собственника'}
          </span>
        </div>
        <div className="office-detail__actions">
          <a href={telHref} className="office-detail__phone">{contactPhone}</a>
          <a href={mailHref} className="btn btn--primary btn--wide">{isEn ? 'Request a viewing' : 'Оставить заявку'}</a>
        </div>
      </footer>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={Math.max(lightboxIndex, 0)}
        slides={photos.map((p) => ({ src: withBase(p) }))}
        controller={{ closeOnBackdropClick: true }}
      />
    </article>
  );
}
