import type { Locale } from '@utils/locale';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface BuildingNavItem {
  name: string;
  slug: string;
  class: string;
  href: string;
}

export const mainNav: NavItem[] = [
  {
    label: 'Бизнес-Центры',
    href: '/buildings/',
    children: [
      { label: 'Бизнес-Лофт Фидель', href: '/buildings/fidel/' },
      { label: 'Бизнес-Центр АНМ', href: '/buildings/anm/' },
    ],
  },
  {
    label: 'О компании',
    href: '/about/',
    children: [
      { label: 'Локация', href: '/territory/' },
      { label: 'Компания и история', href: '/about/company/' },
    ],
  },
  { label: 'Аренда', href: '/arenda/' },
  { label: 'Контакты', href: '/contacts/' },
];

export const mainNavEn: NavItem[] = [
  {
    label: 'Business Centers',
    href: '/en/buildings/',
    children: [
      { label: 'Business Loft Fidel', href: '/en/buildings/fidel/' },
      { label: 'Business Center ANM', href: '/en/buildings/anm/' },
    ],
  },
  {
    label: 'About',
    href: '/en/about/',
    children: [
      { label: 'Location', href: '/en/territory/' },
      { label: 'Company & History', href: '/en/about/company/' },
    ],
  },
  { label: 'Office Rental', href: '/en/arenda/' },
  { label: 'Contacts', href: '/en/contacts/' },
];

export function getNav(locale: Locale): NavItem[] {
  return locale === 'en' ? mainNavEn : mainNav;
}

export const buildingNav: BuildingNavItem[] = [
  { name: 'Фидель', slug: 'fidel', class: 'B+', href: '/buildings/fidel/' },
  { name: 'АНМ', slug: 'anm', class: 'B', href: '/buildings/anm/' },
];

export const buildingNavEn: BuildingNavItem[] = [
  { name: 'Fidel', slug: 'fidel', class: 'B+', href: '/en/buildings/fidel/' },
  { name: 'ANM', slug: 'anm', class: 'B', href: '/en/buildings/anm/' },
];

export const contactInfo = {
  phone: '+7 (812) 313-18-04',
  phoneHref: 'tel:+78123131804',
  reception: '+7 (812) 703-50-09',
  receptionHref: 'tel:+78127035009',
  commercial: '+7 (812) 336-55-64',
  commercialHref: 'tel:+78123365564',
  email: 'arenda@ukanm.ru',
  emailHref: 'mailto:arenda@ukanm.ru',
  address: 'Санкт-Петербург, Пр. Обуховской Обороны д. 70, корпус 2, лит А',
};
