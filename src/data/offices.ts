import type { Office } from '@utils/types';

/**
 * Office listings data.
 * In production, this could be loaded from a JSON file or CMS.
 * For now, it is hardcoded with sample data.
 * Set `available: false` to hide an office from listings.
 */
export const offices: Office[] = [
  {
    id: 'fidel-301',
    buildingSlug: 'fidel',
    buildingName: 'Фидель',
    area: 45,
    floor: 3,
    class: 'B+',
    type: 'cabinet',
    address: 'Пр. Обуховской Обороны, 70',
    pricePerSqm: 1200,
    totalPrice: 54000,
    photos: ['/images/buildings/fidel/office-brick-loft.jpg', '/images/buildings/fidel/office-flexible.jpg'],
    available: true,
  },
  {
    id: 'fidel-302',
    buildingSlug: 'fidel',
    buildingName: 'Фидель',
    area: 120,
    floor: 3,
    class: 'B+',
    type: 'open-space',
    address: 'Пр. Обуховской Обороны, 70',
    pricePerSqm: 1100,
    totalPrice: 132000,
    photos: ['/images/buildings/fidel/openspace-loft.jpg', '/images/buildings/fidel/openspace-mezzanine.jpg'],
    available: true,
  },
  {
    id: 'fidel-401',
    buildingSlug: 'fidel',
    buildingName: 'Фидель',
    area: 78,
    floor: 4,
    class: 'B+',
    type: 'cabinet',
    address: 'Пр. Обуховской Обороны, 70',
    pricePerSqm: 1250,
    totalPrice: 97500,
    photos: ['/images/buildings/fidel/meeting-mountain.jpg', '/images/buildings/fidel/office-layout.jpg'],
    available: true,
  },
  {
    id: 'fidel-501',
    buildingSlug: 'fidel',
    buildingName: 'Фидель',
    area: 200,
    floor: 5,
    class: 'B+',
    type: 'open-space',
    address: 'Пр. Обуховской Обороны, 70',
    pricePerSqm: 1050,
    totalPrice: 210000,
    photos: ['/images/buildings/fidel/openspace-modern.jpg', '/images/buildings/fidel/interior-topfloor.jpg'],
    available: true,
  },
  {
    id: 'anm-201',
    buildingSlug: 'anm',
    buildingName: 'БЦ АНМ',
    area: 55,
    floor: 2,
    class: 'B',
    type: 'cabinet',
    address: 'Пр. Обуховской Обороны, 70к2',
    pricePerSqm: 1100,
    totalPrice: 60500,
    photos: ['/images/buildings/anm/corridor-green.jpg', '/images/buildings/anm/lobby-glass.jpg'],
    available: true,
  },
  {
    id: 'anm-301',
    buildingSlug: 'anm',
    buildingName: 'БЦ АНМ',
    area: 95,
    floor: 3,
    class: 'B',
    type: 'open-space',
    address: 'Пр. Обуховской Обороны, 70к2',
    pricePerSqm: 1000,
    totalPrice: 95000,
    photos: ['/images/buildings/anm/staircase-panoramic.jpg', '/images/buildings/anm/corridor-offices.jpg'],
    available: true,
  },
];

export function getOfficesByBuilding(slug: string): Office[] {
  return offices.filter((o) => o.buildingSlug === slug && o.available);
}

export function getAllAvailableOffices(): Office[] {
  return offices.filter((o) => o.available);
}
