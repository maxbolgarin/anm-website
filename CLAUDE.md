# CLAUDE.md — ANM Website Project Guide

## Project Overview

Corporate website for **УК АНМ** (Александро-Невская Мануфактура) — a real estate management company in Saint Petersburg that manages two B+ class business centers on the territory of a former industrial manufactory at Pr. Obukhovskoy Oborony, 70.

- **Domain:** https://www.a-n-m.ru
- **Primary language:** Russian (ru), secondary: English (en)
- **Purpose:** Office rental lead generation, building presentations, company info

## Tech Stack

- **Framework:** Astro 5.x (static output, `output: 'static'`)
- **Integrations:** `@astrojs/react` (interactive islands), `@astrojs/sitemap` (with ru/en i18n)
- **React:** 19.x (used only for interactive islands, not for pages)
- **Image processing:** Sharp
- **Lightbox:** `yet-another-react-lightbox`
- **Maps:** Yandex Maps API 2.1 (loaded dynamically in InteractiveMap.tsx)
- **Package manager:** pnpm
- **TypeScript:** Strict mode (`astro/tsconfigs/strict`)

## Commands

```bash
pnpm dev        # Dev server at localhost:4321
pnpm build      # Production build to ./dist/
pnpm preview    # Preview production build locally
```

## Project Structure

```
src/
├── components/           # Astro components (static)
│   ├── Header.astro      # Sticky header with nav, phone, language toggle, burger menu
│   ├── SubNav.astro      # Sub-navigation bar
│   ├── Footer.astro      # 4-column footer with nav, buildings, contacts
│   ├── HeroSection.astro # Full-width hero with CTA
│   ├── BuildingCard.astro    # Building overview card (reversible layout)
│   ├── FeatureBlock.astro    # Image + text feature block (reversible)
│   ├── SectionHeading.astro  # Section title + subtitle
│   ├── StatsRow.astro        # Row of stats (value + label)
│   ├── ParameterGrid.astro   # Key-value parameter grid
│   ├── FacilityCard.astro    # Infrastructure item card
│   ├── ContactCTA.astro      # Yellow CTA section with phone/email
│   ├── Breadcrumbs.astro     # Breadcrumb navigation
│   ├── InteractiveMapIsland.astro    # Astro wrapper for React map
│   ├── OfficeFilterIsland.astro      # Astro wrapper for React filter
│   └── PhotoGalleryIsland.astro      # Astro wrapper for React gallery
│   └── islands/          # React interactive components (client-side hydrated)
│       ├── InteractiveMap.tsx   # Yandex Maps with markers and balloons
│       ├── OfficeFilter.tsx     # Office listing filter (building, floor, area, price, type)
│       ├── OfficeFilter.css     # Styles for OfficeFilter
│       ├── OfficeCard.tsx       # Individual office card in listings
│       ├── PhotoGallery.tsx     # Image grid with lightbox
│       └── PhotoGallery.css     # Styles for PhotoGallery
├── data/                 # Static data (TypeScript modules)
│   ├── buildings.ts      # Building definitions (Fidel, ANM) with full details
│   ├── offices.ts        # Office listings with availability, pricing
│   └── navigation.ts     # Main nav, building nav, contact info
├── i18n/                 # Translation strings
│   ├── ru.json           # Russian strings
│   └── en.json           # English strings
├── layouts/
│   ├── BaseLayout.astro      # Root layout: <html>, <head>, SEO, JSON-LD, Header, Footer
│   └── BuildingLayout.astro  # Extends BaseLayout with breadcrumbs for building pages
├── pages/
│   ├── index.astro           # Homepage (hero, buildings, advantages, map, offices, about, CTA)
│   ├── about.astro           # About the company
│   ├── contacts.astro        # Contacts page
│   ├── legal.astro           # Legal/disclosure page
│   └── buildings/
│       ├── index.astro       # All buildings listing
│       ├── fidel/
│       │   ├── index.astro       # Fidel building overview
│       │   ├── offices.astro     # Fidel office listings
│       │   ├── infrastructure.astro  # Fidel infrastructure
│       │   └── how-to-get.astro      # Fidel directions
│       └── anm/
│           ├── index.astro       # АБК building overview
│           ├── offices.astro     # АБК office listings
│           ├── infrastructure.astro  # ANM infrastructure
│           └── how-to-get.astro      # ANM directions
├── styles/
│   ├── variables.css     # CSS custom properties (colors, typography, spacing, etc.)
│   ├── global.css        # Reset, utility classes (.container, .section, .btn, .grid, .badge)
│   └── typography.css    # Font faces (Inter, Manrope), type scale
└── utils/
    ├── types.ts          # TypeScript interfaces (Building, Office, etc.)
    └── formatters.ts     # Number/price/area formatting (Russian convention: space as thousands separator)
public/
├── data/offices.json     # Runtime office data (fetched by OfficeFilter at runtime)
├── fonts/                # Self-hosted Inter (variable) and Manrope (Cyrillic + Latin)
├── images/
│   ├── buildings/{slug}/ # Building-specific photos (hero, exterior, interior)
│   ├── infrastructure/   # Shared infrastructure photos
│   └── common/           # Logo, logo-white, scheme SVG
├── favicon.ico, favicon.svg
└── robots.txt
docs/
├── ANM_Website_Development_Specification.md  # Full design/dev spec
└── ANM_AI_Agent_Implementation_Guide.md      # AI assistant integration guide
```

## Path Aliases (tsconfig)

```
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@islands/*    → src/components/islands/*
@data/*       → src/data/*
@styles/*     → src/styles/*
@utils/*      → src/utils/*
```

## Architecture Patterns

### Islands Architecture
- **Pages and layouts** are Astro components (`.astro`) — zero JS shipped by default
- **Interactive widgets** are React components in `src/components/islands/` — hydrated client-side
- Each React island has an Astro wrapper component (`*Island.astro`) that handles the `client:*` directive
- OfficeFilter fetches data from `/data/offices.json` at runtime (not at build time)

### Styling Approach
- **No CSS framework** (no Tailwind) — custom CSS with CSS custom properties
- Component styles use Astro's scoped `<style>` blocks
- Global styles in `src/styles/` imported via `BaseLayout.astro`
- BEM-like naming: `.block__element--modifier` (e.g., `.header__nav-link--active`)
- Design tokens in `variables.css`: colors, spacing (8px base), typography scale (clamp-based responsive)
- Responsive breakpoints: 767px (mobile), 1023px (tablet), 1440px (desktop)

### Data Flow
- Building and office data are TypeScript modules in `src/data/`
- Helper functions: `getBuildingBySlug()`, `getOfficesByBuilding()`, `getAllAvailableOffices()`
- Office data is also available as JSON at `/public/data/offices.json` for client-side fetching
- If you change `src/data/offices.ts`, also update `public/data/offices.json` to stay in sync

### SEO
- Each page sets `<title>`, `<meta description>`, canonical URL, Open Graph tags
- Organization JSON-LD on every page (in BaseLayout)
- Building pages add OfficeSpace + FAQPage JSON-LD schemas
- Sitemap auto-generated with ru/en hreflang alternates
- Breadcrumbs via BuildingLayout

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#B71C1C` | Red — buttons, links, accents |
| `--color-primary-dark` | `#7F0000` | Hover states |
| `--color-primary-light` | `#E53935` | Light accent |
| `--color-surface-cream` | `#F5F0E8` | Alternating section backgrounds |
| `--color-surface-dark` | `#1A1A2E` | Footer, dark sections |
| `--color-accent-yellow` | `#F5D45E` | CTA sections, empty states |
| `--color-text-primary` | `#1A1A1A` | Main text |
| `--color-text-secondary` | `#6B6B6B` | Captions, labels |

### Typography
- **Headings:** Helios Cond (self-hosted — place `HeliosCond.woff2`, `HeliosCond.woff`, `HeliosCondBold.woff2`, `HeliosCondBold.woff` in `public/fonts/`)
- **Body:** Tahoma (system font — no font files needed)
- Responsive sizing via `clamp()` — display from 2.5rem to 6rem, body 1rem–1.125rem

### Layout
- Max width: 1280px (`.container`), 1440px (`.container-wide`)
- Grid utilities: `.grid--2`, `.grid--3`, `.grid--4` (collapse responsively)
- Section padding: `var(--space-4xl)` / `var(--space-3xl)` on mobile

### Button Variants
- `.btn--primary` — red background, white text
- `.btn--outline` — red border, transparent background
- `.btn--dark` — dark background
- `.btn--link` — text-only with arrow (→)

## Buildings Data

Two buildings on the same territory:

| Building | Slug | Class | Area | Floors | Address |
|----------|------|-------|------|--------|---------|
| Фидель | `fidel` | B+ | 14,000 m² | 5 | Пр. Обуховской Обороны, 70 |
| АБК | `anm` | B+ | 8,000 m² | 4 | Пр. Обуховской Обороны, 70к2 |

Both near metro **Елизаровская** (5 min walk, green line #009A49).

## Office Data Model

```typescript
interface Office {
  id: string;              // e.g., 'fidel-301'
  buildingSlug: string;    // 'fidel' | 'anm'
  buildingName: string;
  area: number;            // m²
  floor: number;
  class: string;           // 'B+'
  type: 'cabinet' | 'open-space';
  address: string;
  pricePerSqm: number;    // ₽/m² per month
  totalPrice: number;      // ₽/month
  photos: string[];
  available: boolean;      // false = hidden from listings
}
```

## Contact Information

| Type | Value |
|------|-------|
| Phone (main) | +7 (812) 313-18-04 |
| Reception | +7 (812) 703-50-09 |
| Commercial dept | +7 (812) 336-55-64 |
| Email | mail@ukanm.ru |
| Address | СПб, Пр. Обуховской Обороны д. 70, корпус 2, лит А |

## Known Issues / TODOs

- Yandex Maps API key is placeholder (`YOUR_API_KEY` in InteractiveMap.tsx) — needs real key
- English locale pages (`/en/...`) are not yet implemented — only i18n strings exist
- `public/data/offices.json` must be kept in sync with `src/data/offices.ts` manually
- React islands on homepage (`#homepage-map`, `#office-filter-root`) need Astro island wrappers or client-side mount scripts to actually render
- No automated tests currently
- No CI/CD pipeline configured
- Photo gallery island wrapper may need `client:visible` or `client:load` directive

## Development Guidelines

1. **Pages** should be `.astro` files — keep them static unless interactivity is needed
2. **Interactive features** go in `src/components/islands/` as React TSX with a corresponding `.astro` wrapper
3. **All text** should be in Russian by default; i18n strings in `src/i18n/` for future locale support
4. **Styles** go in scoped `<style>` blocks within `.astro` components; only add to global CSS for truly shared utilities
5. **Images** go in `public/images/` organized by building or category; use descriptive alt text
6. **Data changes** — update both `.ts` source and `public/data/offices.json` when modifying office listings
7. **Formatting** — use `formatNumber()`, `formatPrice()`, `formatArea()` from `@utils/formatters` for Russian number formatting
8. **SEO** — every page must have title, description, and appropriate JSON-LD
