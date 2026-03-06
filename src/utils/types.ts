export interface BuildingStat {
  value: string | number;
  label: string;
  unit?: string;
}

export interface BuildingParameter {
  label: string;
  value: string;
}

export interface BuildingFeature {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface InfrastructureItem {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface MetroStation {
  name: string;
  line: string;
  lineColor: string;
  walkingMinutes: number;
}

export interface Building {
  name: string;
  slug: string;
  class: string;
  address: string;
  shortAddress: string;
  metro: MetroStation[];
  stats: BuildingStat[];
  description: string;
  heroImage: string;
  galleryImages: string[];
  features: BuildingFeature[];
  parameters: BuildingParameter[];
  infrastructure: InfrastructureItem[];
  faq: FAQItem[];
  presentationUrl?: string;
  coordinates: { lat: number; lng: number };
  order: number;
}

export interface Office {
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

export interface CompanyStats {
  yearsOnMarket: string;
  totalArea: string;
  tenantCount: string;
}
