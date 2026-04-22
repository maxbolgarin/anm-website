# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

MAKE COMMITS AFTER EVERYTHING IS WORKING. MAKE THIS FILE ACTUAL AFTER CHANGES.

## Project Overview

Corporate website for **УК АНМ** (Александро-Невская Мануфактура) — a real estate management company in Saint Petersburg. Two business centers at Pr. Obukhovskoy Oborony, 70.

- **Domain:** https://www.a-n-m.ru (currently deployed to GitHub Pages at `maxbolgarin.github.io/anm-website`)
- **Primary language:** Russian (ru). English locale pages not yet implemented — only i18n strings exist in `src/i18n/`.
- **Purpose:** Office rental lead generation, building presentations, company info

## Commands

```bash
pnpm dev        # Dev server at localhost:4321
pnpm build      # Production build to ./dist/
pnpm preview    # Preview production build locally
```

No linter, no test runner, no formatter configured. `pnpm build` is the only validation step.

## Tech Stack

- **Astro 5.x** — static output (`output: 'static'`), deployed to GitHub Pages via `peaceiris/actions-gh-pages`
- **React 19.x** — used only for interactive islands, not for pages
- **pnpm** — package manager (Node 24, pnpm 9 in CI)
- **TypeScript** — strict mode (`astro/tsconfigs/strict`)
- **Sharp** — image processing
- **Yandex Maps API 2.1** — loaded dynamically in `InteractiveMap.tsx`
- **`yet-another-react-lightbox`** — photo gallery lightbox

## Architecture

### Islands Pattern

Pages and layouts are Astro components (`.astro`) — zero JS shipped by default. Interactive widgets live in `src/components/islands/` as React `.tsx` files.

**Each React island has an Astro wrapper** (`*Island.astro`) that applies `client:visible` or `client:load`. To add a new island:
1. Create the React component in `src/components/islands/MyWidget.tsx`
2. Create `src/components/MyWidgetIsland.astro` that imports and renders it with a `client:*` directive
3. Use the island wrapper in pages, not the React component directly

Current islands: `InteractiveMap`, `OfficeFilter` (+ `OfficeCard`), `PhotoGallery`, `BuildingTabs`, `TerritoryMap`

### Base URL Handling

The site is configured with `base: '/anm-website'` in `astro.config.mjs`. All internal paths must go through `withBase()` from `@utils/withBase` — it prepends the base URL and correctly handles external URLs, anchors, `mailto:`, and `tel:` links. Use it in both Astro components and React islands.

### Data Flow

- Building and office data are TypeScript modules in `src/data/` with helpers: `getBuildingBySlug()`, `getOfficesByBuilding()`, `getAllAvailableOffices()`
- **Dual data source:** `OfficeFilter` fetches from `/data/offices.json` at runtime (client-side). If you change `src/data/offices.ts`, you must also update `public/data/offices.json` to stay in sync. These are currently out of sync.
- Navigation structure (including nested dropdowns) is in `src/data/navigation.ts`

### SEO

- Each page sets `<title>`, `<meta description>`, canonical URL, Open Graph tags
- Organization JSON-LD on every page (via `BaseLayout`), building pages add OfficeSpace + FAQPage schemas
- Sitemap auto-generated with ru/en hreflang alternates
- Building pages use `BuildingLayout` which extends `BaseLayout` with breadcrumbs

### Styling

- **No CSS framework** — custom CSS with CSS custom properties in `src/styles/variables.css`
- Component styles use Astro's scoped `<style>` blocks; global styles in `src/styles/` imported via `BaseLayout`
- BEM-like naming: `.block__element--modifier`
- Responsive breakpoints: 768px (mobile), 1024px (tablet), 1440px (desktop)
- Spacing based on 8px scale (`--space-xs` through `--space-5xl`)

### Path Aliases (tsconfig)

`@/*` → `src/*`, `@components/*`, `@layouts/*`, `@islands/*` → `src/components/islands/*`, `@data/*`, `@styles/*`, `@utils/*`

## Design System

### Brand Colors (from brandbook)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-burgundy` | `#78004F` | Brand burgundy (Pantone 209 C) |
| `--color-red` / `--color-primary` | `#B8003C` | Primary — buttons, links, accents |
| `--color-gold` / `--color-accent-yellow` | `#B38026` | Gold — CTA sections (Pantone 876 C) |
| `--color-primary-dark` | `#8C002E` | Hover states |
| `--color-surface-cream` | `#F5F0E8` | Alternating section backgrounds |
| `--color-surface-dark` | `#78004F` | Footer, dark sections (brand burgundy) |
| `--color-text-primary` | `#1A1A1A` | Main text |
| `--color-text-secondary` | `#6B6B6B` | Captions, labels |

### Typography

- **Headings:** Helios Cond (self-hosted `.woff` in `public/fonts/`)
- **Body:** Tahoma (self-hosted `.woff` in `public/fonts/`)
- Responsive sizing via `clamp()` — display from 2.5rem to 6rem, body 1rem–1.125rem

### Button Variants

`.btn--primary` (red bg), `.btn--outline` (red border), `.btn--dark`, `.btn--link` (text with arrow)

## Buildings Data

Two buildings on the same territory:

| Building | Slug | Class | Address |
|----------|------|-------|---------|
| Бизнес-Лофт Фидель | `fidel` | B+ | Пр. Обуховской Обороны, 70 |
| Бизнес-Центр АНМ | `anm` | B | Пр. Обуховской Обороны, 70к2 |

Both near metro **Елизаровская** (5 min walk).

## Contact Information

| Type | Value |
|------|-------|
| Phone (main) | +7 (812) 313-18-04 |
| Reception | +7 (812) 703-50-09 |
| Commercial dept | +7 (812) 336-55-64 |
| Email | arenda@ukanm.ru |
| Address | СПб, Пр. Обуховской Обороны д. 70, корпус 2, лит А |

## Development Guidelines

1. **Pages** are `.astro` files — keep static unless interactivity is needed
2. **Interactive features** go in `src/components/islands/` as React TSX with a corresponding `*Island.astro` wrapper
3. **All text** in Russian by default; i18n strings in `src/i18n/` for future locale support
4. **Styles** go in scoped `<style>` blocks; only add to `src/styles/` for truly shared utilities
5. **Data changes** — update both `src/data/offices.ts` and `public/data/offices.json`
6. **Number formatting** — use `formatNumber()`, `formatPrice()`, `formatArea()` from `@utils/formatters` (Russian convention: space as thousands separator)
7. **Internal links** — always use `withBase()` from `@utils/withBase`
8. **SEO** — every page must have title, description, and appropriate JSON-LD

## Known Issues

- Yandex Maps API key is placeholder (`YOUR_API_KEY` in InteractiveMap.tsx)
- `public/data/offices.json` is out of sync with `src/data/offices.ts` (json has `available: false`, ts has `available: true`)
- English locale pages (`/en/...`) not yet implemented
