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
      { label: 'Бизнес-лофт Фидель', href: '/buildings/fidel/' },
      { label: 'АБК Мануфактура', href: '/buildings/anm/' },
    ],
  },
  {
    label: 'О компании',
    href: '/about/',
    children: [
      { label: 'Территория и инфраструктура', href: '/about/#territory' },
      { label: 'Компания и история', href: '/about/#company' },
    ],
  },
  { label: 'Контакты', href: '/contacts/' },
];

export const buildingNav: BuildingNavItem[] = [
  { name: 'Фидель', slug: 'fidel', class: 'B+', href: '/buildings/fidel/' },
  { name: 'АБК', slug: 'anm', class: 'C', href: '/buildings/anm/' },
];

export const contactInfo = {
  phone: '+7 (812) 313-18-04',
  phoneHref: 'tel:+78123131804',
  reception: '+7 (812) 703-50-09',
  receptionHref: 'tel:+78127035009',
  commercial: '+7 (812) 336-55-64',
  commercialHref: 'tel:+78123365564',
  email: 'mail@ukanm.ru',
  emailHref: 'mailto:mail@ukanm.ru',
  address: 'Санкт-Петербург, Пр. Обуховской Обороны д. 70, корпус 2, лит А',
};
