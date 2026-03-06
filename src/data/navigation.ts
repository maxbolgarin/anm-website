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
  { label: 'Главная', href: '/' },
  { label: 'Бизнес-центры', href: '/buildings/' },
  { label: 'Аренда офисов', href: '/#offices' },
  { label: 'О компании', href: '/about/' },
  { label: 'Контакты', href: '/contacts/' },
];

export const buildingNav: BuildingNavItem[] = [
  { name: 'Фидель', slug: 'fidel', class: 'B+', href: '/buildings/fidel/' },
  { name: 'АНМ', slug: 'anm', class: 'B+', href: '/buildings/anm/' },
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
