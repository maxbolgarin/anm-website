# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

MAKE COMMITS AFTER EVERYTHING IS WORKING. MAKE THIS FILE ACTUAL AFTER CHANGES.

## Project Overview

Corporate website for **УК АНМ** (Александро-Невская Мануфактура) — a real estate management company in Saint Petersburg. Two business centers at Pr. Obukhovskoy Oborony, 70.

- **Domain:** https://www.a-n-m.ru (currently deployed to GitHub Pages at `maxbolgarin.github.io/anm-website`)
- **Languages:** Russian (default) and English (`/en/...`). RU and EN pages share one view component each (see *Views* below).
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

Current islands: `InteractiveMap`, `OfficeFilter` (+ `OfficeCard`), `TerritoryMap`. (`PhotoGallery`, `BuildingTabs`, `BuildingCard`, `StatsGrid` are no longer used by any page — kept for reference.)

### Views (v2 redesign)

Every page in `src/pages/` (RU) and `src/pages/en/` (EN) is a thin wrapper around a shared view in `src/components/views/` that takes `locale` and holds both languages' copy:
`HomeView`, `ArendaView`, `BuildingsView`, `BuildingView` (slug × locale), `TerritoryView`, `AboutView`, `CompanyView`, `ContactsView`.
Home sections live in `src/components/home/` (`HomeHero`, `BuildingShowcase`, `AmenitiesIndex`, `CompanyTeaser`); reusable sections in `src/components/sections/` (`ManagementServices`, `TrustSection`). Inner pages start with `PageHeader.astro`.
Building sub-pages (`offices`, `infrastructure`, `how-to-get`) and `legal` are still per-locale files.

### Images

- `scripts/build-v2-images.mjs` builds optimised copies into `public/images/v2/` (`name.jpg` ≤2000px + `name-sm.jpg` ≤1000px) and writes `src/data/media-v2.json`.
- Use `<Img name="fidel-lounge" … />` for curated images or `<Img src="/original/path.jpg" … />` — the latter uses the optimised copy when the path is listed in the script, otherwise the original file.
- After adding/replacing photos: add them to `SOURCES`/`PATHS` in the script and run `node scripts/build-v2-images.mjs` (add `--force` to rebuild existing ones).
- Home showcase copy and photo selection: `src/data/showcase.ts`.

### Hero video

`public/territory/anm-top-scrub.mp4` (1920px, 24 fps, keyframe every 12 frames — required for smooth scroll-scrubbing), `anm-top-mobile.mp4` (1280px loop) and `anm-top-poster.jpg`, all made from the 8K master `ANM_Top.mp4` (git-ignored — too big for GitHub). Desktop pins the hero for 260vh and maps scroll to `currentTime`; mobile / reduced-motion / Save-Data get a loop or the poster.

### Base URL Handling

The site is configured with `base: '/anm-website'` in `astro.config.mjs`. All internal paths must go through `withBase()` from `@utils/withBase` — it prepends the base URL and correctly handles external URLs, anchors, `mailto:`, and `tel:` links. Use it in both Astro components and React islands.

### Data Flow

- Building and office data are TypeScript modules in `src/data/` with helpers: `getBuildingBySlug()`, `getOfficesByBuilding()`, `getAllAvailableOffices()`
- **Dual data source:** `OfficeFilter` fetches from `/data/offices.json` at runtime (client-side). If you change `src/data/offices.ts`, you must also update `public/data/offices.json` to stay in sync. These are currently out of sync.
- Navigation structure (including nested dropdowns) is in `src/data/navigation.ts`

### SEO

- Each page sets `<title>`, `<meta description>`, canonical URL, Open Graph tags
- Organization JSON-LD on every page (via `BaseLayout`, `jsonLd` accepts an object or array); `Breadcrumbs` emits BreadcrumbList; building pages add OfficeSpace + FAQPage; home adds an ItemList of the buildings; contacts adds ContactPage
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

## Design System (v2 — "editorial architecture")

Thin Montserrat, square geometry, hairlines, generous white space, gold eyebrows, burgundy CTAs. Tokens in `src/styles/variables.css` (legacy token names are aliased onto the new ones).

| Token | Value | Usage |
|-------|-------|-------|
| `--color-cta` (= `--color-primary`) | `#8A1538` | Buttons, key accents (logo burgundy-red) |
| `--color-accent` | `#9C6E1E` | Gold eyebrows ("Наши объекты:") — brand gold darkened for contrast |
| `--color-ink` / `--color-text-primary` | `#141414` / `#161616` | Text |
| `--color-text-secondary` / `--color-text-muted` | `#5C5C5C` / `#767676` | Body copy / labels |
| `--color-line`, `--color-line-strong` | `#E3E0DA`, `#CFCBC4` | Hairlines |
| `--color-surface-warm` | `#F5F3EF` | Alternating sections |
| `--color-surface-dark` | `#141414` | Footer, CTA band, management-services section |

### Typography

- **Montserrat** variable (100–900), self-hosted in `public/fonts/Montserrat-*.woff2` (cyrillic, cyrillic-ext, latin, latin-ext — latin-ext carries ₽).
- Headings weight 200–300 with negative tracking; body 400. Scale: `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-lead`, `--text-body`, `--text-small`, `--text-caption`, `--text-micro`.
- Helpers: `.eyebrow`, `.text-lead`, `.spec`, `.figure__caption`, `.link-arrow`.

### Buttons & motion

- `.btn--primary` (burgundy), `.btn--outline` (ink), `.btn--dark`, `.btn--light` (on photos/dark); all rectangular with a CSS chevron. `.btn--wide`, `.btn--block`. Text link: `.link-arrow` (alias `.btn--link`).
- Border radius is 0 everywhere by design.
- Add `data-reveal` (+ optional `style="--reveal-delay: 120ms"`) for a one-time fade-up on scroll (script in `BaseLayout`, respects reduced motion).
- Header: transparent over the home hero (`BaseLayout headerOverlay`), solid on scroll, hides on scroll down.

## Buildings Data

Two buildings on the same territory:

| Building | Slug | Class | Address |
|----------|------|-------|---------|
| Бизнес-Лофт Фидель | `fidel` | B+ | Пр. Обуховской Обороны, 70 |
| Бизнес-Центр АНМ | `anm` | B | Пр. Обуховской Обороны, 70к2 |

Both near metro **Елизаровская** (9 min walk).

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
3. **All text** — RU and EN copy live side by side in the view components (`const t = isEn ? {…} : {…}`); `src/i18n/` is legacy
4. **Styles** go in scoped `<style>` blocks; only add to `src/styles/` for truly shared utilities
5. **Data changes** — update both `src/data/offices.ts` and `public/data/offices.json`
6. **Number formatting** — use `formatNumber()`, `formatPrice()`, `formatArea()` from `@utils/formatters` (Russian convention: space as thousands separator)
7. **Internal links** — always use `withBase()` from `@utils/withBase`
8. **SEO** — every page must have title, description, and appropriate JSON-LD

## Known Issues

- Yandex Maps API key is placeholder (`YOUR_API_KEY` in InteractiveMap.tsx)
- `public/data/offices.json` is out of sync with `src/data/offices.ts` (json has `available: false`, ts has `available: true`)
- Office listings are fetched client-side from `offices.json` (not indexed by search engines)
- No lead form yet — CTAs use phone / `mailto:` (static hosting)
