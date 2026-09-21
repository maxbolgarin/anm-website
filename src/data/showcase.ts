/**
 * Editorial content for the home-page building showcase (RU + EN).
 * Images reference the optimised v2 set (see scripts/build-v2-images.mjs).
 */
import type { Locale } from '@utils/locale';

export interface ShowcaseImage {
  name: string;
  caption: string;
  alt: string;
}

export interface ShowcaseFeature {
  title: string;
  text: string;
}

export interface BuildingShowcase {
  slug: 'fidel' | 'anm';
  title: string;
  headline: string;
  features: ShowcaseFeature[];
  stats: { value: string; label: string }[];
  hero: ShowcaseImage;
  collage: ShowcaseImage[];
  spaceTitle: string;
  spaceText: [string, string];
  gallery: ShowcaseImage[];
}

const ru: BuildingShowcase[] = [
  {
    slug: 'fidel',
    title: 'Бизнес-лофт Фидель',
    headline: 'Мы всё предусмотрели, чтобы вы везде преуспели',
    features: [
      {
        title: 'Никаких проблем с транспортом',
        text: '9 минут пешком от метро «Елизаровская», удобный подъезд с пр. Обуховской Обороны и охраняемый паркинг на 218 мест.',
      },
      {
        title: 'Территория под надёжной защитой',
        text: 'Круглосуточная охрана, видеонаблюдение и доступ по картам. Офисы открыты для вашей команды 24/7.',
      },
      {
        title: 'Решение любых задач',
        text: 'Собственная служба эксплуатации и служба заботы: инженеры, клининг и переговорные — всё на месте.',
      },
    ],
    stats: [
      { value: '12 205', label: 'м² общая площадь' },
      { value: 'B+', label: 'класс' },
      { value: '4,2 м', label: 'высота потолков' },
      { value: '218', label: 'машиномест' },
    ],
    hero: { name: 'fidel-exterior', caption: 'фасад, 1855', alt: 'Исторический кирпичный корпус бизнес-лофта Фидель' },
    collage: [
      { name: 'fidel-lounge', caption: 'лаунж', alt: 'Лаунж-зона с зелёными диванами и кирпичной стеной в Фиделе' },
      { name: 'fidel-kitchen', caption: 'кухня', alt: 'Кухня-столовая с граффити в бизнес-лофте Фидель' },
      { name: 'fidel-openspace', caption: 'офисы', alt: 'Офис открытой планировки с кирпичными стенами' },
      { name: 'fidel-staircase', caption: 'лестница', alt: 'Лестница с кирпичной кладкой и арочным окном' },
    ],
    spaceTitle: 'Пространство, в котором хочется задержаться',
    spaceText: [
      'Исторический корпус 1855 года: кирпичные стены, потолки до 4,2 метра и высокие окна с видом на Неву.',
      'Дизайнерские лаунж-зоны, переговорные, кухни и терраса — среда, которая работает на вашу команду каждый день.',
    ],
    gallery: [
      { name: 'fidel-meeting', caption: 'переговорная', alt: 'Жёлтая переговорная со стеклянными перегородками' },
      { name: 'fidel-slide', caption: 'атриум', alt: 'Горка между этажами в офисе IT-компании' },
      { name: 'fidel-team', caption: 'офисы', alt: 'Команда за работой в светлом офисе' },
      { name: 'fidel-orange', caption: 'переговорная', alt: 'Переговорная с оранжевым полом и потолком' },
      { name: 'fidel-window', caption: 'вид на Неву', alt: 'Рабочее место у панорамного окна с видом на Неву' },
      { name: 'fidel-openspace-2', caption: 'зона отдыха', alt: 'Амфитеатр для встреч и отдыха' },
      { name: 'fidel-meeting-2', caption: 'переговорная', alt: 'Переговорная с видом на город' },
      { name: 'fidel-kitchen-2', caption: 'кухня', alt: 'Светлая кухня с граффити' },
      { name: 'fidel-terrace', caption: 'терраса', alt: 'Терраса с видом на Неву' },
      { name: 'fidel-team-2', caption: 'офисы', alt: 'Опенспейс IT-компании' },
      { name: 'fidel-lobby', caption: 'холл', alt: 'Входная группа бизнес-лофта' },
    ],
  },
  {
    slug: 'anm',
    title: 'Бизнес-центр АНМ',
    headline: 'Мы управляем условиями, вы управляете бизнесом',
    features: [
      {
        title: 'Развитая инфраструктура',
        text: 'Кафе, столовая, ресепшн и банкомат в здании, благоустроенный двор и набережная Невы в шаге от офиса.',
      },
      {
        title: 'Полное инженерное оснащение',
        text: 'Электроснабжение II категории, собственная газовая котельная, 2 лифта и 6 операторов связи на выбор.',
      },
      {
        title: 'Профессиональная управляющая компания',
        text: 'Более 20 лет опыта: эксплуатация, клининг и охрана — одна команда и одна точка контакта.',
      },
    ],
    stats: [
      { value: '9 170', label: 'м² общая площадь' },
      { value: 'B', label: 'класс' },
      { value: '6', label: 'этажей' },
      { value: '110', label: 'машиномест' },
    ],
    hero: { name: 'anm-panorama', caption: 'фасад', alt: 'Фасад бизнес-центра АНМ на пр. Обуховской Обороны' },
    collage: [
      { name: 'anm-reception', caption: 'ресепшн', alt: 'Ресепшн и турникеты бизнес-центра АНМ' },
      { name: 'anm-arch', caption: 'коридоры', alt: 'Светлый коридор с арочным проёмом' },
      { name: 'anm-office', caption: 'офисы', alt: 'Светлый кабинет с панорамными окнами в бизнес-центре АНМ' },
      { name: 'anm-cafe', caption: 'кафе', alt: 'Кафе в холле бизнес-центра АНМ' },
    ],
    spaceTitle: 'Место, где можно создавать и созидать',
    spaceText: [
      'Готовые офисы со свежей отделкой и гибкими планировками — для команды из пяти человек или целого департамента.',
      'Светлые коридоры, просторные лифтовые холлы и переговорные: всё, чтобы работа шла без лишних забот.',
    ],
    gallery: [
      { name: 'anm-conference', caption: 'переговорная', alt: 'Конференц-зал с круглым столом' },
      { name: 'anm-coworking', caption: 'офис', alt: 'Офис открытой планировки в бизнес-центре АНМ' },
      { name: 'anm-lobby', caption: 'холл', alt: 'Вестибюль бизнес-центра АНМ' },
      { name: 'anm-corridor', caption: 'коридоры', alt: 'Коридор офисного этажа' },
      { name: 'anm-lift', caption: 'лифтовой холл', alt: 'Лифтовой холл с кирпичной стеной' },
      { name: 'anm-dining', caption: 'столовая', alt: 'Столовая для арендаторов' },
      { name: 'anm-courtyard', caption: 'двор', alt: 'Благоустроенный двор с елями' },
      { name: 'anm-exterior', caption: 'фасад', alt: 'Фасад бизнес-центра АНМ осенью' },
    ],
  },
];

const en: BuildingShowcase[] = [
  {
    ...ru[0],
    title: 'Business Loft Fidel',
    headline: 'We have thought of everything, so you can succeed at anything',
    features: [
      {
        title: 'No commuting headaches',
        text: 'A 9-minute walk from Elizarovskaya metro, easy access from Obukhovskoy Oborony Ave. and secure parking for 218 cars.',
      },
      {
        title: 'A fully secured territory',
        text: '24/7 security, CCTV and card access control. Your team can use the offices around the clock.',
      },
      {
        title: 'Every task handled',
        text: 'In-house facility management and tenant care: engineers, cleaning and meeting rooms — all on site.',
      },
    ],
    stats: [
      { value: '12,205', label: 'm² total area' },
      { value: 'B+', label: 'class' },
      { value: '4.2 m', label: 'ceiling height' },
      { value: '218', label: 'parking spaces' },
    ],
    hero: { ...ru[0].hero, caption: 'facade, 1855', alt: 'Historic red-brick building of Business Loft Fidel' },
    collage: [
      { ...ru[0].collage[0], caption: 'lounge', alt: 'Lounge with green sofas and a brick wall at Fidel' },
      { ...ru[0].collage[1], caption: 'kitchen', alt: 'Kitchen and dining area with graffiti at Fidel' },
      { ...ru[0].collage[2], caption: 'offices', alt: 'Open-plan office with brick walls' },
      { ...ru[0].collage[3], caption: 'staircase', alt: 'Staircase with brickwork and an arched window' },
    ],
    spaceTitle: 'A place you will want to stay in',
    spaceText: [
      'A historic 1855 building: exposed brick, ceilings up to 4.2 metres and tall windows facing the Neva.',
      'Designer lounges, meeting rooms, kitchens and a terrace — an environment that works for your team every day.',
    ],
    gallery: ru[0].gallery.map((g, i) => ({
      ...g,
      caption: ['meeting room', 'atrium', 'offices', 'meeting room', 'Neva view', 'lounge', 'meeting room', 'kitchen', 'terrace', 'offices', 'lobby'][i],
      alt: [
        'Yellow meeting room with glass partitions',
        'Slide between floors in an IT company office',
        'Team at work in a bright office',
        'Meeting room with an orange floor and ceiling',
        'Workspace by a panoramic window facing the Neva',
        'Amphitheatre for meetings and rest',
        'Meeting room with a city view',
        'Bright kitchen with graffiti',
        'Terrace overlooking the Neva',
        'Open space of an IT company',
        'Entrance lobby of the business loft',
      ][i],
    })),
  },
  {
    ...ru[1],
    title: 'Business Center ANM',
    headline: 'We manage the conditions, you manage the business',
    features: [
      {
        title: 'Developed infrastructure',
        text: 'A café, canteen, reception and ATM in the building, a landscaped courtyard and the Neva embankment steps away.',
      },
      {
        title: 'Full engineering package',
        text: 'Category II power supply, our own gas boiler plant, 2 elevators and a choice of 6 telecom providers.',
      },
      {
        title: 'Professional management company',
        text: '20+ years of experience: maintenance, cleaning and security — one team and a single point of contact.',
      },
    ],
    stats: [
      { value: '9,170', label: 'm² total area' },
      { value: 'B', label: 'class' },
      { value: '6', label: 'floors' },
      { value: '110', label: 'parking spaces' },
    ],
    hero: { ...ru[1].hero, caption: 'facade', alt: 'Facade of Business Center ANM on Obukhovskoy Oborony Ave.' },
    collage: [
      { ...ru[1].collage[0], caption: 'reception', alt: 'Reception and turnstiles at Business Center ANM' },
      { ...ru[1].collage[1], caption: 'corridors', alt: 'Bright corridor with an arched opening' },
      { ...ru[1].collage[2], caption: 'offices', alt: 'Bright private office with large windows at Business Center ANM' },
      { ...ru[1].collage[3], caption: 'café', alt: 'Café in the lobby of Business Center ANM' },
    ],
    spaceTitle: 'A place to create and build',
    spaceText: [
      'Ready-to-move-in offices with fresh finishes and flexible layouts — for a team of five or an entire department.',
      'Bright corridors, spacious elevator halls and meeting rooms: everything you need to keep work flowing.',
    ],
    gallery: ru[1].gallery.map((g, i) => ({
      ...g,
      caption: ['meeting room', 'office', 'lobby', 'corridors', 'elevator hall', 'canteen', 'courtyard', 'facade'][i],
      alt: [
        'Conference room with a round table',
        'Open-plan office at Business Center ANM',
        'Lobby of Business Center ANM',
        'Office floor corridor',
        'Elevator hall with a brick wall',
        'Canteen for tenants',
        'Landscaped courtyard with fir trees',
        'Facade of Business Center ANM in autumn',
      ][i],
    })),
  },
];

export function getShowcase(locale: Locale): BuildingShowcase[] {
  return locale === 'en' ? en : ru;
}
