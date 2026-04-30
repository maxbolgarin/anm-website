/**
 * English translations for building data.
 * Used by English pages to override Russian strings from buildings.ts.
 */

export interface BuildingTranslation {
  name: string;
  fullName: string;
  address: string;
  shortAddress: string;
  metro: { name: string; line: string };
  stats: { value: string | number; label: string }[];
  description: string;
  features: { title: string; description: string; imageAlt: string }[];
  parameters: { label: string; value: string }[];
  infrastructure: { name: string; description: string; imageAlt: string }[];
  faq: { question: string; answer: string }[];
}

export const buildingsEn: Record<string, BuildingTranslation> = {
  fidel: {
    name: 'Fidel',
    fullName: 'Business Loft Fidel',
    address: 'Saint Petersburg, Obukhovskoy Oborony Ave. 70',
    shortAddress: 'Obukhovskoy Oborony Ave. 70',
    metro: { name: 'Elizarovskaya', line: 'Nevsko-Vasileostrovskaya' },
    stats: [
      { value: 5, label: 'Floors' },
      { value: '12,205.5', label: 'Total area, m²' },
      { value: 218, label: 'Parking spots' },
      { value: 'B+', label: 'Class' },
    ],
    description: 'Class B+ business loft on the territory of Aleksandro-Nevskaya Manufaktura. Designer loft-style finishes, modern engineering systems, developed infrastructure, and a promenade on the Neva River embankment.',
    features: [
      {
        title: 'Architecture & Design',
        description: 'Business loft with designer finishes: linoleum, painted walls (brick and drywall), pendant lighting, double-glazed windows. The unique character of the industrial building is preserved and enhanced with modern solutions.',
        imageAlt: 'Loft office with brick walls and Neva River view at Business Center Fidel',
      },
      {
        title: 'Engineering Systems',
        description: 'Category II power supply reliability, centralized Ciat air conditioning, supply and exhaust ventilation, own gas boiler room, fire alarm system, 4 elevators, 6 telecom operators.',
        imageAlt: 'Facade of Business Center Fidel with modern addition',
      },
      {
        title: 'Service & Management',
        description: 'Professional management company with 20 years of experience. 24/7 access, maintenance service, cleaning, territory security.',
        imageAlt: 'Reception of Business Center Fidel with designer interior',
      },
    ],
    parameters: [
      { label: 'Class', value: 'B+' },
      { label: 'Floors', value: '5' },
      { label: 'Total area', value: '12,205.5 m²' },
      { label: 'Typical floor area', value: '2,200 m²' },
      { label: 'Year of renovation', value: '2008' },
      { label: 'Power supply', value: 'Category II reliability' },
      { label: 'Air conditioning', value: 'Central (Ciat)' },
      { label: 'Ventilation', value: 'Supply and exhaust' },
      { label: 'Heating', value: 'Autonomous, gas boiler' },
      { label: 'Ceiling height', value: '3–4.2 m' },
      { label: 'Floor load capacity', value: '200 kg/m²' },
      { label: 'Elevators', value: '4 OTIS elevators, up to 1,000 kg' },
      { label: 'Fire alarm', value: 'Smart home system' },
      { label: 'Telecom operators', value: '6 operators' },
      { label: 'Parking', value: 'Guarded, illuminated, 218 spots' },
    ],
    infrastructure: [
      {
        name: 'Café & Canteen',
        description: 'Cozy café with a wide menu on the business center premises. Hot meals, business lunches, pastries, and beverages.',
        imageAlt: 'Café on the territory of Business Center Fidel',
      },
      {
        name: 'Neva Embankment',
        description: 'Promenade on the Neva River embankment — a unique feature of the territory for employee recreation.',
        imageAlt: 'Neva River view from the business center territory',
      },
      {
        name: 'Recreation Area',
        description: 'Landscaped recreation area on the territory for comfortable employee relaxation.',
        imageAlt: 'Recreation area on the territory of Business Center Fidel',
      },
    ],
    faq: [
      {
        question: 'What are the rental terms?',
        answer: 'Rental terms are discussed individually. Contact the commercial department at +7 (812) 336-55-64 for a current offer.',
      },
      {
        question: 'What is the minimum lease term?',
        answer: 'The minimum lease term is 11 months. Special conditions may apply for long-term leases.',
      },
      {
        question: 'Are utilities included in the rental price?',
        answer: 'The base rental rate includes operational costs. Utilities (electricity, water) are billed separately by meter.',
      },
      {
        question: 'Is office reconfiguration possible?',
        answer: 'Reconfiguration options are discussed individually with the management company. We are ready to adapt the space to your needs.',
      },
      {
        question: 'How does parking work?',
        answer: 'Guarded illuminated parking with 218 spots. Parking spaces can be rented additionally.',
      },
    ],
  },
  anm: {
    name: 'ANM',
    fullName: 'Business Center ANM',
    address: 'Saint Petersburg, Obukhovskoy Oborony Ave. 70, Bldg. 2',
    shortAddress: 'Obukhovskoy Oborony Ave. 70/2',
    metro: { name: 'Elizarovskaya', line: 'Nevsko-Vasileostrovskaya' },
    stats: [
      { value: 6, label: 'Floors' },
      { value: '9,170.7', label: 'Total area, m²' },
      { value: 110, label: 'Parking spots' },
      { value: 'B', label: 'Class' },
    ],
    description: 'Business center on the territory of Aleksandro-Nevskaya Manufaktura. Modern office spaces with quality finishes, convenient transport accessibility, and full business infrastructure.',
    features: [
      {
        title: 'Location',
        description: 'The business center is located on the territory of the historic Aleksandro-Nevskaya Manufaktura, on the Neva River embankment, just a 9-minute walk from Elizarovskaya metro station.',
        imageAlt: 'Facade of Business Center ANM',
      },
      {
        title: 'Modern Offices',
        description: 'Ready-made finishes, double-glazed windows, modern engineering systems, flexible layouts for companies of any size.',
        imageAlt: 'Modern conference room at Business Center ANM',
      },
      {
        title: 'Engineering Systems',
        description: 'Category II power supply reliability, own gas boiler room, fire alarm system, security system, 2 elevators, 6 telecom operators.',
        imageAlt: 'Engineering systems at Aleksandro-Nevskaya Manufaktura territory',
      },
    ],
    parameters: [
      { label: 'Class', value: 'B' },
      { label: 'Floors', value: '6' },
      { label: 'Total area', value: '9,170.7 m²' },
      { label: 'Power supply', value: 'Category II reliability' },
      { label: 'Elevators', value: '2 elevators' },
      { label: 'Security system', value: 'Surveillance cameras' },
      { label: 'Parking', value: 'Guarded, 110 spots' },
    ],
    infrastructure: [
      {
        name: 'Café & Canteen',
        description: 'Cozy dining spots with a wide menu on the business center premises. Hot meals, business lunches, pastries, and beverages.',
        imageAlt: 'Café on the territory of BC ANM',
      },
      {
        name: 'Reception & ATM',
        description: 'Professional reception service and spacious lobby with an ATM for tenants and visitors.',
        imageAlt: 'Reception and lobby of Business Center ANM',
      },
      {
        name: 'Recreation Area',
        description: 'Landscaped recreation area on the territory for comfortable employee relaxation.',
        imageAlt: 'Recreation area on the territory of Business Center ANM',
      },
    ],
    faq: [
      {
        question: 'How to contact the commercial department?',
        answer: 'Call +7 (812) 336-55-64 or email arenda@ukanm.ru.',
      },
    ],
  },
};

export function getBuildingEnBySlug(slug: string): BuildingTranslation | undefined {
  return buildingsEn[slug];
}
