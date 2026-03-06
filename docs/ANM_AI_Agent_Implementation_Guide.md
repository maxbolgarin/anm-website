# AI Agent Implementation Guide: УК АНМ Website

> **Purpose of this document.** This is a step-by-step, file-by-file implementation guide written for an AI coding agent. Every instruction is concrete and deterministic — there are no ambiguous design decisions left to make. Follow this document from top to bottom, executing each step in order, and the result will be a complete, production-ready Astro website for the УК АНМ office-rental company.

---

## 0. Context the Agent Must Know Before Writing Any Code

**What is this project?** A corporate website for УК АНМ (Александро-Невская Мануфактура), a St. Petersburg-based property management company that rents out office space in business centers it manages. The company has operated for 15+ years and specializes in redeveloping former industrial territories.

**Technology choice.** The site is built with **Astro** (static output mode) using **React** for interactive islands only. The vast majority of pages are pre-rendered HTML with zero client-side JavaScript. Only four features need client JS: the office-listing filter, the Yandex Maps interactive map, the photo-gallery lightbox, and the scheme/map toggle.

**Language.** All UI text, content, and comments in code are in **Russian**. The site has a secondary English version handled via i18n routing. When writing placeholder content, always write it in Russian.

**Brand identity to preserve.** The red/maroon accent color (`#B71C1C`), the "Александро-Невская Мануфактура" logo, the professional and understated tone. The visual style uses warm cream backgrounds, dark navy footer sections, and yellow highlight blocks. The reference site for UX structure is [sppcm.ru](https://sppcm.ru/) — adopt its layout patterns but use the ANM color palette.

**Hard constraints.** No employee photos anywhere. No login / personal cabinet. No "leave a request" form that collects personal data. All CTAs point to phone numbers and email addresses. Images can be sourced from the existing site at [a-n-m.ru](https://www.a-n-m.ru/).

---

## 1. Project Initialization

### Step 1.1 — Create the Astro project

Run the following commands in the terminal. Use `pnpm` as the package manager.

```bash
mkdir anm-website && cd anm-website
pnpm create astro@latest . -- --template minimal --typescript strict --install --no-git
```

If the interactive prompt appears, select: TypeScript — Strict, Install dependencies — Yes, Initialize git — No (we will init git manually later).

### Step 1.2 — Install all dependencies

```bash
pnpm add @astrojs/react @astrojs/sitemap react react-dom
pnpm add -D @types/react @types/react-dom astro-compress sharp
pnpm add yet-another-react-lightbox
```

### Step 1.3 — Create `astro.config.mjs`

Overwrite the generated config file with exactly this content:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.a-n-m.ru',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru-RU',
          en: 'en-US',
        },
      },
    }),
  ],
  build: {
    format: 'directory',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
```

### Step 1.4 — Create `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@islands/*": ["src/components/islands/*"],
      "@data/*": ["src/data/*"],
      "@styles/*": ["src/styles/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### Step 1.5 — Create the full directory structure

Run this single command to scaffold every directory the project needs:

```bash
mkdir -p \
  public/fonts \
  public/images/buildings/fidel \
  public/images/buildings/anm \
  public/images/infrastructure \
  public/images/about \
  public/images/common \
  public/data \
  public/documents/presentations \
  src/layouts \
  src/pages/buildings/fidel \
  src/pages/buildings/anm \
  src/pages/en \
  src/components/islands \
  src/content/buildings \
  src/styles \
  src/utils \
  src/data \
  src/i18n
```

### Step 1.6 — Create placeholder image files

For development, create simple placeholder images so that the site renders without broken images. Later these will be replaced with real photographs from the existing ANM website.

```bash
# Create a 1920x1080 placeholder hero image (grey rectangle with text)
# Use any method available — e.g., ImageMagick or a downloaded placeholder
# For now, just create empty placeholder files so paths resolve:
touch public/images/buildings/fidel/hero.jpg
touch public/images/buildings/fidel/exterior-1.jpg
touch public/images/buildings/fidel/exterior-2.jpg
touch public/images/buildings/fidel/interior-1.jpg
touch public/images/buildings/fidel/interior-2.jpg
touch public/images/buildings/fidel/lobby.jpg
touch public/images/buildings/anm/hero.jpg
touch public/images/buildings/anm/exterior-1.jpg
touch public/images/buildings/anm/interior-1.jpg
touch public/images/infrastructure/cafe.jpg
touch public/images/infrastructure/parking.jpg
touch public/images/infrastructure/security.jpg
touch public/images/infrastructure/reception.jpg
touch public/images/infrastructure/embankment.jpg
touch public/images/about/territory-aerial.jpg
touch public/images/about/territory-panorama.jpg
touch public/images/common/logo.png
touch public/images/common/logo-white.png
touch public/images/common/scheme.svg
```

### Step 1.7 — Create `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://www.a-n-m.ru/sitemap-index.xml
```

### Step 1.8 — Create `public/favicon.ico`

Copy the favicon from the existing site or use a placeholder. The favicon should be the ANM logo mark in red/maroon on a transparent background.

---

## 2. Design System — CSS Custom Properties and Global Styles

Every visual decision is encoded in CSS custom properties so that components never use hard-coded values. Create three CSS files.

### Step 2.1 — Create `src/styles/variables.css`

This file defines every design token used across the site.

```css
:root {
  /* ── Colors ── */
  --color-primary: #B71C1C;
  --color-primary-dark: #7F0000;
  --color-primary-light: #E53935;
  --color-surface-cream: #F5F0E8;
  --color-surface-white: #FFFFFF;
  --color-surface-dark: #1A1A2E;
  --color-accent-yellow: #F5D45E;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6B6B6B;
  --color-text-inverse: #FFFFFF;
  --color-border: #E0E0E0;

  /* ── Typography ── */
  --font-heading: 'Manrope', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --text-display: clamp(2.5rem, 5vw + 1rem, 6rem);
  --text-h1: clamp(2rem, 3vw + 0.5rem, 3.5rem);
  --text-h2: clamp(1.5rem, 2.5vw + 0.25rem, 2.5rem);
  --text-h3: clamp(1.25rem, 1.5vw + 0.25rem, 1.75rem);
  --text-h4: clamp(1.125rem, 1vw + 0.25rem, 1.375rem);
  --text-body: clamp(1rem, 0.5vw + 0.75rem, 1.125rem);
  --text-caption: 0.875rem;
  --text-small: 0.75rem;

  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-extrabold: 800;

  /* ── Spacing (8px base) ── */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
  --space-4xl: 6rem;     /* 96px */
  --space-5xl: 8rem;     /* 128px */

  /* ── Layout ── */
  --max-width: 80rem;        /* 1280px */
  --max-width-wide: 90rem;   /* 1440px */
  --grid-columns: 12;
  --grid-gap: var(--space-lg);
  --container-padding: var(--space-lg);

  /* ── Borders ── */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 1rem;      /* 16px */

  /* ── Shadows ── */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* ── Transitions ── */
  --transition-fast: 150ms ease-out;
  --transition-base: 250ms ease-out;
  --transition-slow: 400ms ease-out;

  /* ── Z-index scale ── */
  --z-header: 100;
  --z-subnav: 90;
  --z-overlay: 200;
  --z-lightbox: 300;

  /* ── Breakpoints (for reference in JS; CSS uses media queries) ── */
  --bp-mobile: 768px;
  --bp-tablet: 1024px;
  --bp-desktop: 1440px;
}
```

### Step 2.2 — Create `src/styles/typography.css`

```css
/* ── Font loading ── */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
}

@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 600 800;
  font-display: swap;
  src: url('/fonts/Manrope-Variable.woff2') format('woff2');
}

/* ── Base typography ── */
body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
  margin: 0;
}

.text-display {
  font-size: var(--text-display);
  font-weight: var(--weight-extrabold);
  line-height: 1.0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

h1, .text-h1 {
  font-size: var(--text-h1);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
}

h2, .text-h2 {
  font-size: var(--text-h2);
  font-weight: var(--weight-bold);
  line-height: var(--leading-snug);
}

h3, .text-h3 {
  font-size: var(--text-h3);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

h4, .text-h4 {
  font-size: var(--text-h4);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

p {
  margin: 0 0 var(--space-md) 0;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
}

.text-caption {
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

.text-small {
  font-size: var(--text-small);
  color: var(--color-text-secondary);
}

.text-stat {
  font-family: var(--font-heading);
  font-size: var(--text-h1);
  font-weight: var(--weight-bold);
  line-height: 1.0;
}

.text-stat-label {
  font-size: var(--text-caption);
  font-weight: var(--weight-regular);
  color: var(--color-text-secondary);
  margin-top: var(--space-xs);
}
```

### Step 2.3 — Create `src/styles/global.css`

```css
@import './variables.css';
@import './typography.css';

/* ── Reset ── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  background-color: var(--color-surface-white);
  min-height: 100vh;
  overflow-x: hidden;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

button {
  font: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

ul, ol {
  list-style: none;
}

/* ── Utility classes ── */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: var(--container-padding);
}

.container-wide {
  width: 100%;
  max-width: var(--max-width-wide);
  margin-inline: auto;
  padding-inline: var(--container-padding);
}

.section {
  padding-block: var(--space-4xl);
}

.section--cream {
  background-color: var(--color-surface-cream);
}

.section--dark {
  background-color: var(--color-surface-dark);
  color: var(--color-text-inverse);
}

.section--dark a {
  color: var(--color-text-inverse);
}

.section--yellow {
  background-color: var(--color-accent-yellow);
}

.grid {
  display: grid;
  gap: var(--grid-gap);
}

.grid--2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid--4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1023px) {
  .grid--3, .grid--4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .grid--2, .grid--3, .grid--4 {
    grid-template-columns: 1fr;
  }

  .section {
    padding-block: var(--space-3xl);
  }

  :root {
    --container-padding: var(--space-md);
  }
}

/* ── Button styles ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: var(--weight-medium);
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
  text-decoration: none;
  white-space: nowrap;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn--primary:hover {
  background-color: var(--color-primary-dark);
  color: var(--color-text-inverse);
}

.btn--outline {
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
}

.btn--outline:hover {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.btn--dark {
  background-color: var(--color-surface-dark);
  color: var(--color-text-inverse);
}

.btn--dark:hover {
  background-color: #2a2a3e;
  color: var(--color-text-inverse);
}

.btn--link {
  padding: 0;
  color: var(--color-primary);
  font-weight: var(--weight-medium);
  background: none;
}

.btn--link:hover {
  color: var(--color-primary-dark);
}

.btn--link::after {
  content: ' →';
}

/* ── Badge ── */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
  border-radius: var(--radius-sm);
}

.badge--class {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--text-h3);
  padding: var(--space-md) var(--space-lg);
}

/* ── Visually hidden (for accessibility) ── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Step 2.4 — Download fonts

Download the Inter and Manrope variable font files and place them in `public/fonts/`. These fonts support Cyrillic.

```bash
# Download Inter variable font
curl -L -o public/fonts/Inter-Variable.woff2 \
  "https://rsms.me/inter/font-files/InterVariable.woff2"

# Download Manrope variable font
curl -L -o public/fonts/Manrope-Variable.woff2 \
  "https://github.com/nicholasgross/Manrope/raw/main/fonts/variable/Manrope%5Bwght%5D.woff2"
```

If the above URLs are not available, use Google Fonts CDN instead by adding `<link>` tags in the BaseLayout head (see Step 3.1 for the fallback approach).

---

## 3. Layouts

### Step 3.1 — Create `src/layouts/BaseLayout.astro`

This is the root layout used by every page. It includes the `<html>` shell, meta tags, font loading, global CSS, the Header, SubNav, and Footer.

```astro
---
import Header from '@components/Header.astro';
import SubNav from '@components/SubNav.astro';
import Footer from '@components/Footer.astro';
import '@styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  jsonLd?: object;
}

const {
  title,
  description,
  ogImage = '/images/common/og-default.jpg',
  canonicalUrl,
  jsonLd,
} = Astro.props;

const currentPath = Astro.url.pathname;
const siteUrl = Astro.site?.toString().replace(/\/$/, '') || 'https://www.a-n-m.ru';
const canonical = canonicalUrl || `${siteUrl}${currentPath}`;

// Organization JSON-LD (appears on every page)
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "УК АНМ",
  "alternateName": "Александро-Невская Мануфактура",
  "url": siteUrl,
  "telephone": "+7-812-313-18-04",
  "email": "mail@ukanm.ru",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Пр. Обуховской Обороны д. 70, корпус 2, лит А",
    "addressLocality": "Санкт-Петербург",
    "addressCountry": "RU"
  }
};
---

<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <title>{title}</title>
  <meta name="description" content={description} />

  <link rel="canonical" href={canonical} />
  <link rel="alternate" hreflang="ru" href={`${siteUrl}${currentPath}`} />
  <link rel="alternate" hreflang="en" href={`${siteUrl}/en${currentPath}`} />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={`${siteUrl}${ogImage}`} />
  <meta property="og:url" content={canonical} />
  <meta property="og:locale" content="ru_RU" />

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />

  <!-- Fonts (fallback if local files are missing) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap"
    rel="stylesheet"
  />

  <!-- JSON-LD: Organization -->
  <script type="application/ld+json" set:html={JSON.stringify(orgJsonLd)} />

  <!-- JSON-LD: Page-specific -->
  {jsonLd && (
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  )}
</head>
<body>
  <Header currentPath={currentPath} />
  <SubNav currentPath={currentPath} />

  <main>
    <slot />
  </main>

  <Footer />
</body>
</html>
```

### Step 3.2 — Create `src/layouts/BuildingLayout.astro`

This layout wraps individual building pages. It extends BaseLayout and adds breadcrumbs and the building-specific context.

```astro
---
import BaseLayout from './BaseLayout.astro';
import Breadcrumbs from '@components/Breadcrumbs.astro';

interface Props {
  title: string;
  description: string;
  buildingName: string;
  buildingSlug: string;
  ogImage?: string;
  jsonLd?: object;
}

const { title, description, buildingName, buildingSlug, ogImage, jsonLd } = Astro.props;

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Бизнес-центры', href: '/buildings/' },
  { label: buildingName, href: `/buildings/${buildingSlug}/` },
];
---

<BaseLayout title={title} description={description} ogImage={ogImage} jsonLd={jsonLd}>
  <Breadcrumbs items={breadcrumbs} />
  <slot />
</BaseLayout>
```

---

## 4. Global Components (Astro — No Client JS)

### Step 4.1 — Create `src/data/navigation.ts`

This file provides the navigation data used by the Header, SubNav, and Footer.

```typescript
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface BuildingNavItem {
  name: string;
  slug: string;
  class: string; // e.g. "B+"
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
  // Add new buildings here in the future
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
```

### Step 4.2 — Create `src/components/Header.astro`

The header is a sticky bar at the top of every page. It contains the logo, main navigation links, the phone number, and a language toggle. On mobile it collapses into a hamburger menu.

```astro
---
import { mainNav, contactInfo } from '@data/navigation';

interface Props {
  currentPath: string;
}

const { currentPath } = Astro.props;
---

<header class="header" id="header">
  <div class="header__inner container-wide">
    <!-- Logo -->
    <a href="/" class="header__logo" aria-label="УК АНМ — Главная">
      <img
        src="/images/common/logo.png"
        alt="Александро-Невская Мануфактура"
        width="200"
        height="40"
        loading="eager"
      />
    </a>

    <!-- Desktop Navigation -->
    <nav class="header__nav" aria-label="Основная навигация">
      <ul class="header__nav-list">
        {mainNav.map((item) => (
          <li class="header__nav-item">
            <a
              href={item.href}
              class:list={[
                'header__nav-link',
                { 'header__nav-link--active': currentPath === item.href || currentPath.startsWith(item.href.replace(/\/$/, '') + '/') }
              ]}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    <!-- Right side: phone + language -->
    <div class="header__right">
      <a href={contactInfo.phoneHref} class="header__phone">
        {contactInfo.phone}
      </a>

      <div class="header__lang">
        <a href="/" class="header__lang-link header__lang-link--active">RU</a>
        <span class="header__lang-sep">|</span>
        <a href="/en/" class="header__lang-link">EN</a>
      </div>

      <!-- Mobile hamburger -->
      <button class="header__burger" aria-label="Открыть меню" aria-expanded="false" id="burger-btn">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>

  <!-- Mobile menu overlay -->
  <div class="header__mobile-menu" id="mobile-menu" aria-hidden="true">
    <nav aria-label="Мобильная навигация">
      <ul class="header__mobile-list">
        {mainNav.map((item) => (
          <li>
            <a href={item.href} class="header__mobile-link">{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
    <a href={contactInfo.phoneHref} class="header__mobile-phone">
      {contactInfo.phone}
    </a>
    <a href={contactInfo.emailHref} class="header__mobile-email">
      {contactInfo.email}
    </a>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: var(--z-header);
    background-color: var(--color-surface-white);
    border-bottom: 1px solid var(--color-border);
    transition: box-shadow var(--transition-base);
  }

  .header--scrolled {
    box-shadow: var(--shadow-md);
  }

  .header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.5rem;
    gap: var(--space-xl);
  }

  .header__logo img {
    height: 2rem;
    width: auto;
  }

  .header__nav-list {
    display: flex;
    gap: var(--space-xl);
  }

  .header__nav-link {
    font-size: var(--text-caption);
    font-weight: var(--weight-medium);
    color: var(--color-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-block: var(--space-sm);
    border-bottom: 2px solid transparent;
    transition: all var(--transition-fast);
  }

  .header__nav-link:hover,
  .header__nav-link--active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }

  .header__right {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
  }

  .header__phone {
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
    white-space: nowrap;
  }

  .header__phone:hover {
    color: var(--color-primary);
  }

  .header__lang {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--text-caption);
  }

  .header__lang-link {
    color: var(--color-text-secondary);
    font-weight: var(--weight-medium);
  }

  .header__lang-link--active {
    color: var(--color-text-primary);
    font-weight: var(--weight-bold);
  }

  .header__lang-sep {
    color: var(--color-border);
  }

  .header__burger {
    display: none;
    flex-direction: column;
    gap: 5px;
    width: 28px;
    padding: 4px 0;
  }

  .header__burger span {
    display: block;
    height: 2px;
    background-color: var(--color-text-primary);
    border-radius: 1px;
    transition: all var(--transition-base);
  }

  .header__mobile-menu {
    display: none;
    position: fixed;
    top: 4.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-surface-white);
    padding: var(--space-2xl) var(--container-padding);
    z-index: var(--z-overlay);
    overflow-y: auto;
  }

  .header__mobile-menu[aria-hidden="false"] {
    display: block;
  }

  .header__mobile-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .header__mobile-link {
    font-size: var(--text-h3);
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
  }

  .header__mobile-phone {
    display: block;
    margin-top: var(--space-2xl);
    font-size: var(--text-h3);
    font-weight: var(--weight-bold);
    color: var(--color-primary);
  }

  .header__mobile-email {
    display: block;
    margin-top: var(--space-md);
    color: var(--color-text-secondary);
  }

  @media (max-width: 1023px) {
    .header__nav {
      display: none;
    }

    .header__phone {
      display: none;
    }

    .header__lang {
      display: none;
    }

    .header__burger {
      display: flex;
    }
  }
</style>

<script>
  // Hamburger toggle
  const burger = document.getElementById('burger-btn');
  const menu = document.getElementById('mobile-menu');

  burger?.addEventListener('click', () => {
    const isOpen = menu?.getAttribute('aria-hidden') === 'false';
    menu?.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    burger?.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Sticky header shadow on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header?.classList.add('header--scrolled');
    } else {
      header?.classList.remove('header--scrolled');
    }
  });
</script>
```

### Step 4.3 — Create `src/components/SubNav.astro`

The secondary navigation bar sits directly below the header and shows building names with their class badges. It mirrors the SPPC pattern of building-level quick navigation.

```astro
---
import { buildingNav } from '@data/navigation';

interface Props {
  currentPath: string;
}

const { currentPath } = Astro.props;
---

<div class="subnav">
  <div class="subnav__inner container-wide">
    <span class="subnav__label">Бизнес-центры Санкт-Петербурга</span>
    <nav class="subnav__links" aria-label="Бизнес-центры">
      {buildingNav.map((building) => (
        <a
          href={building.href}
          class:list={[
            'subnav__link',
            { 'subnav__link--active': currentPath.startsWith(`/buildings/${building.slug}`) }
          ]}
        >
          <span class="subnav__class">{building.class}</span>
          <span class="subnav__name">{building.name}</span>
        </a>
      ))}
    </nav>
  </div>
</div>

<style>
  .subnav {
    position: sticky;
    top: 4.5rem;
    z-index: var(--z-subnav);
    background-color: var(--color-surface-white);
    border-bottom: 1px solid var(--color-border);
  }

  .subnav__inner {
    display: flex;
    align-items: center;
    gap: var(--space-xl);
    height: 3rem;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .subnav__inner::-webkit-scrollbar {
    display: none;
  }

  .subnav__label {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .subnav__links {
    display: flex;
    gap: var(--space-xl);
  }

  .subnav__link {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    white-space: nowrap;
    font-weight: var(--weight-medium);
    color: var(--color-text-primary);
    padding-block: var(--space-sm);
    border-bottom: 2px solid transparent;
    transition: all var(--transition-fast);
  }

  .subnav__link:hover,
  .subnav__link--active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }

  .subnav__class {
    font-size: var(--text-small);
    font-weight: var(--weight-bold);
    color: var(--color-primary);
  }

  .subnav__name {
    font-size: var(--text-caption);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 767px) {
    .subnav__label {
      display: none;
    }
  }
</style>
```

### Step 4.4 — Create `src/components/Footer.astro`

The footer is a dark-background section that appears on every page. It contains the logo, navigation links, building links, contact information, and legal links.

```astro
---
import { mainNav, buildingNav, contactInfo } from '@data/navigation';
---

<footer class="footer section--dark">
  <div class="footer__inner container">
    <!-- Top row: Logo + Nav + Buildings + Contacts -->
    <div class="footer__grid">
      <!-- Column 1: Logo & description -->
      <div class="footer__brand">
        <a href="/" aria-label="УК АНМ — Главная">
          <img
            src="/images/common/logo-white.png"
            alt="Александро-Невская Мануфактура"
            width="200"
            height="40"
            loading="lazy"
          />
        </a>
        <p class="footer__desc">
          Управляющая компания. Аренда офисов в бизнес-центрах Санкт-Петербурга.
        </p>
      </div>

      <!-- Column 2: Navigation -->
      <div class="footer__col">
        <h4 class="footer__heading">Навигация</h4>
        <ul class="footer__list">
          {mainNav.map((item) => (
            <li><a href={item.href} class="footer__link">{item.label}</a></li>
          ))}
        </ul>
      </div>

      <!-- Column 3: Buildings -->
      <div class="footer__col">
        <h4 class="footer__heading">Бизнес-центры</h4>
        <ul class="footer__list">
          {buildingNav.map((b) => (
            <li><a href={b.href} class="footer__link">БЦ {b.name}</a></li>
          ))}
        </ul>
      </div>

      <!-- Column 4: Contacts -->
      <div class="footer__col">
        <h4 class="footer__heading">Контакты</h4>
        <ul class="footer__list footer__list--contacts">
          <li>
            <span class="footer__contact-label">Приемная</span>
            <a href={contactInfo.receptionHref} class="footer__link">{contactInfo.reception}</a>
          </li>
          <li>
            <span class="footer__contact-label">Коммерческий отдел</span>
            <a href={contactInfo.commercialHref} class="footer__link">{contactInfo.commercial}</a>
          </li>
          <li>
            <span class="footer__contact-label">Email</span>
            <a href={contactInfo.emailHref} class="footer__link">{contactInfo.email}</a>
          </li>
        </ul>
        <p class="footer__address">{contactInfo.address}</p>
      </div>
    </div>

    <!-- Bottom row: Copyright + Legal -->
    <div class="footer__bottom">
      <span class="footer__copyright">&copy; {new Date().getFullYear()} УК АНМ. Все права защищены.</span>
      <div class="footer__legal">
        <a href="/legal/" class="footer__link">Раскрытие информации</a>
        <a href="/legal/#requisites" class="footer__link">Реквизиты</a>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    padding-block: var(--space-3xl) var(--space-xl);
  }

  .footer__grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
    gap: var(--space-2xl);
    padding-bottom: var(--space-2xl);
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  .footer__brand img {
    height: 2rem;
    width: auto;
    margin-bottom: var(--space-md);
  }

  .footer__desc {
    font-size: var(--text-caption);
    color: rgba(255, 255, 255, 0.6);
    line-height: var(--leading-relaxed);
  }

  .footer__heading {
    font-size: var(--text-caption);
    font-weight: var(--weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: var(--space-lg);
  }

  .footer__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .footer__list--contacts li {
    margin-bottom: var(--space-md);
  }

  .footer__contact-label {
    display: block;
    font-size: var(--text-small);
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: var(--space-xs);
  }

  .footer__link {
    font-size: var(--text-caption);
    color: rgba(255, 255, 255, 0.8);
    transition: color var(--transition-fast);
  }

  .footer__link:hover {
    color: var(--color-text-inverse);
  }

  .footer__address {
    font-size: var(--text-small);
    color: rgba(255, 255, 255, 0.5);
    margin-top: var(--space-md);
    line-height: var(--leading-relaxed);
  }

  .footer__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-lg);
  }

  .footer__copyright {
    font-size: var(--text-small);
    color: rgba(255, 255, 255, 0.4);
  }

  .footer__legal {
    display: flex;
    gap: var(--space-lg);
  }

  @media (max-width: 1023px) {
    .footer__grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 767px) {
    .footer__grid {
      grid-template-columns: 1fr;
    }

    .footer__bottom {
      flex-direction: column;
      gap: var(--space-md);
      text-align: center;
    }
  }
</style>
```

### Step 4.5 — Create `src/components/Breadcrumbs.astro`

```astro
---
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

const { items } = Astro.props;
---

<nav class="breadcrumbs container" aria-label="Хлебные крошки">
  <ol class="breadcrumbs__list">
    {items.map((item, index) => (
      <li class="breadcrumbs__item">
        {index < items.length - 1 ? (
          <>
            <a href={item.href} class="breadcrumbs__link">{item.label}</a>
            <span class="breadcrumbs__sep" aria-hidden="true">/</span>
          </>
        ) : (
          <span class="breadcrumbs__current" aria-current="page">{item.label}</span>
        )}
      </li>
    ))}
  </ol>
</nav>

<style>
  .breadcrumbs {
    padding-block: var(--space-md);
  }

  .breadcrumbs__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-xs);
  }

  .breadcrumbs__item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .breadcrumbs__link {
    font-size: var(--text-small);
    color: var(--color-text-secondary);
  }

  .breadcrumbs__link:hover {
    color: var(--color-primary);
  }

  .breadcrumbs__sep {
    font-size: var(--text-small);
    color: var(--color-border);
  }

  .breadcrumbs__current {
    font-size: var(--text-small);
    color: var(--color-text-primary);
    font-weight: var(--weight-medium);
  }
</style>
```

### Step 4.6 — Create `src/components/SectionHeading.astro`

A reusable section heading component used throughout the site.

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  tag?: 'h2' | 'h3';
  inverted?: boolean;
}

const { title, subtitle, align = 'left', tag = 'h2', inverted = false } = Astro.props;
const Tag = tag;
---

<div class:list={['section-heading', `section-heading--${align}`, { 'section-heading--inverted': inverted }]}>
  <Tag class="section-heading__title">{title}</Tag>
  {subtitle && <p class="section-heading__subtitle">{subtitle}</p>}
</div>

<style>
  .section-heading {
    margin-bottom: var(--space-2xl);
  }

  .section-heading--center {
    text-align: center;
  }

  .section-heading__title {
    margin-bottom: var(--space-sm);
  }

  .section-heading__subtitle {
    font-size: var(--text-body);
    color: var(--color-text-secondary);
    max-width: 40rem;
  }

  .section-heading--center .section-heading__subtitle {
    margin-inline: auto;
  }

  .section-heading--inverted .section-heading__title {
    color: var(--color-text-inverse);
  }

  .section-heading--inverted .section-heading__subtitle {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
```

### Step 4.7 — Create `src/components/ContactCTA.astro`

The dark-background call-to-action block that appears at the bottom of most pages. It displays the heading "Давайте обсудим детали" with the phone number and email.

```astro
---
import { contactInfo } from '@data/navigation';
---

<section class="cta section--dark">
  <div class="cta__inner container">
    <h2 class="cta__heading">Давайте обсудим детали</h2>
    <div class="cta__contacts">
      <a href={contactInfo.phoneHref} class="cta__phone">{contactInfo.phone}</a>
      <a href={contactInfo.emailHref} class="cta__email">{contactInfo.email}</a>
    </div>
    <p class="cta__address">{contactInfo.address}</p>
  </div>
</section>

<style>
  .cta {
    padding-block: var(--space-4xl);
    text-align: center;
  }

  .cta__heading {
    font-size: var(--text-h1);
    color: var(--color-text-inverse);
    margin-bottom: var(--space-xl);
  }

  .cta__contacts {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-2xl);
    flex-wrap: wrap;
    margin-bottom: var(--space-lg);
  }

  .cta__phone {
    font-family: var(--font-heading);
    font-size: var(--text-h2);
    font-weight: var(--weight-bold);
    color: var(--color-text-inverse);
  }

  .cta__phone:hover {
    color: var(--color-accent-yellow);
  }

  .cta__email {
    font-size: var(--text-h3);
    color: rgba(255, 255, 255, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 2px;
  }

  .cta__email:hover {
    color: var(--color-text-inverse);
    border-bottom-color: var(--color-text-inverse);
  }

  .cta__address {
    font-size: var(--text-caption);
    color: rgba(255, 255, 255, 0.5);
  }
</style>
```

### Step 4.8 — Create `src/components/StatsRow.astro`

Displays a horizontal row of key statistics (floors, area, parking, class). Used on building cards and building hero sections.

```astro
---
interface StatItem {
  value: string | number;
  label: string;
  unit?: string;
}

interface Props {
  stats: StatItem[];
}

const { stats } = Astro.props;
---

<div class="stats-row">
  {stats.map((stat) => (
    <div class="stats-row__item">
      <span class="stats-row__value">
        {stat.value}
        {stat.unit && <span class="stats-row__unit">{stat.unit}</span>}
      </span>
      <span class="stats-row__label">{stat.label}</span>
    </div>
  ))}
</div>

<style>
  .stats-row {
    display: flex;
    gap: var(--space-2xl);
    flex-wrap: wrap;
  }

  .stats-row__item {
    display: flex;
    flex-direction: column;
  }

  .stats-row__value {
    font-family: var(--font-heading);
    font-size: var(--text-h1);
    font-weight: var(--weight-bold);
    line-height: 1.0;
  }

  .stats-row__unit {
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
    color: var(--color-text-secondary);
  }

  .stats-row__label {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    margin-top: var(--space-xs);
  }
</style>
```

### Step 4.9 — Create `src/components/HeroSection.astro`

The full-viewport hero section used on the homepage.

```astro
---
interface Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage: string;
}

const { title, subtitle, ctaText, ctaHref, backgroundImage } = Astro.props;
---

<section class="hero" style={`--bg-image: url(${backgroundImage})`}>
  <div class="hero__overlay"></div>
  <div class="hero__content container">
    <h1 class="hero__title">{title}</h1>
    {subtitle && <p class="hero__subtitle">{subtitle}</p>}
    {ctaText && ctaHref && (
      <a href={ctaHref} class="btn btn--primary hero__cta">{ctaText}</a>
    )}
  </div>
  <div class="hero__scroll-indicator" aria-hidden="true">
    <span>Scroll</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: flex-end;
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    padding-bottom: var(--space-4xl);
  }

  .hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.3) 40%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }

  .hero__content {
    position: relative;
    z-index: 1;
    max-width: 50rem;
  }

  .hero__title {
    font-size: var(--text-display);
    color: var(--color-text-inverse);
    margin-bottom: var(--space-lg);
    text-wrap: balance;
  }

  .hero__subtitle {
    font-size: var(--text-h3);
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: var(--space-xl);
    max-width: 36rem;
  }

  .hero__cta {
    font-size: var(--text-body);
    padding: var(--space-md) var(--space-2xl);
  }

  .hero__scroll-indicator {
    position: absolute;
    bottom: var(--space-xl);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    color: rgba(255, 255, 255, 0.5);
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(8px); }
  }

  @media (max-width: 767px) {
    .hero {
      min-height: 80vh;
    }

    .hero__scroll-indicator {
      display: none;
    }
  }
</style>
```

### Step 4.10 — Create `src/components/BuildingCard.astro`

The large building presentation card used on the homepage. The layout alternates between left-text/right-image and right-text/left-image (zigzag pattern).

```astro
---
import StatsRow from './StatsRow.astro';

interface Props {
  name: string;
  slug: string;
  buildingClass: string;
  address: string;
  metro: string;
  metroMinutes: number;
  stats: { value: string | number; label: string; unit?: string }[];
  description: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
  presentationUrl?: string;
}

const {
  name, slug, buildingClass, address, metro, metroMinutes,
  stats, description, image, imageAlt, reversed = false, presentationUrl
} = Astro.props;
---

<article class:list={['building-card', { 'building-card--reversed': reversed }]}>
  <div class="building-card__text">
    <div class="building-card__header">
      <span class="building-card__label">Бизнес-центр</span>
      <h2 class="building-card__name text-display">{name}</h2>
      <a href={`/buildings/${slug}/`} class="building-card__arrow" aria-label={`Подробнее о БЦ ${name}`}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 4l20 0 0 20M28 4L4 28"/>
        </svg>
      </a>
    </div>

    <div class="building-card__meta">
      <p class="building-card__address">Адрес: <strong>{address}</strong></p>
      <p class="building-card__metro">Метро: {metro} <strong>{metroMinutes} мин</strong> пешком</p>
    </div>

    <StatsRow stats={stats} />

    <p class="building-card__desc">{description}</p>

    <div class="building-card__actions">
      <a href={`/buildings/${slug}/`} class="btn btn--primary">Подробнее</a>
      {presentationUrl && (
        <a href={presentationUrl} class="btn btn--outline" download>
          Скачать презентацию
        </a>
      )}
    </div>
  </div>

  <div class="building-card__image-wrap">
    <div class="building-card__class-badge badge--class">{buildingClass}</div>
    <img src={image} alt={imageAlt} class="building-card__image" loading="lazy" />
  </div>
</article>

<style>
  .building-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    align-items: center;
    padding-block: var(--space-3xl);
  }

  .building-card--reversed {
    direction: rtl;
  }

  .building-card--reversed > * {
    direction: ltr;
  }

  .building-card__header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .building-card__label {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    display: block;
    margin-bottom: var(--space-xs);
  }

  .building-card__name {
    flex: 1;
  }

  .building-card__arrow {
    flex-shrink: 0;
    color: var(--color-text-primary);
    transition: color var(--transition-fast);
  }

  .building-card__arrow:hover {
    color: var(--color-primary);
  }

  .building-card__meta {
    margin-bottom: var(--space-lg);
  }

  .building-card__address,
  .building-card__metro {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xs);
  }

  .building-card__desc {
    margin-top: var(--space-lg);
    color: var(--color-text-secondary);
    max-width: 32rem;
  }

  .building-card__actions {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-xl);
    flex-wrap: wrap;
  }

  .building-card__image-wrap {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .building-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 4 / 5;
  }

  .building-card__class-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: var(--text-display);
    padding: var(--space-lg) var(--space-xl);
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
    line-height: 1;
  }

  @media (max-width: 767px) {
    .building-card {
      grid-template-columns: 1fr;
    }

    .building-card--reversed {
      direction: ltr;
    }

    .building-card__image {
      aspect-ratio: 16 / 10;
    }
  }
</style>
```

### Step 4.11 — Create `src/components/FeatureBlock.astro`

A photo + text block used for the "Comfort in Details" / advantages section.

```astro
---
interface Props {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
}

const { title, description, image, imageAlt, reversed = false } = Astro.props;
---

<div class:list={['feature-block', { 'feature-block--reversed': reversed }]}>
  <div class="feature-block__image-wrap">
    <img src={image} alt={imageAlt} class="feature-block__image" loading="lazy" />
  </div>
  <div class="feature-block__content">
    <h3 class="feature-block__title">{title}</h3>
    <p class="feature-block__desc">{description}</p>
  </div>
</div>

<style>
  .feature-block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    align-items: center;
    padding-block: var(--space-2xl);
  }

  .feature-block--reversed {
    direction: rtl;
  }

  .feature-block--reversed > * {
    direction: ltr;
  }

  .feature-block__image-wrap {
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .feature-block__image {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
  }

  .feature-block__title {
    margin-bottom: var(--space-md);
  }

  .feature-block__desc {
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  @media (max-width: 767px) {
    .feature-block {
      grid-template-columns: 1fr;
    }

    .feature-block--reversed {
      direction: ltr;
    }
  }
</style>
```

### Step 4.12 — Create `src/components/ParameterGrid.astro`

A grid of building technical parameters used on building detail pages.

```astro
---
interface Parameter {
  label: string;
  value: string;
}

interface Props {
  parameters: Parameter[];
  title?: string;
}

const { parameters, title = 'Основные параметры' } = Astro.props;
---

<section class="param-grid section--cream">
  <div class="container">
    <h2 class="param-grid__title">{title}</h2>
    <div class="param-grid__grid">
      {parameters.map((param) => (
        <div class="param-grid__item">
          <span class="param-grid__value">{param.value}</span>
          <span class="param-grid__label">{param.label}</span>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .param-grid {
    padding-block: var(--space-3xl);
  }

  .param-grid__title {
    margin-bottom: var(--space-2xl);
  }

  .param-grid__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: var(--space-lg);
  }

  .param-grid__item {
    display: flex;
    flex-direction: column;
    padding: var(--space-lg);
    background-color: var(--color-surface-white);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .param-grid__value {
    font-family: var(--font-heading);
    font-size: var(--text-h3);
    font-weight: var(--weight-bold);
    margin-bottom: var(--space-xs);
  }

  .param-grid__label {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
  }
</style>
```

### Step 4.13 — Create `src/components/FacilityCard.astro`

Infrastructure item card with photo and description.

```astro
---
interface Props {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

const { name, description, image, imageAlt } = Astro.props;
---

<div class="facility-card">
  <div class="facility-card__image-wrap">
    <img src={image} alt={imageAlt} class="facility-card__image" loading="lazy" />
  </div>
  <div class="facility-card__content">
    <h3 class="facility-card__name">{name}</h3>
    <p class="facility-card__desc">{description}</p>
  </div>
</div>

<style>
  .facility-card {
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--color-surface-white);
    border: 1px solid var(--color-border);
    transition: box-shadow var(--transition-base);
  }

  .facility-card:hover {
    box-shadow: var(--shadow-md);
  }

  .facility-card__image-wrap {
    overflow: hidden;
  }

  .facility-card__image {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }

  .facility-card:hover .facility-card__image {
    transform: scale(1.03);
  }

  .facility-card__content {
    padding: var(--space-lg);
  }

  .facility-card__name {
    font-size: var(--text-h4);
    margin-bottom: var(--space-sm);
  }

  .facility-card__desc {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }
</style>
```

At this point, all global and reusable static components are complete. Verify the build compiles without errors by running:

```bash
pnpm run dev
```

Fix any import path issues before proceeding.

---

## 5. Data Layer

Before building pages, create all the data files that pages consume. This ensures every page can import typed data immediately.

### Step 5.1 — Create `src/utils/types.ts`

```typescript
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
```

### Step 5.2 — Create `src/data/buildings.ts`

This file contains all building data. When a new building is added in the future, only this file needs to be updated.

```typescript
import type { Building } from '@utils/types';

export const buildings: Building[] = [
  {
    name: 'Фидель',
    slug: 'fidel',
    class: 'B+',
    address: 'Санкт-Петербург, Пр. Обуховской Обороны д. 70',
    shortAddress: 'Пр. Обуховской Обороны, 70',
    metro: [
      {
        name: 'Елизаровская',
        line: 'Невско-Василеостровская',
        lineColor: '#009A49',
        walkingMinutes: 5,
      },
    ],
    stats: [
      { value: 5, label: 'Этажей' },
      { value: '14 000', label: 'Общая площадь', unit: 'м²' },
      { value: 500, label: 'Машиномест' },
      { value: 'B+', label: 'Класс' },
    ],
    description: 'Бизнес-лофт класса B+ на территории Александро-Невской Мануфактуры. Дизайнерская отделка в стиле лофт, современные инженерные системы, развитая инфраструктура и прогулочная зона на набережной Невы.',
    heroImage: '/images/buildings/fidel/hero.jpg',
    galleryImages: [
      '/images/buildings/fidel/exterior-1.jpg',
      '/images/buildings/fidel/exterior-2.jpg',
      '/images/buildings/fidel/interior-1.jpg',
      '/images/buildings/fidel/interior-2.jpg',
      '/images/buildings/fidel/lobby.jpg',
    ],
    features: [
      {
        title: 'Архитектура и дизайн',
        description: 'Бизнес-лофт с дизайнерской отделкой: ламинат, окрашенные стены (кирпич и гипсокартон), подвесные светильники, двухкамерные стеклопакеты. Уникальный характер промышленного здания сохранён и подчёркнут современными решениями.',
        image: '/images/buildings/fidel/interior-1.jpg',
        imageAlt: 'Интерьер бизнес-центра Фидель в стиле лофт',
      },
      {
        title: 'Инженерное оснащение',
        description: 'Электроснабжение II категории надежности, централизованное кондиционирование Ciat, приточно-вытяжная вентиляция, собственная газовая котельная, пожарная сигнализация, 4 лифта, 6 телеком-операторов.',
        image: '/images/buildings/fidel/exterior-2.jpg',
        imageAlt: 'Фасад бизнес-центра Фидель',
      },
      {
        title: 'Сервис и управление',
        description: 'Профессиональная управляющая компания с 15-летним опытом. Круглосуточный доступ, служба эксплуатации, клининг, охрана территории.',
        image: '/images/buildings/fidel/lobby.jpg',
        imageAlt: 'Лобби бизнес-центра Фидель',
      },
    ],
    parameters: [
      { label: 'Класс', value: 'B+' },
      { label: 'Этажей', value: '5' },
      { label: 'Общая площадь', value: '14 000 м²' },
      { label: 'Год реконструкции', value: '2010' },
      { label: 'Электроснабжение', value: 'II категория надежности' },
      { label: 'Кондиционирование', value: 'Централизованное (Ciat)' },
      { label: 'Вентиляция', value: 'Приточно-вытяжная' },
      { label: 'Отопление', value: 'Автономное, газовая котельная' },
      { label: 'Лифты', value: '4' },
      { label: 'Пожарная сигнализация', value: 'Да' },
      { label: 'Телеком-операторы', value: '6 операторов' },
      { label: 'Парковка', value: 'Закрытая, 500 мест' },
    ],
    infrastructure: [
      {
        name: 'Кафе и столовая',
        description: 'Уютное кафе с широким меню на территории бизнес-центра. Горячие обеды, бизнес-ланчи, выпечка и напитки.',
        image: '/images/infrastructure/cafe.jpg',
        imageAlt: 'Кафе на территории бизнес-центра Фидель',
      },
      {
        name: 'Закрытая парковка',
        description: 'Охраняемая закрытая парковка на 500 автомобилей с круглосуточным доступом.',
        image: '/images/infrastructure/parking.jpg',
        imageAlt: 'Парковка бизнес-центра Фидель',
      },
      {
        name: 'Охрана и безопасность',
        description: 'Круглосуточная охрана территории, система контроля доступа, видеонаблюдение, пожарная сигнализация.',
        image: '/images/infrastructure/security.jpg',
        imageAlt: 'Система безопасности бизнес-центра',
      },
      {
        name: 'Ресепшн',
        description: 'Профессиональная служба ресепшн, помощь арендаторам и посетителям.',
        image: '/images/infrastructure/reception.jpg',
        imageAlt: 'Ресепшн бизнес-центра Фидель',
      },
      {
        name: 'Набережная Невы',
        description: 'Прогулочная зона на набережной Невы — уникальная особенность территории для отдыха сотрудников.',
        image: '/images/infrastructure/embankment.jpg',
        imageAlt: 'Набережная Невы рядом с бизнес-центром',
      },
    ],
    faq: [
      {
        question: 'Каковы условия аренды?',
        answer: 'Условия аренды обсуждаются индивидуально. Свяжитесь с коммерческим отделом по телефону +7 (812) 336-55-64 для получения актуального предложения.',
      },
      {
        question: 'Какой минимальный срок аренды?',
        answer: 'Минимальный срок аренды — 11 месяцев. Возможны индивидуальные условия при долгосрочной аренде.',
      },
      {
        question: 'Включены ли коммунальные услуги в стоимость?',
        answer: 'Базовая арендная ставка включает эксплуатационные расходы. Коммунальные услуги (электричество, вода) оплачиваются отдельно по счётчикам.',
      },
      {
        question: 'Есть ли возможность перепланировки?',
        answer: 'Возможность перепланировки обсуждается индивидуально с управляющей компанией. Мы готовы адаптировать помещение под ваши потребности.',
      },
      {
        question: 'Как работает парковка?',
        answer: 'Закрытая охраняемая парковка на 500 мест. Парковочное место можно арендовать дополнительно. Также доступна крытая велопарковка на 50 мест.',
      },
    ],
    presentationUrl: '/documents/presentations/fidel-presentation.pdf',
    coordinates: { lat: 59.9075, lng: 30.4267 },
    order: 1,
  },
  {
    name: 'АНМ',
    slug: 'anm',
    class: 'B+',
    address: 'Санкт-Петербург, Пр. Обуховской Обороны д. 70, корпус 2',
    shortAddress: 'Пр. Обуховской Обороны, 70к2',
    metro: [
      {
        name: 'Елизаровская',
        line: 'Невско-Василеостровская',
        lineColor: '#009A49',
        walkingMinutes: 5,
      },
    ],
    stats: [
      { value: 4, label: 'Этажей' },
      { value: '8 000', label: 'Общая площадь', unit: 'м²' },
      { value: 500, label: 'Машиномест' },
      { value: 'B+', label: 'Класс' },
    ],
    description: 'Бизнес-центр на территории Александро-Невской Мануфактуры. Современные офисные помещения с качественной отделкой, удобная транспортная доступность и полная инфраструктура для бизнеса.',
    heroImage: '/images/buildings/anm/hero.jpg',
    galleryImages: [
      '/images/buildings/anm/exterior-1.jpg',
      '/images/buildings/anm/interior-1.jpg',
    ],
    features: [
      {
        title: 'Расположение',
        description: 'Бизнес-центр расположен на территории исторической Александро-Невской Мануфактуры, в 5 минутах ходьбы от метро Елизаровская.',
        image: '/images/buildings/anm/exterior-1.jpg',
        imageAlt: 'Фасад бизнес-центра АНМ',
      },
      {
        title: 'Современные офисы',
        description: 'Качественная отделка, современные инженерные системы, гибкие планировки для компаний любого размера.',
        image: '/images/buildings/anm/interior-1.jpg',
        imageAlt: 'Интерьер бизнес-центра АНМ',
      },
    ],
    parameters: [
      { label: 'Класс', value: 'B+' },
      { label: 'Этажей', value: '4' },
      { label: 'Общая площадь', value: '8 000 м²' },
      { label: 'Электроснабжение', value: 'II категория надежности' },
      { label: 'Кондиционирование', value: 'Централизованное' },
      { label: 'Вентиляция', value: 'Приточно-вытяжная' },
      { label: 'Парковка', value: 'Закрытая, 500 мест (общая)' },
    ],
    infrastructure: [
      {
        name: 'Кафе и столовая',
        description: 'Общая инфраструктура территории АНМ — кафе, столовая, банкоматы.',
        image: '/images/infrastructure/cafe.jpg',
        imageAlt: 'Кафе на территории АНМ',
      },
      {
        name: 'Парковка',
        description: 'Общая закрытая парковка территории на 500 автомобилей.',
        image: '/images/infrastructure/parking.jpg',
        imageAlt: 'Парковка территории АНМ',
      },
    ],
    faq: [
      {
        question: 'Как связаться с коммерческим отделом?',
        answer: 'Позвоните по телефону +7 (812) 336-55-64 или напишите на mail@ukanm.ru.',
      },
    ],
    coordinates: { lat: 59.9078, lng: 30.4272 },
    order: 2,
  },
];

export function getBuildingBySlug(slug: string): Building | undefined {
  return buildings.find((b) => b.slug === slug);
}
```

### Step 5.3 — Create `src/data/offices.ts`

```typescript
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
    photos: ['/images/buildings/fidel/interior-1.jpg'],
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
    photos: ['/images/buildings/fidel/interior-2.jpg'],
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
    photos: ['/images/buildings/fidel/interior-1.jpg'],
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
    photos: ['/images/buildings/fidel/interior-2.jpg'],
    available: true,
  },
  {
    id: 'anm-201',
    buildingSlug: 'anm',
    buildingName: 'АНМ',
    area: 55,
    floor: 2,
    class: 'B+',
    type: 'cabinet',
    address: 'Пр. Обуховской Обороны, 70к2',
    pricePerSqm: 1100,
    totalPrice: 60500,
    photos: ['/images/buildings/anm/interior-1.jpg'],
    available: true,
  },
  {
    id: 'anm-301',
    buildingSlug: 'anm',
    buildingName: 'АНМ',
    area: 95,
    floor: 3,
    class: 'B+',
    type: 'open-space',
    address: 'Пр. Обуховской Обороны, 70к2',
    pricePerSqm: 1000,
    totalPrice: 95000,
    photos: ['/images/buildings/anm/interior-1.jpg'],
    available: true,
  },
];

export function getOfficesByBuilding(slug: string): Office[] {
  return offices.filter((o) => o.buildingSlug === slug && o.available);
}

export function getAllAvailableOffices(): Office[] {
  return offices.filter((o) => o.available);
}
```

### Step 5.4 — Create `public/data/offices.json`

This is the same data in JSON format, consumed by the client-side OfficeFilter React island. Generate it from the TypeScript data or maintain it separately. The React island loads this file at runtime.

```json
[
  {
    "id": "fidel-301",
    "buildingSlug": "fidel",
    "buildingName": "Фидель",
    "area": 45,
    "floor": 3,
    "class": "B+",
    "type": "cabinet",
    "address": "Пр. Обуховской Обороны, 70",
    "pricePerSqm": 1200,
    "totalPrice": 54000,
    "photos": ["/images/buildings/fidel/interior-1.jpg"],
    "available": true
  },
  {
    "id": "fidel-302",
    "buildingSlug": "fidel",
    "buildingName": "Фидель",
    "area": 120,
    "floor": 3,
    "class": "B+",
    "type": "open-space",
    "address": "Пр. Обуховской Обороны, 70",
    "pricePerSqm": 1100,
    "totalPrice": 132000,
    "photos": ["/images/buildings/fidel/interior-2.jpg"],
    "available": true
  },
  {
    "id": "fidel-401",
    "buildingSlug": "fidel",
    "buildingName": "Фидель",
    "area": 78,
    "floor": 4,
    "class": "B+",
    "type": "cabinet",
    "address": "Пр. Обуховской Обороны, 70",
    "pricePerSqm": 1250,
    "totalPrice": 97500,
    "photos": ["/images/buildings/fidel/interior-1.jpg"],
    "available": true
  },
  {
    "id": "fidel-501",
    "buildingSlug": "fidel",
    "buildingName": "Фидель",
    "area": 200,
    "floor": 5,
    "class": "B+",
    "type": "open-space",
    "address": "Пр. Обуховской Обороны, 70",
    "pricePerSqm": 1050,
    "totalPrice": 210000,
    "photos": ["/images/buildings/fidel/interior-2.jpg"],
    "available": true
  },
  {
    "id": "anm-201",
    "buildingSlug": "anm",
    "buildingName": "АНМ",
    "area": 55,
    "floor": 2,
    "class": "B+",
    "type": "cabinet",
    "address": "Пр. Обуховской Обороны, 70к2",
    "pricePerSqm": 1100,
    "totalPrice": 60500,
    "photos": ["/images/buildings/anm/interior-1.jpg"],
    "available": true
  },
  {
    "id": "anm-301",
    "buildingSlug": "anm",
    "buildingName": "АНМ",
    "area": 95,
    "floor": 3,
    "class": "B+",
    "type": "open-space",
    "address": "Пр. Обуховской Обороны, 70к2",
    "pricePerSqm": 1000,
    "totalPrice": 95000,
    "photos": ["/images/buildings/anm/interior-1.jpg"],
    "available": true
  }
]
```

### Step 5.5 — Create `src/i18n/ru.json`

```json
{
  "site.title": "УК АНМ — Аренда офисов в бизнес-центрах Санкт-Петербурга",
  "nav.home": "Главная",
  "nav.buildings": "Бизнес-центры",
  "nav.offices": "Аренда офисов",
  "nav.about": "О компании",
  "nav.contacts": "Контакты",
  "hero.title": "Офисы в аренду в бизнес-центрах СПб",
  "hero.subtitle": "Все уровни комфорта для вашего бизнеса",
  "hero.cta": "Аренда помещений",
  "buildings.label": "Бизнес-центр",
  "buildings.more": "Подробнее",
  "buildings.download": "Скачать презентацию",
  "offices.title": "Аренда офисов",
  "offices.all": "Все предложения",
  "offices.empty": "Свободных помещений нет. Свяжитесь с нами для обсуждения вариантов.",
  "offices.floor": "Этаж",
  "offices.area": "Площадь",
  "offices.price": "Стоимость",
  "offices.type.cabinet": "Кабинет",
  "offices.type.open-space": "Открытое пространство",
  "offices.perSqm": "₽/м² в месяц",
  "offices.perMonth": "₽/мес",
  "about.title": "О компании",
  "contacts.title": "Контакты",
  "contacts.heading": "Хотите задать вопрос или обсудить сотрудничество?",
  "cta.heading": "Давайте обсудим детали",
  "footer.copyright": "© {year} УК АНМ. Все права защищены.",
  "footer.disclosure": "Раскрытие информации",
  "footer.requisites": "Реквизиты"
}
```

### Step 5.6 — Create `src/i18n/en.json`

```json
{
  "site.title": "ANM Management — Office Rental in St. Petersburg Business Centers",
  "nav.home": "Home",
  "nav.buildings": "Business Centers",
  "nav.offices": "Office Rental",
  "nav.about": "About",
  "nav.contacts": "Contacts",
  "hero.title": "Office Space for Rent in St. Petersburg",
  "hero.subtitle": "Every level of comfort for your business",
  "hero.cta": "Rent an Office",
  "buildings.label": "Business Center",
  "buildings.more": "Learn More",
  "buildings.download": "Download Presentation",
  "offices.title": "Office Rental",
  "offices.all": "All Listings",
  "offices.empty": "No available offices at the moment. Contact us to discuss options.",
  "offices.floor": "Floor",
  "offices.area": "Area",
  "offices.price": "Price",
  "offices.type.cabinet": "Private Office",
  "offices.type.open-space": "Open Space",
  "offices.perSqm": "₽/m² per month",
  "offices.perMonth": "₽/month",
  "about.title": "About the Company",
  "contacts.title": "Contacts",
  "contacts.heading": "Have a question or want to discuss a partnership?",
  "cta.heading": "Let's Discuss the Details",
  "footer.copyright": "© {year} ANM Management. All rights reserved.",
  "footer.disclosure": "Disclosure",
  "footer.requisites": "Legal Details"
}
```

### Step 5.7 — Create `src/utils/formatters.ts`

```typescript
/**
 * Format a number with space as thousands separator (Russian convention).
 * Example: 132000 → "132 000"
 */
export function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Format price with currency symbol.
 * Example: 132000 → "132 000 ₽"
 */
export function formatPrice(n: number): string {
  return `${formatNumber(n)} ₽`;
}

/**
 * Format area with unit.
 * Example: 120 → "120 м²"
 */
export function formatArea(n: number): string {
  return `${formatNumber(n)} м²`;
}
```

---

## 6. Page Implementations

### Step 6.1 — Homepage (`src/pages/index.astro`)

The homepage is the most complex page. It has 8 sections stacked vertically. Build it exactly as described below.

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import HeroSection from '@components/HeroSection.astro';
import BuildingCard from '@components/BuildingCard.astro';
import SectionHeading from '@components/SectionHeading.astro';
import FeatureBlock from '@components/FeatureBlock.astro';
import StatsRow from '@components/StatsRow.astro';
import ContactCTA from '@components/ContactCTA.astro';
import { buildings } from '@data/buildings';
import { contactInfo } from '@data/navigation';

const title = 'Аренда офисов в бизнес-центрах Санкт-Петербурга — УК АНМ';
const description = 'Офисы в аренду в бизнес-центрах класса B+ в Санкт-Петербурге. Рядом с метро, развитая инфраструктура, круглосуточный доступ. УК АНМ — 15+ лет на рынке.';

const companyStats = [
  { value: '15+', label: 'лет на рынке' },
  { value: '22 000', label: 'м² под управлением' },
  { value: '100+', label: 'арендаторов' },
];

const advantages = [
  {
    title: 'Транспортная доступность',
    description: 'Метро Елизаровская в 5 минутах ходьбы. Невский проспект — 5 минут на автомобиле. Кольцевая автодорога — 10 минут.',
    image: '/images/buildings/fidel/exterior-1.jpg',
    imageAlt: 'Транспортная доступность бизнес-центров АНМ',
  },
  {
    title: 'Инженерное оснащение',
    description: 'Электроснабжение II категории надежности, централизованное кондиционирование, приточно-вытяжная вентиляция, собственная газовая котельная, 6 телеком-операторов.',
    image: '/images/buildings/fidel/interior-1.jpg',
    imageAlt: 'Инженерные системы бизнес-центров АНМ',
  },
  {
    title: 'Инфраструктура территории',
    description: 'Кафе и столовая, закрытая парковка на 500 мест, крытая велопарковка, банкоматы, клининг, прогулочная зона на набережной Невы.',
    image: '/images/infrastructure/cafe.jpg',
    imageAlt: 'Инфраструктура территории АНМ',
  },
  {
    title: 'Безопасность',
    description: 'Круглосуточная охрана территории, система контроля доступа, видеонаблюдение, пожарная сигнализация. Доступ в здания 24/7.',
    image: '/images/infrastructure/security.jpg',
    imageAlt: 'Система безопасности бизнес-центров АНМ',
  },
];
---

<BaseLayout title={title} description={description}>

  <!-- ===== SECTION 1: HERO ===== -->
  <HeroSection
    title="Офисы в аренду в бизнес-центрах СПб"
    subtitle="Все уровни комфорта для вашего бизнеса"
    ctaText="Аренда помещений"
    ctaHref="#offices"
    backgroundImage="/images/buildings/fidel/hero.jpg"
  />

  <!-- ===== SECTION 2: BUILDING CARDS ===== -->
  <section class="section" id="buildings">
    <div class="container">
      <SectionHeading
        title="Бизнес-центры"
        subtitle="Современные офисные пространства на территории Александро-Невской Мануфактуры"
      />
      {buildings.map((building, index) => (
        <BuildingCard
          name={building.name}
          slug={building.slug}
          buildingClass={building.class}
          address={building.address}
          metro={building.metro[0].name}
          metroMinutes={building.metro[0].walkingMinutes}
          stats={building.stats}
          description={building.description}
          image={building.heroImage}
          imageAlt={`Бизнес-центр ${building.name}`}
          reversed={index % 2 !== 0}
          presentationUrl={building.presentationUrl}
        />
      ))}
    </div>
  </section>

  <!-- ===== SECTION 3: ADVANTAGES / COMFORT IN DETAILS ===== -->
  <section class="section section--cream" id="advantages">
    <div class="container">
      <SectionHeading
        title="Комфорт в деталях"
        subtitle="Забота о комфорте ваших сотрудников"
      />
      {advantages.map((adv, index) => (
        <FeatureBlock
          title={adv.title}
          description={adv.description}
          image={adv.image}
          imageAlt={adv.imageAlt}
          reversed={index % 2 !== 0}
        />
      ))}
    </div>
  </section>

  <!-- ===== SECTION 4: INTERACTIVE MAP ===== -->
  <section class="section" id="map">
    <div class="container">
      <SectionHeading
        title="Расположение"
        subtitle="Бизнес-центры на территории Александро-Невской Мануфактуры"
      />
    </div>
    <div class="map-section">
      <div class="map-section__map" id="homepage-map">
        <!-- InteractiveMap React island is mounted here -->
        <div class="map-section__placeholder">
          <p>Загрузка карты...</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 5: OFFICE RENTAL QUICK VIEW ===== -->
  <section class="section section--cream" id="offices">
    <div class="container">
      <SectionHeading
        title="Аренда офисов"
        subtitle="Свободные помещения в наших бизнес-центрах"
      />
      <div id="office-filter-root">
        <!-- OfficeFilter React island is mounted here -->
        <noscript>
          <p>Для просмотра доступных офисов включите JavaScript или свяжитесь с нами по телефону {contactInfo.phone}.</p>
        </noscript>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 6: ABOUT COMPANY TEASER ===== -->
  <section class="section" id="about-teaser">
    <div class="container">
      <div class="about-teaser">
        <div class="about-teaser__text">
          <SectionHeading
            title="Управляющая компания АНМ"
            subtitle="Более 15 лет на рынке коммерческой недвижимости Санкт-Петербурга"
          />
          <p class="about-teaser__desc">
            УК АНМ — девелоперская и управляющая компания, специализирующаяся на редевелопменте промышленных территорий. Мы создаём качественные бизнес-пространства и комфортную среду для бизнес-сообщества.
          </p>
          <a href="/about/" class="btn btn--link">Подробнее о компании</a>
        </div>
        <div class="about-teaser__stats">
          <StatsRow stats={companyStats} />
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 7: CONTACT CTA ===== -->
  <ContactCTA />

  <!-- ===== SECTION 8: DISCLOSURE ===== -->
  <section class="section disclosure" id="disclosure">
    <div class="container">
      <details class="disclosure__details">
        <summary class="disclosure__summary">Раскрытие информации</summary>
        <div class="disclosure__content">
          <p>Информация, подлежащая раскрытию в соответствии с законодательством Российской Федерации. <a href="/legal/">Полная информация</a></p>
        </div>
      </details>
    </div>
  </section>

</BaseLayout>

<style>
  .map-section {
    width: 100%;
    height: 500px;
    background-color: var(--color-surface-cream);
  }

  .map-section__map {
    width: 100%;
    height: 100%;
  }

  .map-section__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--color-text-secondary);
  }

  .about-teaser {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: var(--space-3xl);
    align-items: center;
  }

  .about-teaser__desc {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xl);
    max-width: 36rem;
    line-height: var(--leading-relaxed);
  }

  .disclosure {
    padding-block: var(--space-xl);
    border-top: 1px solid var(--color-border);
  }

  .disclosure__summary {
    cursor: pointer;
    font-weight: var(--weight-medium);
    color: var(--color-text-secondary);
    font-size: var(--text-caption);
  }

  .disclosure__content {
    margin-top: var(--space-md);
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
  }

  @media (max-width: 767px) {
    .about-teaser {
      grid-template-columns: 1fr;
    }

    .map-section {
      height: 350px;
    }
  }
</style>

<!-- Mount the InteractiveMap island -->
<script>
  // The InteractiveMap and OfficeFilter React islands are mounted via
  // Astro's client:visible directive in their respective component wrappers.
  // See Section 7 of this guide for the island wrapper components.
</script>
```

### Step 6.2 — Buildings Index Page (`src/pages/buildings/index.astro`)

This page lists all buildings. It serves as a landing page when someone clicks "Бизнес-центры" in the nav.

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import BuildingCard from '@components/BuildingCard.astro';
import SectionHeading from '@components/SectionHeading.astro';
import ContactCTA from '@components/ContactCTA.astro';
import Breadcrumbs from '@components/Breadcrumbs.astro';
import { buildings } from '@data/buildings';

const title = 'Бизнес-центры Санкт-Петербурга — УК АНМ';
const description = 'Бизнес-центры класса B+ на территории Александро-Невской Мануфактуры. Аренда офисов от УК АНМ.';

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Бизнес-центры' },
];
---

<BaseLayout title={title} description={description}>
  <Breadcrumbs items={breadcrumbs} />

  <section class="section">
    <div class="container">
      <SectionHeading
        title="Бизнес-центры"
        subtitle="Современные офисные пространства на территории Александро-Невской Мануфактуры"
      />
      {buildings.map((building, index) => (
        <BuildingCard
          name={building.name}
          slug={building.slug}
          buildingClass={building.class}
          address={building.address}
          metro={building.metro[0].name}
          metroMinutes={building.metro[0].walkingMinutes}
          stats={building.stats}
          description={building.description}
          image={building.heroImage}
          imageAlt={`Бизнес-центр ${building.name}`}
          reversed={index % 2 !== 0}
          presentationUrl={building.presentationUrl}
        />
      ))}
    </div>
  </section>

  <ContactCTA />
</BaseLayout>
```

### Step 6.3 — Building Detail Page (`src/pages/buildings/fidel/index.astro`)

Create one file per building. This is the Fidel building page. Repeat the same pattern for `src/pages/buildings/anm/index.astro` with the ANM building data.

```astro
---
import BuildingLayout from '@layouts/BuildingLayout.astro';
import SectionHeading from '@components/SectionHeading.astro';
import StatsRow from '@components/StatsRow.astro';
import FeatureBlock from '@components/FeatureBlock.astro';
import ParameterGrid from '@components/ParameterGrid.astro';
import FacilityCard from '@components/FacilityCard.astro';
import ContactCTA from '@components/ContactCTA.astro';
import { getBuildingBySlug } from '@data/buildings';
import { getOfficesByBuilding } from '@data/offices';
import { contactInfo } from '@data/navigation';

const building = getBuildingBySlug('fidel')!;
const offices = getOfficesByBuilding('fidel');

const title = `Бизнес-центр ${building.name} — аренда офисов класса ${building.class} | УК АНМ`;
const description = `Бизнес-центр ${building.name} на ${building.shortAddress}. ${building.stats[1].value} м², ${building.stats[0].value} этажей, метро ${building.metro[0].name} ${building.metro[0].walkingMinutes} мин пешком. Аренда офисов от УК АНМ.`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OfficeSpace",
  "name": `Бизнес-центр ${building.name}`,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": building.address,
    "addressLocality": "Санкт-Петербург",
    "addressCountry": "RU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": building.coordinates.lat,
    "longitude": building.coordinates.lng
  },
  "openingHours": "Mo-Su 00:00-23:59"
};

const faqJsonLd = building.faq.length > 0 ? {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": building.faq.map(f => ({
    "@type": "Question",
    "name": f.question,
    "acceptedAnswer": { "@type": "Answer", "text": f.answer }
  }))
} : null;
---

<BuildingLayout
  title={title}
  description={description}
  buildingName={building.name}
  buildingSlug={building.slug}
  ogImage={building.heroImage}
  jsonLd={jsonLd}
>

  <!-- ===== SECTION 1: BUILDING HERO ===== -->
  <section class="building-hero">
    <div class="container">
      <div class="building-hero__grid">
        <div class="building-hero__text">
          <span class="building-hero__label">Бизнес-центр</span>
          <h1 class="building-hero__name text-display">{building.name}</h1>
          <div class="building-hero__meta">
            <p class="building-hero__address">{building.address}</p>
            <p class="building-hero__metro">
              <span class="building-hero__metro-dot" style={`background-color: ${building.metro[0].lineColor}`}></span>
              {building.metro[0].name} — {building.metro[0].walkingMinutes} мин пешком
            </p>
          </div>
          <StatsRow stats={building.stats} />
          <p class="building-hero__desc">{building.description}</p>
          <div class="building-hero__actions">
            <a href={`/buildings/${building.slug}/offices/`} class="btn btn--primary">Аренда офисов</a>
            {building.presentationUrl && (
              <a href={building.presentationUrl} class="btn btn--outline" download>Скачать презентацию</a>
            )}
          </div>
        </div>
        <div class="building-hero__image-wrap">
          <div class="building-hero__class-badge badge--class">{building.class}</div>
          <img src={building.heroImage} alt={`Бизнес-центр ${building.name}`} class="building-hero__image" loading="eager" />
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 2: BUILDING DETAILS ("В деталях") ===== -->
  <section class="section" id="details">
    <div class="container">
      <SectionHeading
        title={`${building.name} в деталях`}
        subtitle="Архитектура, инженерные системы, сервис"
      />
      {building.features.map((feature, index) => (
        <FeatureBlock
          title={feature.title}
          description={feature.description}
          image={feature.image}
          imageAlt={feature.imageAlt}
          reversed={index % 2 !== 0}
        />
      ))}
    </div>
  </section>

  <!-- ===== SECTION 3: KEY PARAMETERS GRID ===== -->
  <ParameterGrid parameters={building.parameters} />

  <!-- ===== SECTION 4: LOCATION AND TRANSPORT ===== -->
  <section class="section" id="location">
    <div class="container">
      <SectionHeading
        title="Расположение"
        subtitle="Удобная транспортная доступность"
      />
      <div class="location-grid">
        <div class="location-grid__info">
          <h3>Как добраться</h3>
          <ul class="location-list">
            {building.metro.map((m) => (
              <li class="location-list__item">
                <span class="location-list__dot" style={`background-color: ${m.lineColor}`}></span>
                <div>
                  <strong>{m.name}</strong> ({m.line})
                  <br />
                  <span class="text-caption">{m.walkingMinutes} мин пешком</span>
                </div>
              </li>
            ))}
          </ul>
          <div class="location-driving">
            <h4>На автомобиле</h4>
            <p class="text-caption">Невский проспект — 5 мин</p>
            <p class="text-caption">Кольцевая автодорога — 10 мин</p>
          </div>
          <a href={`/buildings/${building.slug}/how-to-get/`} class="btn btn--link">Подробная схема проезда</a>
        </div>
        <div class="location-grid__map" id="building-map">
          <!-- InteractiveMap React island for this building -->
          <div class="map-section__placeholder">
            <p>Загрузка карты...</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 5: INFRASTRUCTURE ===== -->
  <section class="section section--cream" id="infrastructure">
    <div class="container">
      <SectionHeading
        title="Инфраструктура на территории"
        subtitle="Всё необходимое для комфортной работы"
      />
      <div class="grid grid--3">
        {building.infrastructure.map((item) => (
          <FacilityCard
            name={item.name}
            description={item.description}
            image={item.image}
            imageAlt={item.imageAlt}
          />
        ))}
      </div>
      <div style="text-align: center; margin-top: var(--space-2xl);">
        <a href={`/buildings/${building.slug}/infrastructure/`} class="btn btn--outline">Вся инфраструктура</a>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 6: OFFICE RENTAL LISTINGS (INTERNAL TAB) ===== -->
  <section class="section" id="offices">
    <div class="container">
      <SectionHeading
        title="Аренда офисов"
        subtitle={`Свободные помещения в БЦ ${building.name}`}
      />
      {offices.length > 0 ? (
        <div id="building-office-filter-root" data-building={building.slug}>
          <!-- OfficeFilter React island scoped to this building -->
          <noscript>
            <p>Для просмотра доступных офисов включите JavaScript или свяжитесь с нами по телефону {contactInfo.phone}.</p>
          </noscript>
        </div>
      ) : (
        <div class="offices-empty">
          <div class="offices-empty__content">
            <h3>В данный момент свободных помещений нет</h3>
            <p>Обратитесь с запросом — мы подберём подходящий вариант.</p>
            <div class="offices-empty__contacts">
              <a href={contactInfo.commercialHref} class="offices-empty__phone">{contactInfo.commercial}</a>
              <a href={contactInfo.emailHref} class="offices-empty__email">{contactInfo.email}</a>
            </div>
          </div>
        </div>
      )}
      <div style="text-align: center; margin-top: var(--space-xl);">
        <a href={`/buildings/${building.slug}/offices/`} class="btn btn--link">Все предложения</a>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 7: FAQ ===== -->
  {building.faq.length > 0 && (
    <section class="section section--cream" id="faq">
      <div class="container">
        <SectionHeading title="Частые вопросы" />
        <div class="faq-list">
          {building.faq.map((item) => (
            <details class="faq-item">
              <summary class="faq-item__question">{item.question}</summary>
              <div class="faq-item__answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )}

  <!-- ===== SECTION 8: CONTACT CTA ===== -->
  <ContactCTA />

</BuildingLayout>

<style>
  /* Building Hero */
  .building-hero {
    padding-top: var(--space-xl);
    padding-bottom: var(--space-3xl);
  }

  .building-hero__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    align-items: start;
  }

  .building-hero__label {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: var(--space-sm);
  }

  .building-hero__name {
    margin-bottom: var(--space-lg);
  }

  .building-hero__meta {
    margin-bottom: var(--space-xl);
  }

  .building-hero__address {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xs);
  }

  .building-hero__metro {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
  }

  .building-hero__metro-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .building-hero__desc {
    margin-top: var(--space-xl);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    max-width: 32rem;
  }

  .building-hero__actions {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-xl);
    flex-wrap: wrap;
  }

  .building-hero__image-wrap {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .building-hero__image {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
  }

  .building-hero__class-badge {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  /* Location */
  .location-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: var(--space-2xl);
  }

  .location-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
  }

  .location-list__item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .location-list__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .location-driving {
    margin-bottom: var(--space-xl);
  }

  .location-driving h4 {
    margin-bottom: var(--space-sm);
  }

  .location-grid__map {
    height: 400px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--color-surface-cream);
  }

  /* Offices empty state */
  .offices-empty {
    background-color: var(--color-accent-yellow);
    border-radius: var(--radius-md);
    padding: var(--space-3xl);
    text-align: center;
  }

  .offices-empty h3 {
    margin-bottom: var(--space-md);
  }

  .offices-empty p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xl);
  }

  .offices-empty__contacts {
    display: flex;
    justify-content: center;
    gap: var(--space-2xl);
    flex-wrap: wrap;
  }

  .offices-empty__phone {
    font-family: var(--font-heading);
    font-size: var(--text-h3);
    font-weight: var(--weight-bold);
    color: var(--color-text-primary);
  }

  .offices-empty__email {
    font-size: var(--text-h4);
    color: var(--color-text-primary);
  }

  /* FAQ */
  .faq-list {
    max-width: 48rem;
  }

  .faq-item {
    border-bottom: 1px solid var(--color-border);
    padding-block: var(--space-lg);
  }

  .faq-item__question {
    cursor: pointer;
    font-size: var(--text-h4);
    font-weight: var(--weight-semibold);
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .faq-item__question::after {
    content: '+';
    font-size: var(--text-h3);
    font-weight: var(--weight-regular);
    color: var(--color-text-secondary);
    transition: transform var(--transition-base);
  }

  .faq-item[open] .faq-item__question::after {
    content: '−';
  }

  .faq-item__answer {
    padding-top: var(--space-md);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  @media (max-width: 767px) {
    .building-hero__grid {
      grid-template-columns: 1fr;
    }

    .location-grid {
      grid-template-columns: 1fr;
    }

    .location-grid__map {
      height: 300px;
    }
  }
</style>
```

**Important:** Create an identical file at `src/pages/buildings/anm/index.astro` but change `'fidel'` to `'anm'` in the `getBuildingBySlug` and `getOfficesByBuilding` calls.

### Step 6.4 — Building Offices Sub-page (`src/pages/buildings/fidel/offices.astro`)

```astro
---
import BuildingLayout from '@layouts/BuildingLayout.astro';
import SectionHeading from '@components/SectionHeading.astro';
import ContactCTA from '@components/ContactCTA.astro';
import { getBuildingBySlug } from '@data/buildings';
import { getOfficesByBuilding } from '@data/offices';
import { contactInfo } from '@data/navigation';

const building = getBuildingBySlug('fidel')!;
const offices = getOfficesByBuilding('fidel');

const title = `Аренда офисов в БЦ ${building.name} — свободные помещения | УК АНМ`;
const description = offices.length > 0
  ? `Свободные офисы в бизнес-центре ${building.name}. Площади от ${Math.min(...offices.map(o => o.area))} до ${Math.max(...offices.map(o => o.area))} м².`
  : `Аренда офисов в бизнес-центре ${building.name}. Свяжитесь с нами для обсуждения вариантов.`;
---

<BuildingLayout
  title={title}
  description={description}
  buildingName={building.name}
  buildingSlug={building.slug}
>
  <section class="section">
    <div class="container">
      <SectionHeading
        title={`Аренда офисов в БЦ ${building.name}`}
        subtitle={offices.length > 0
          ? `${offices.length} помещений доступно для аренды`
          : 'Свободных помещений нет'
        }
      />

      {offices.length > 0 ? (
        <div id="building-office-filter-root" data-building={building.slug}>
          <!-- OfficeFilter React island scoped to this building -->
          <noscript>
            <p>Для просмотра доступных офисов включите JavaScript или свяжитесь с нами по телефону {contactInfo.phone}.</p>
          </noscript>
        </div>
      ) : (
        <div class="offices-empty">
          <div class="offices-empty__content">
            <h3>В данный момент свободных помещений нет</h3>
            <p>Обратитесь с запросом — мы подберём подходящий вариант.</p>
            <div class="offices-empty__contacts">
              <a href={contactInfo.commercialHref} class="offices-empty__phone">{contactInfo.commercial}</a>
              <a href={contactInfo.emailHref} class="offices-empty__email">{contactInfo.email}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  </section>

  <ContactCTA />
</BuildingLayout>

<style>
  .offices-empty {
    background-color: var(--color-accent-yellow);
    border-radius: var(--radius-md);
    padding: var(--space-3xl);
    text-align: center;
  }

  .offices-empty h3 {
    margin-bottom: var(--space-md);
  }

  .offices-empty p {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xl);
  }

  .offices-empty__contacts {
    display: flex;
    justify-content: center;
    gap: var(--space-2xl);
    flex-wrap: wrap;
  }

  .offices-empty__phone {
    font-family: var(--font-heading);
    font-size: var(--text-h3);
    font-weight: var(--weight-bold);
    color: var(--color-text-primary);
  }

  .offices-empty__email {
    font-size: var(--text-h4);
    color: var(--color-text-primary);
  }
</style>
```

Create the same file for ANM at `src/pages/buildings/anm/offices.astro` (change `'fidel'` to `'anm'`).

### Step 6.5 — Building Infrastructure Sub-page (`src/pages/buildings/fidel/infrastructure.astro`)

```astro
---
import BuildingLayout from '@layouts/BuildingLayout.astro';
import SectionHeading from '@components/SectionHeading.astro';
import FacilityCard from '@components/FacilityCard.astro';
import ContactCTA from '@components/ContactCTA.astro';
import { getBuildingBySlug } from '@data/buildings';

const building = getBuildingBySlug('fidel')!;

const title = `Инфраструктура БЦ ${building.name} — услуги и сервисы | УК АНМ`;
const description = `Инфраструктура бизнес-центра ${building.name}: кафе, парковка, охрана, клининг и другие услуги на территории.`;
---

<BuildingLayout
  title={title}
  description={description}
  buildingName={building.name}
  buildingSlug={building.slug}
>
  <section class="section">
    <div class="container">
      <SectionHeading
        title={`Инфраструктура БЦ ${building.name}`}
        subtitle="Всё необходимое для комфортной работы на территории"
      />
      <div class="grid grid--3">
        {building.infrastructure.map((item) => (
          <FacilityCard
            name={item.name}
            description={item.description}
            image={item.image}
            imageAlt={item.imageAlt}
          />
        ))}
      </div>
    </div>
  </section>

  <ContactCTA />
</BuildingLayout>
```

Create the same for ANM at `src/pages/buildings/anm/infrastructure.astro`.

### Step 6.6 — Building How-to-Get Sub-page (`src/pages/buildings/fidel/how-to-get.astro`)

```astro
---
import BuildingLayout from '@layouts/BuildingLayout.astro';
import SectionHeading from '@components/SectionHeading.astro';
import ContactCTA from '@components/ContactCTA.astro';
import { getBuildingBySlug } from '@data/buildings';

const building = getBuildingBySlug('fidel')!;

const title = `Как добраться до БЦ ${building.name} — схема проезда | УК АНМ`;
const description = `Как добраться до бизнес-центра ${building.name}. Метро ${building.metro[0].name} — ${building.metro[0].walkingMinutes} мин пешком. Схема проезда на автомобиле.`;
---

<BuildingLayout
  title={title}
  description={description}
  buildingName={building.name}
  buildingSlug={building.slug}
>
  <section class="section">
    <div class="container">
      <SectionHeading
        title={`Как добраться до БЦ ${building.name}`}
        subtitle={building.address}
      />

      <div class="how-to-get-grid">
        <!-- Left: directions -->
        <div class="how-to-get-grid__info">
          <div class="direction-block">
            <h3>На метро</h3>
            {building.metro.map((m) => (
              <div class="direction-item">
                <span class="direction-dot" style={`background-color: ${m.lineColor}`}></span>
                <div>
                  <strong>{m.name}</strong>
                  <span class="text-caption"> — {m.line}</span>
                  <p class="text-caption">{m.walkingMinutes} минут пешком от станции</p>
                </div>
              </div>
            ))}
            <p class="direction-detail">
              Выйдите из метро, поверните направо и идите по Пр. Обуховской Обороны в сторону увеличения нумерации домов. Через 5 минут вы увидите вход на территорию бизнес-центра.
            </p>
          </div>

          <div class="direction-block">
            <h3>На автомобиле</h3>
            <div class="direction-item">
              <strong>От Невского проспекта</strong>
              <p class="text-caption">~5 минут. Двигайтесь по Невскому проспекту в сторону Александро-Невской Лавры, далее по Пр. Обуховской Обороны.</p>
            </div>
            <div class="direction-item">
              <strong>От КАД</strong>
              <p class="text-caption">~10 минут. Съезд на Пр. Обуховской Обороны.</p>
            </div>
          </div>

          <div class="direction-block">
            <h3>Парковка</h3>
            <p>Закрытая охраняемая парковка на 500 автомобилей. Въезд со стороны Пр. Обуховской Обороны. Также доступна крытая велопарковка на 50 мест.</p>
          </div>
        </div>

        <!-- Right: map -->
        <div class="how-to-get-grid__map" id="directions-map">
          <div class="map-section__placeholder">
            <p>Загрузка карты...</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ContactCTA />
</BuildingLayout>

<style>
  .how-to-get-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: var(--space-2xl);
  }

  .direction-block {
    margin-bottom: var(--space-2xl);
  }

  .direction-block h3 {
    margin-bottom: var(--space-md);
  }

  .direction-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
  }

  .direction-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .direction-detail {
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin-top: var(--space-md);
  }

  .how-to-get-grid__map {
    height: 500px;
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--color-surface-cream);
    position: sticky;
    top: 8rem;
  }

  @media (max-width: 767px) {
    .how-to-get-grid {
      grid-template-columns: 1fr;
    }

    .how-to-get-grid__map {
      height: 350px;
      position: static;
    }
  }
</style>
```

Create the same for ANM at `src/pages/buildings/anm/how-to-get.astro`.

### Step 6.7 — About Company Page (`src/pages/about.astro`)

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Breadcrumbs from '@components/Breadcrumbs.astro';
import SectionHeading from '@components/SectionHeading.astro';
import StatsRow from '@components/StatsRow.astro';
import FeatureBlock from '@components/FeatureBlock.astro';
import ContactCTA from '@components/ContactCTA.astro';

const title = 'О компании УК АНМ — управляющая компания в Санкт-Петербурге';
const description = 'УК АНМ — девелоперская компания с 15-летним опытом. Редевелопмент промышленных территорий, управление бизнес-центрами в СПб.';

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'О компании' },
];

const companyStats = [
  { value: '15+', label: 'лет на рынке' },
  { value: '22 000', label: 'м² под управлением', unit: 'м²' },
  { value: '100+', label: 'арендаторов' },
];

const historyEvents = [
  { year: '2008', title: 'Основание компании', description: 'Создание управляющей компании «Александро-Невская Мануфактура» для редевелопмента промышленной территории на Пр. Обуховской Обороны.' },
  { year: '2010', title: 'Начало реконструкции', description: 'Старт масштабной реконструкции промышленных зданий по концепции британского архитектурного бюро Horan Keoghan Ryan Limited.' },
  { year: '2012', title: 'Открытие БЦ Фидель', description: 'Ввод в эксплуатацию бизнес-лофта «Фидель» класса B+ — первого объекта на территории.' },
  { year: '2015', title: 'Развитие инфраструктуры', description: 'Создание полноценной инфраструктуры территории: кафе, парковка, зона отдыха на набережной Невы.' },
  { year: '2023', title: 'Расширение', description: 'Запуск новых площадей и модернизация инженерных систем.' },
  { year: '2026', title: 'Новый проект', description: 'Начало нового этапа развития территории Александро-Невской Мануфактуры.' },
];

const managementBlocks = [
  {
    title: 'Европейский уровень обслуживания',
    description: 'Профессиональная служба эксплуатации обеспечивает высокий уровень комфорта для арендаторов. Круглосуточная поддержка, оперативное решение вопросов, индивидуальный подход к каждому клиенту.',
    image: '/images/infrastructure/reception.jpg',
    imageAlt: 'Ресепшн управляющей компании АНМ',
  },
  {
    title: 'Инженерные решения',
    description: 'Современные инженерные системы обеспечивают надёжность и энергоэффективность. Электроснабжение II категории, централизованное кондиционирование, собственная газовая котельная, 6 телеком-операторов.',
    image: '/images/buildings/fidel/exterior-2.jpg',
    imageAlt: 'Инженерные системы бизнес-центров АНМ',
  },
  {
    title: 'Редевелопмент промышленных территорий',
    description: 'Наша экспертиза — трансформация бывших промышленных зданий в современные бизнес-пространства. Мы сохраняем характер исторических зданий, наполняя их современными технологиями и комфортом.',
    image: '/images/about/territory-aerial.jpg',
    imageAlt: 'Территория Александро-Невской Мануфактуры с высоты',
  },
];
---

<BaseLayout title={title} description={description}>
  <Breadcrumbs items={breadcrumbs} />

  <!-- ===== SECTION 1: COMPANY HERO ===== -->
  <section class="about-hero section">
    <div class="container">
      <div class="about-hero__grid">
        <div class="about-hero__text">
          <h1 class="about-hero__name text-display">Александро-Невская Мануфактура</h1>
          <p class="about-hero__tagline">Управляющая компания. Создаём качественные бизнес-пространства в Санкт-Петербурге.</p>
          <StatsRow stats={companyStats} />
        </div>
        <div class="about-hero__image-wrap">
          <img src="/images/about/territory-panorama.jpg" alt="Панорама территории Александро-Невской Мануфактуры" class="about-hero__image" loading="eager" />
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 2: COMPANY DESCRIPTION ===== -->
  <section class="section section--cream">
    <div class="container about-description">
      <h2>О компании</h2>
      <p>
        УК АНМ — девелоперская и управляющая компания, работающая на рынке коммерческой недвижимости Санкт-Петербурга более 15 лет. Наша миссия — создание комфортной среды для бизнес-сообщества через редевелопмент промышленных территорий.
      </p>
      <p>
        Основной проект компании — развитие и управление территорией бывшей промышленной зоны на Проспекте Обуховской Обороны. Концепция редевелопмента разработана британским архитектурным бюро Horan Keoghan Ryan Limited и предусматривает превращение исторических промышленных зданий в современные бизнес-центры с сохранением их уникального характера.
      </p>
      <p>
        Сегодня на территории Александро-Невской Мануфактуры работают бизнес-центры класса B+, обеспечивающие арендаторам все уровни комфорта: от современных инженерных систем до развитой инфраструктуры и прогулочной зоны на набережной Невы.
      </p>
    </div>
  </section>

  <!-- ===== SECTION 3: HISTORY ===== -->
  <section class="section" id="history">
    <div class="container">
      <SectionHeading title="История компании" subtitle="Ключевые этапы развития" />
      <div class="timeline">
        {historyEvents.map((event, index) => (
          <div class:list={['timeline__item', { 'timeline__item--right': index % 2 !== 0 }]}>
            <div class="timeline__year">{event.year}</div>
            <div class="timeline__content">
              <h3 class="timeline__title">{event.title}</h3>
              <p class="timeline__desc">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- ===== SECTION 4: MANAGEMENT APPROACH ===== -->
  <section class="section section--cream">
    <div class="container">
      <SectionHeading title="Наш подход" subtitle="Принципы работы управляющей компании" />
      {managementBlocks.map((block, index) => (
        <FeatureBlock
          title={block.title}
          description={block.description}
          image={block.image}
          imageAlt={block.imageAlt}
          reversed={index % 2 !== 0}
        />
      ))}
    </div>
  </section>

  <!-- ===== SECTION 5: NEW PROJECT TEASER ===== -->
  <section class="section section--yellow" id="new-project">
    <div class="container new-project">
      <h2>Новый проект</h2>
      <p>
        В 2026 году начинается новый этап развития территории Александро-Невской Мануфактуры. Следите за обновлениями на нашем сайте.
      </p>
      <a href="/contacts/" class="btn btn--dark">Узнать подробности</a>
    </div>
  </section>

  <!-- ===== SECTION 6: CONTACT CTA ===== -->
  <ContactCTA />
</BaseLayout>

<style>
  .about-hero__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    align-items: center;
  }

  .about-hero__name {
    margin-bottom: var(--space-lg);
  }

  .about-hero__tagline {
    font-size: var(--text-h3);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-2xl);
    max-width: 28rem;
  }

  .about-hero__image-wrap {
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .about-hero__image {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .about-description {
    max-width: 48rem;
  }

  .about-description h2 {
    margin-bottom: var(--space-xl);
  }

  .about-description p {
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
  }

  /* Timeline */
  .timeline {
    position: relative;
    max-width: 48rem;
    margin-inline: auto;
    padding-left: var(--space-3xl);
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--color-primary);
  }

  .timeline__item {
    position: relative;
    padding-bottom: var(--space-2xl);
    padding-left: var(--space-xl);
  }

  .timeline__item::before {
    content: '';
    position: absolute;
    left: calc(-1 * var(--space-3xl) - 5px);
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--color-primary);
  }

  .timeline__year {
    font-family: var(--font-heading);
    font-size: var(--text-h2);
    font-weight: var(--weight-bold);
    color: var(--color-primary);
    margin-bottom: var(--space-sm);
  }

  .timeline__title {
    margin-bottom: var(--space-sm);
  }

  .timeline__desc {
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  /* New project */
  .new-project {
    text-align: center;
    max-width: 36rem;
    margin-inline: auto;
  }

  .new-project h2 {
    margin-bottom: var(--space-lg);
  }

  .new-project p {
    margin-bottom: var(--space-xl);
    line-height: var(--leading-relaxed);
  }

  @media (max-width: 767px) {
    .about-hero__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### Step 6.8 — Contacts Page (`src/pages/contacts.astro`)

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Breadcrumbs from '@components/Breadcrumbs.astro';
import SectionHeading from '@components/SectionHeading.astro';
import ContactCTA from '@components/ContactCTA.astro';
import { contactInfo } from '@data/navigation';

const title = 'Контакты УК АНМ — телефон, адрес, карта | Аренда офисов СПб';
const description = 'Контакты управляющей компании АНМ. Телефон: +7 (812) 313-18-04. Адрес: СПб, Пр. Обуховской Обороны, 70.';

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Контакты' },
];

const departments = [
  {
    name: 'Коммерческий отдел',
    subtitle: 'Аренда офисов',
    phone: contactInfo.commercial,
    phoneHref: contactInfo.commercialHref,
    additionalPhone: contactInfo.phone,
    additionalPhoneHref: contactInfo.phoneHref,
    email: contactInfo.email,
    emailHref: contactInfo.emailHref,
  },
  {
    name: 'Приемная',
    subtitle: 'Общие вопросы',
    phone: contactInfo.reception,
    phoneHref: contactInfo.receptionHref,
    email: contactInfo.email,
    emailHref: contactInfo.emailHref,
  },
];
---

<BaseLayout title={title} description={description}>
  <Breadcrumbs items={breadcrumbs} />

  <!-- ===== SECTION 1: HEADING ===== -->
  <section class="contacts-header section">
    <div class="container">
      <h1 class="contacts-header__title">Хотите задать вопрос или обсудить сотрудничество?</h1>
      <p class="contacts-header__subtitle">Мы готовы помочь. Свяжитесь с нами удобным способом.</p>
    </div>
  </section>

  <!-- ===== SECTION 2: MAP ===== -->
  <section class="contacts-map-section">
    <div id="contacts-map" class="contacts-map">
      <div class="map-section__placeholder">
        <p>Загрузка карты...</p>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 3: CONTACT INFORMATION ===== -->
  <section class="section">
    <div class="container">
      <div class="contacts-grid">
        {departments.map((dept) => (
          <div class="contact-card">
            <h3 class="contact-card__name">{dept.name}</h3>
            <p class="contact-card__subtitle">{dept.subtitle}</p>
            <div class="contact-card__phones">
              <a href={dept.phoneHref} class="contact-card__phone">{dept.phone}</a>
              {dept.additionalPhone && (
                <a href={dept.additionalPhoneHref} class="contact-card__phone">{dept.additionalPhone}</a>
              )}
            </div>
            <a href={dept.emailHref} class="contact-card__email">{dept.email}</a>
          </div>
        ))}

        <div class="contact-card contact-card--address">
          <h3 class="contact-card__name">Адрес</h3>
          <p class="contact-card__address">{contactInfo.address}</p>
          <p class="contact-card__hours">Круглосуточный доступ</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECTION 4: REQUISITES ===== -->
  <section class="section section--cream" id="requisites">
    <div class="container">
      <details class="requisites">
        <summary class="requisites__summary">
          <h2 class="requisites__heading">Реквизиты</h2>
          <span class="requisites__toggle">Показать</span>
        </summary>
        <div class="requisites__content">
          <div class="requisites__grid">
            <div class="requisites__item">
              <span class="requisites__label">Полное наименование</span>
              <span class="requisites__value">ООО «Управляющая компания «Александро-Невская Мануфактура»</span>
            </div>
            <div class="requisites__item">
              <span class="requisites__label">ИНН</span>
              <span class="requisites__value">7811XXXXXXX</span>
            </div>
            <div class="requisites__item">
              <span class="requisites__label">КПП</span>
              <span class="requisites__value">7811XXXXX</span>
            </div>
            <div class="requisites__item">
              <span class="requisites__label">ОГРН</span>
              <span class="requisites__value">1XXXXXXXXXXXX</span>
            </div>
            <div class="requisites__item">
              <span class="requisites__label">Юридический адрес</span>
              <span class="requisites__value">{contactInfo.address}</span>
            </div>
          </div>
          <p class="text-caption" style="margin-top: var(--space-lg);">
            Полные банковские реквизиты предоставляются по запросу. <a href="/legal/">Подробнее</a>
          </p>
        </div>
      </details>
    </div>
  </section>

  <!-- ===== SECTION 5: CTA ===== -->
  <ContactCTA />
</BaseLayout>

<style>
  .contacts-header {
    padding-bottom: var(--space-xl);
  }

  .contacts-header__title {
    font-size: var(--text-h1);
    max-width: 36rem;
    margin-bottom: var(--space-md);
  }

  .contacts-header__subtitle {
    font-size: var(--text-h4);
    color: var(--color-text-secondary);
  }

  .contacts-map-section {
    width: 100%;
  }

  .contacts-map {
    width: 100%;
    height: 450px;
    background-color: var(--color-surface-cream);
  }

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2xl);
  }

  .contact-card {
    padding: var(--space-xl);
    background-color: var(--color-surface-cream);
    border-radius: var(--radius-md);
  }

  .contact-card__name {
    margin-bottom: var(--space-xs);
  }

  .contact-card__subtitle {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-lg);
  }

  .contact-card__phones {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .contact-card__phone {
    font-family: var(--font-heading);
    font-size: var(--text-h3);
    font-weight: var(--weight-bold);
    color: var(--color-text-primary);
  }

  .contact-card__phone:hover {
    color: var(--color-primary);
  }

  .contact-card__email {
    color: var(--color-primary);
    font-weight: var(--weight-medium);
  }

  .contact-card__address {
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-md);
  }

  .contact-card__hours {
    font-size: var(--text-caption);
    color: var(--color-text-secondary);
  }

  /* Requisites */
  .requisites__summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    list-style: none;
  }

  .requisites__summary::-webkit-details-marker {
    display: none;
  }

  .requisites__heading {
    margin: 0;
  }

  .requisites__toggle {
    font-size: var(--text-caption);
    color: var(--color-primary);
    font-weight: var(--weight-medium);
  }

  .requisites[open] .requisites__toggle {
    display: none;
  }

  .requisites__content {
    margin-top: var(--space-xl);
  }

  .requisites__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }

  .requisites__item {
    display: flex;
    flex-direction: column;
  }

  .requisites__label {
    font-size: var(--text-small);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-xs);
  }

  .requisites__value {
    font-weight: var(--weight-medium);
  }

  @media (max-width: 767px) {
    .contacts-grid {
      grid-template-columns: 1fr;
    }

    .contacts-map {
      height: 300px;
    }

    .requisites__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

### Step 6.9 — Legal / Disclosure Page (`src/pages/legal.astro`)

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Breadcrumbs from '@components/Breadcrumbs.astro';
import { contactInfo } from '@data/navigation';

const title = 'Раскрытие информации — УК АНМ';
const description = 'Юридическая информация, реквизиты и раскрытие информации управляющей компании АНМ.';

const breadcrumbs = [
  { label: 'Главная', href: '/' },
  { label: 'Раскрытие информации' },
];
---

<BaseLayout title={title} description={description}>
  <Breadcrumbs items={breadcrumbs} />

  <section class="section legal-page">
    <div class="container legal-content">
      <h1>Раскрытие информации</h1>

      <h2>Общие сведения</h2>
      <p>
        ООО «Управляющая компания «Александро-Невская Мануфактура» осуществляет деятельность по управлению коммерческой недвижимостью на территории Санкт-Петербурга.
      </p>

      <h2 id="requisites">Реквизиты</h2>
      <table class="legal-table">
        <tbody>
          <tr>
            <td>Полное наименование</td>
            <td>ООО «Управляющая компания «Александро-Невская Мануфактура»</td>
          </tr>
          <tr>
            <td>Сокращённое наименование</td>
            <td>ООО «УК АНМ»</td>
          </tr>
          <tr>
            <td>ИНН</td>
            <td>7811XXXXXXX</td>
          </tr>
          <tr>
            <td>КПП</td>
            <td>7811XXXXX</td>
          </tr>
          <tr>
            <td>ОГРН</td>
            <td>1XXXXXXXXXXXX</td>
          </tr>
          <tr>
            <td>Юридический адрес</td>
            <td>{contactInfo.address}</td>
          </tr>
          <tr>
            <td>Телефон</td>
            <td><a href={contactInfo.phoneHref}>{contactInfo.phone}</a></td>
          </tr>
          <tr>
            <td>Email</td>
            <td><a href={contactInfo.emailHref}>{contactInfo.email}</a></td>
          </tr>
        </tbody>
      </table>

      <h2>Политика конфиденциальности</h2>
      <p>
        Настоящий сайт не собирает персональные данные посетителей. На сайте отсутствуют формы сбора персональных данных, системы авторизации и личные кабинеты. Все контактные данные, размещённые на сайте, являются публичными контактами компании.
      </p>

      <h2>Правовая информация</h2>
      <p>
        Информация, размещённая на данном сайте, носит информационный характер и не является публичной офертой. Для получения актуальных условий аренды обращайтесь в коммерческий отдел по телефону <a href={contactInfo.commercialHref}>{contactInfo.commercial}</a>.
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .legal-content {
    max-width: 48rem;
  }

  .legal-content h1 {
    margin-bottom: var(--space-2xl);
  }

  .legal-content h2 {
    margin-top: var(--space-2xl);
    margin-bottom: var(--space-md);
  }

  .legal-content p {
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  .legal-table {
    width: 100%;
    border-collapse: collapse;
    margin-block: var(--space-lg);
  }

  .legal-table td {
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-border);
    vertical-align: top;
  }

  .legal-table td:first-child {
    font-weight: var(--weight-medium);
    white-space: nowrap;
    width: 40%;
    color: var(--color-text-secondary);
  }

  @media (max-width: 767px) {
    .legal-table td:first-child {
      white-space: normal;
    }
  }
</style>
```

At this point, all static pages are complete. Every page uses the BaseLayout or BuildingLayout, includes proper breadcrumbs, SEO meta tags, and the ContactCTA component. Verify the build compiles:

```bash
pnpm run build
```

Fix any import errors before proceeding to the dynamic islands.

---

## 7. Dynamic Islands (React Components)

Astro renders the entire site as static HTML. The following React components are "islands" — they are hydrated on the client side only when needed. Each island is wrapped in an Astro component that uses the `client:visible` or `client:load` directive.

### Step 7.1 — Create `src/components/islands/OfficeCard.tsx`

This is a presentational React component used inside the OfficeFilter. It renders a single office listing card.

```tsx
import React from 'react';

interface OfficeCardProps {
  id: string;
  buildingName: string;
  area: number;
  floor: number;
  classRating: string;
  type: 'cabinet' | 'open-space';
  address: string;
  pricePerSqm: number;
  totalPrice: number;
  photoCount: number;
}

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function OfficeCard({
  buildingName,
  area,
  floor,
  classRating,
  type,
  address,
  pricePerSqm,
  totalPrice,
  photoCount,
}: OfficeCardProps) {
  const typeLabel = type === 'cabinet' ? 'Кабинет' : 'Открытое пространство';

  return (
    <div className="office-card">
      <div className="office-card__header">
        <span className="office-card__building">{buildingName}</span>
        <span className="office-card__class">{classRating}</span>
      </div>

      <div className="office-card__stats">
        <div className="office-card__stat">
          <span className="office-card__stat-value">{formatNumber(area)}</span>
          <span className="office-card__stat-unit">м²</span>
        </div>
        <div className="office-card__stat">
          <span className="office-card__stat-value">{floor}</span>
          <span className="office-card__stat-label">этаж</span>
        </div>
      </div>

      <div className="office-card__meta">
        <span className="office-card__type">{typeLabel}</span>
        <span className="office-card__address">{address}</span>
      </div>

      <div className="office-card__pricing">
        <div className="office-card__price-main">
          <span className="office-card__price-value">{formatNumber(pricePerSqm)}</span>
          <span className="office-card__price-unit">₽/м² в месяц</span>
        </div>
        <div className="office-card__price-total">
          <span>{formatNumber(totalPrice)} ₽/мес</span>
        </div>
      </div>

      {photoCount > 0 && (
        <div className="office-card__photos">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 3H2a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zm-1 8H3l2.5-4 2 2.5L10 7l3 4z"/>
          </svg>
          <span>{photoCount} фото</span>
        </div>
      )}
    </div>
  );
}
```

### Step 7.2 — Create `src/components/islands/OfficeFilter.tsx`

This is the main interactive component. It loads office data from `/data/offices.json`, provides filter controls, and renders filtered results using `OfficeCard`.

```tsx
import React, { useState, useEffect, useMemo } from 'react';
import OfficeCard from './OfficeCard';

interface Office {
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

interface OfficeFilterProps {
  /** If set, only show offices for this building slug */
  buildingSlug?: string;
  /** Contact phone for empty state */
  contactPhone?: string;
  /** Contact email for empty state */
  contactEmail?: string;
}

export default function OfficeFilter({
  buildingSlug,
  contactPhone = '+7 (812) 336-55-64',
  contactEmail = 'mail@ukanm.ru',
}: OfficeFilterProps) {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [areaMin, setAreaMin] = useState<number>(0);
  const [areaMax, setAreaMax] = useState<number>(1000);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Load data
  useEffect(() => {
    fetch('/data/offices.json')
      .then((res) => res.json())
      .then((data: Office[]) => {
        const available = data.filter((o) => o.available);
        // If scoped to a building, pre-filter
        const scoped = buildingSlug
          ? available.filter((o) => o.buildingSlug === buildingSlug)
          : available;
        setOffices(scoped);

        // Set initial range bounds from data
        if (scoped.length > 0) {
          setAreaMin(Math.min(...scoped.map((o) => o.area)));
          setAreaMax(Math.max(...scoped.map((o) => o.area)));
          setPriceMin(Math.min(...scoped.map((o) => o.pricePerSqm)));
          setPriceMax(Math.max(...scoped.map((o) => o.pricePerSqm)));
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [buildingSlug]);

  // Derived data
  const buildingOptions = useMemo(() => {
    const slugs = [...new Set(offices.map((o) => o.buildingSlug))];
    return slugs.map((slug) => ({
      slug,
      name: offices.find((o) => o.buildingSlug === slug)?.buildingName || slug,
    }));
  }, [offices]);

  const floorOptions = useMemo(() => {
    const floors = [...new Set(offices.map((o) => o.floor))].sort((a, b) => a - b);
    return floors;
  }, [offices]);

  const dataAreaMin = useMemo(() => offices.length > 0 ? Math.min(...offices.map((o) => o.area)) : 0, [offices]);
  const dataAreaMax = useMemo(() => offices.length > 0 ? Math.max(...offices.map((o) => o.area)) : 1000, [offices]);
  const dataPriceMin = useMemo(() => offices.length > 0 ? Math.min(...offices.map((o) => o.pricePerSqm)) : 0, [offices]);
  const dataPriceMax = useMemo(() => offices.length > 0 ? Math.max(...offices.map((o) => o.pricePerSqm)) : 5000, [offices]);

  // Filtered results
  const filteredOffices = useMemo(() => {
    return offices.filter((o) => {
      if (selectedBuilding !== 'all' && o.buildingSlug !== selectedBuilding) return false;
      if (selectedFloors.length > 0 && !selectedFloors.includes(o.floor)) return false;
      if (o.area < areaMin || o.area > areaMax) return false;
      if (o.pricePerSqm < priceMin || o.pricePerSqm > priceMax) return false;
      if (selectedType !== 'all' && o.type !== selectedType) return false;
      return true;
    });
  }, [offices, selectedBuilding, selectedFloors, areaMin, areaMax, priceMin, priceMax, selectedType]);

  const toggleFloor = (floor: number) => {
    setSelectedFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };

  if (loading) {
    return <div className="office-filter__loading">Загрузка предложений...</div>;
  }

  if (offices.length === 0) {
    return (
      <div className="office-filter__empty">
        <h3>Свободных помещений нет</h3>
        <p>Свяжитесь с нами для обсуждения вариантов</p>
        <div className="office-filter__empty-contacts">
          <a href={`tel:${contactPhone.replace(/[\s()-]/g, '')}`} className="office-filter__empty-phone">
            {contactPhone}
          </a>
          <a href={`mailto:${contactEmail}`} className="office-filter__empty-email">
            {contactEmail}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="office-filter">
      {/* ── Filter controls ── */}
      <div className="office-filter__controls">
        {/* Building filter (only if not scoped to a single building) */}
        {!buildingSlug && buildingOptions.length > 1 && (
          <div className="office-filter__group">
            <label className="office-filter__label">Бизнес-центр</label>
            <div className="office-filter__toggles">
              <button
                className={`office-filter__toggle ${selectedBuilding === 'all' ? 'office-filter__toggle--active' : ''}`}
                onClick={() => setSelectedBuilding('all')}
              >
                Все
              </button>
              {buildingOptions.map((b) => (
                <button
                  key={b.slug}
                  className={`office-filter__toggle ${selectedBuilding === b.slug ? 'office-filter__toggle--active' : ''}`}
                  onClick={() => setSelectedBuilding(b.slug)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floor filter */}
        <div className="office-filter__group">
          <label className="office-filter__label">Этаж</label>
          <div className="office-filter__toggles">
            {floorOptions.map((floor) => (
              <button
                key={floor}
                className={`office-filter__toggle ${selectedFloors.includes(floor) ? 'office-filter__toggle--active' : ''}`}
                onClick={() => toggleFloor(floor)}
              >
                {floor}
              </button>
            ))}
          </div>
        </div>

        {/* Area range */}
        <div className="office-filter__group">
          <label className="office-filter__label">Площадь, м²</label>
          <div className="office-filter__range">
            <input
              type="number"
              className="office-filter__input"
              value={areaMin}
              min={dataAreaMin}
              max={dataAreaMax}
              onChange={(e) => setAreaMin(Number(e.target.value))}
              placeholder="от"
            />
            <span className="office-filter__range-sep">—</span>
            <input
              type="number"
              className="office-filter__input"
              value={areaMax}
              min={dataAreaMin}
              max={dataAreaMax}
              onChange={(e) => setAreaMax(Number(e.target.value))}
              placeholder="до"
            />
          </div>
        </div>

        {/* Price range */}
        <div className="office-filter__group">
          <label className="office-filter__label">Цена, ₽/м²</label>
          <div className="office-filter__range">
            <input
              type="number"
              className="office-filter__input"
              value={priceMin}
              min={dataPriceMin}
              max={dataPriceMax}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              placeholder="от"
            />
            <span className="office-filter__range-sep">—</span>
            <input
              type="number"
              className="office-filter__input"
              value={priceMax}
              min={dataPriceMin}
              max={dataPriceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              placeholder="до"
            />
          </div>
        </div>

        {/* Type filter */}
        <div className="office-filter__group">
          <label className="office-filter__label">Тип</label>
          <div className="office-filter__toggles">
            <button
              className={`office-filter__toggle ${selectedType === 'all' ? 'office-filter__toggle--active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              Все
            </button>
            <button
              className={`office-filter__toggle ${selectedType === 'cabinet' ? 'office-filter__toggle--active' : ''}`}
              onClick={() => setSelectedType('cabinet')}
            >
              Кабинет
            </button>
            <button
              className={`office-filter__toggle ${selectedType === 'open-space' ? 'office-filter__toggle--active' : ''}`}
              onClick={() => setSelectedType('open-space')}
            >
              Open Space
            </button>
          </div>
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="office-filter__results-count">
        Найдено: <strong>{filteredOffices.length}</strong> {filteredOffices.length === 1 ? 'помещение' : 'помещений'}
      </div>

      {/* ── Results grid ── */}
      {filteredOffices.length > 0 ? (
        <div className="office-filter__grid">
          {filteredOffices.map((office) => (
            <OfficeCard
              key={office.id}
              id={office.id}
              buildingName={office.buildingName}
              area={office.area}
              floor={office.floor}
              classRating={office.class}
              type={office.type}
              address={office.address}
              pricePerSqm={office.pricePerSqm}
              totalPrice={office.totalPrice}
              photoCount={office.photos.length}
            />
          ))}
        </div>
      ) : (
        <div className="office-filter__no-results">
          <p>По выбранным фильтрам помещений не найдено.</p>
          <p>Попробуйте изменить параметры поиска или свяжитесь с нами:</p>
          <a href={`tel:${contactPhone.replace(/[\s()-]/g, '')}`}>{contactPhone}</a>
        </div>
      )}
    </div>
  );
}
```

### Step 7.3 — Create `src/components/islands/OfficeFilter.css`

Create a CSS file for the OfficeFilter styles. Import it in the Astro wrapper (Step 7.7).

```css
.office-filter__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: var(--color-surface-white, #fff);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.office-filter__group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.office-filter__label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b6b6b;
}

.office-filter__toggles {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.office-filter__toggle {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.office-filter__toggle:hover {
  border-color: #B71C1C;
  color: #B71C1C;
}

.office-filter__toggle--active {
  background-color: #B71C1C;
  border-color: #B71C1C;
  color: #fff;
}

.office-filter__range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.office-filter__input {
  width: 6rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  font-family: inherit;
}

.office-filter__input:focus {
  outline: none;
  border-color: #B71C1C;
}

.office-filter__range-sep {
  color: #6b6b6b;
}

.office-filter__results-count {
  font-size: 0.875rem;
  color: #6b6b6b;
  margin-bottom: 1rem;
}

.office-filter__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.5rem;
}

.office-filter__no-results {
  text-align: center;
  padding: 3rem;
  background-color: #F5F0E8;
  border-radius: 0.5rem;
  color: #6b6b6b;
}

.office-filter__no-results a {
  color: #B71C1C;
  font-weight: 600;
  font-size: 1.25rem;
}

.office-filter__empty {
  text-align: center;
  padding: 3rem;
  background-color: #F5D45E;
  border-radius: 0.5rem;
}

.office-filter__empty h3 {
  margin-bottom: 0.5rem;
}

.office-filter__empty p {
  color: #6b6b6b;
  margin-bottom: 1.5rem;
}

.office-filter__empty-contacts {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.office-filter__empty-phone {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
}

.office-filter__empty-email {
  font-size: 1.125rem;
  color: #1a1a1a;
  text-decoration: none;
}

.office-filter__loading {
  text-align: center;
  padding: 3rem;
  color: #6b6b6b;
}

/* Office Card styles */
.office-card {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background: #fff;
  transition: box-shadow 250ms ease-out;
}

.office-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.office-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.office-card__building {
  font-weight: 700;
  font-size: 1rem;
}

.office-card__class {
  font-size: 0.75rem;
  font-weight: 700;
  color: #B71C1C;
  padding: 0.25rem 0.5rem;
  border: 1px solid #B71C1C;
  border-radius: 0.25rem;
}

.office-card__stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.office-card__stat {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.office-card__stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.office-card__stat-unit,
.office-card__stat-label {
  font-size: 0.75rem;
  color: #6b6b6b;
}

.office-card__meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b6b6b;
}

.office-card__pricing {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.office-card__price-main {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.office-card__price-value {
  font-size: 1.25rem;
  font-weight: 700;
}

.office-card__price-unit {
  font-size: 0.75rem;
  color: #6b6b6b;
}

.office-card__price-total {
  font-size: 0.875rem;
  color: #6b6b6b;
}

.office-card__photos {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: #6b6b6b;
}

@media (max-width: 767px) {
  .office-filter__controls {
    flex-direction: column;
  }

  .office-filter__grid {
    grid-template-columns: 1fr;
  }
}
```

### Step 7.4 — Create `src/components/islands/InteractiveMap.tsx`

This component wraps the Yandex Maps API. It renders a map with custom markers for each building.

```tsx
import React, { useEffect, useRef, useState } from 'react';

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  address: string;
  href: string;
}

interface InteractiveMapProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function InteractiveMap({
  markers,
  center,
  zoom = 15,
  height = '100%',
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Calculate center from markers if not provided
  const mapCenter = center || (markers.length > 0
    ? {
        lat: markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
        lng: markers.reduce((sum, m) => sum + m.lng, 0) / markers.length,
      }
    : { lat: 59.9075, lng: 30.4267 });

  useEffect(() => {
    // Load Yandex Maps API script if not already loaded
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(() => setMapLoaded(true));
      };
      document.head.appendChild(script);
    } else {
      window.ymaps.ready(() => setMapLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = new window.ymaps.Map(mapRef.current, {
      center: [mapCenter.lat, mapCenter.lng],
      zoom: zoom,
      controls: ['zoomControl', 'fullscreenControl'],
    });

    // Add markers
    markers.forEach((marker) => {
      const placemark = new window.ymaps.Placemark(
        [marker.lat, marker.lng],
        {
          balloonContentHeader: `<strong>${marker.title}</strong>`,
          balloonContentBody: `
            <p>${marker.address}</p>
            <a href="${marker.href}" style="color: #B71C1C; font-weight: 600;">Подробнее</a>
          `,
          hintContent: marker.title,
        },
        {
          preset: 'islands#redDotIcon',
        }
      );
      map.geoObjects.add(placemark);
    });

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      map.setBounds(map.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 50,
      });
    }

    return () => {
      map.destroy();
    };
  }, [mapLoaded, markers, mapCenter, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height, minHeight: '300px' }}
    >
      {!mapLoaded && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#6b6b6b',
          fontSize: '0.875rem',
        }}>
          Загрузка карты...
        </div>
      )}
    </div>
  );
}
```

> **Important:** Replace `YOUR_API_KEY` with a valid Yandex Maps JavaScript API key. Obtain one at [developer.tech.yandex.ru](https://developer.tech.yandex.ru/).

### Step 7.5 — Create `src/components/islands/PhotoGallery.tsx`

A photo gallery with thumbnails and lightbox functionality.

```tsx
import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface PhotoGalleryProps {
  images: { src: string; alt: string }[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openLightbox = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="photo-gallery">
        {images.map((img, i) => (
          <button
            key={i}
            className="photo-gallery__thumb"
            onClick={() => openLightbox(i)}
            aria-label={`Открыть фото: ${img.alt}`}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
      />
    </>
  );
}
```

### Step 7.6 — Create `src/components/islands/PhotoGallery.css`

```css
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 0.75rem;
}

.photo-gallery__thumb {
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden;
  background: none;
  transition: transform 250ms ease-out;
}

.photo-gallery__thumb:hover {
  transform: scale(1.02);
}

.photo-gallery__thumb img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
```

### Step 7.7 — Create Astro Wrapper Components for Islands

Each React island needs a thin Astro wrapper that uses the `client:` directive. Create the following files.

**`src/components/OfficeFilterIsland.astro`**

```astro
---
import OfficeFilter from './islands/OfficeFilter';
import './islands/OfficeFilter.css';

interface Props {
  buildingSlug?: string;
}

const { buildingSlug } = Astro.props;
---

<OfficeFilter
  client:visible
  buildingSlug={buildingSlug}
  contactPhone="+7 (812) 336-55-64"
  contactEmail="mail@ukanm.ru"
/>
```

**`src/components/InteractiveMapIsland.astro`**

```astro
---
import InteractiveMap from './islands/InteractiveMap';

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  address: string;
  href: string;
}

interface Props {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

const { markers, center, zoom, height } = Astro.props;
---

<InteractiveMap
  client:visible
  markers={markers}
  center={center}
  zoom={zoom}
  height={height}
/>
```

**`src/components/PhotoGalleryIsland.astro`**

```astro
---
import PhotoGallery from './islands/PhotoGallery';
import './islands/PhotoGallery.css';

interface Props {
  images: { src: string; alt: string }[];
}

const { images } = Astro.props;
---

<PhotoGallery client:visible images={images} />
```

### Step 7.8 — Update Pages to Use Island Wrappers

Now go back to the page files and replace the placeholder `<div>` elements with the actual island components. Here are the specific changes to make:

**In `src/pages/index.astro`:**

Add these imports at the top of the frontmatter:

```typescript
import OfficeFilterIsland from '@components/OfficeFilterIsland.astro';
import InteractiveMapIsland from '@components/InteractiveMapIsland.astro';
import { buildings } from '@data/buildings';
```

Replace the map placeholder (`<div id="homepage-map">...`) with:

```astro
<InteractiveMapIsland
  markers={buildings.map(b => ({
    lat: b.coordinates.lat,
    lng: b.coordinates.lng,
    title: `БЦ ${b.name}`,
    address: b.shortAddress,
    href: `/buildings/${b.slug}/`,
  }))}
  height="500px"
/>
```

Replace the office filter placeholder (`<div id="office-filter-root">...`) with:

```astro
<OfficeFilterIsland />
```

**In building detail pages (e.g., `src/pages/buildings/fidel/index.astro`):**

Add the island imports and replace the placeholders similarly. For the building-scoped office filter:

```astro
<OfficeFilterIsland buildingSlug="fidel" />
```

For the building map:

```astro
<InteractiveMapIsland
  markers={[{
    lat: building.coordinates.lat,
    lng: building.coordinates.lng,
    title: `БЦ ${building.name}`,
    address: building.shortAddress,
    href: `/buildings/${building.slug}/`,
  }]}
  center={{ lat: building.coordinates.lat, lng: building.coordinates.lng }}
  zoom={16}
  height="400px"
/>
```

**In `src/pages/contacts.astro`:**

Replace the contacts map placeholder with:

```astro
<InteractiveMapIsland
  markers={buildings.map(b => ({
    lat: b.coordinates.lat,
    lng: b.coordinates.lng,
    title: `БЦ ${b.name}`,
    address: b.shortAddress,
    href: `/buildings/${b.slug}/`,
  }))}
  height="450px"
/>
```

---

## 8. Image Assets Pipeline

### Step 8.1 — Download Images from the Existing Site

Images should be sourced from the existing ANM website at `a-n-m.ru`. Use a script to download them:

```bash
# Create a download script
cd anm-website

# Download hero/exterior images from the existing site
# Replace these URLs with actual image URLs from a-n-m.ru
curl -L -o public/images/buildings/fidel/hero.jpg "https://www.a-n-m.ru/path/to/fidel-hero.jpg"
curl -L -o public/images/buildings/fidel/exterior-1.jpg "https://www.a-n-m.ru/path/to/fidel-exterior.jpg"
# ... repeat for all images
```

The agent should visit `https://www.a-n-m.ru/gallery/biznes-centr-fidel/` and download all available photographs. Save them to the corresponding directories under `public/images/`.

### Step 8.2 — Optimize Images

After downloading, use Sharp (already installed as a dependency) to create optimized versions:

```bash
# Astro's built-in image optimization handles this automatically
# when using the <Image> component. For manual optimization:
npx sharp-cli --input public/images/buildings/fidel/hero.jpg \
  --output public/images/buildings/fidel/hero.webp \
  --format webp --quality 80 --width 1920
```

Alternatively, rely on Astro's `<Image>` component which automatically generates optimized WebP versions at build time.

---

## 9. SEO Implementation Checklist

Execute each item in this checklist after all pages are built.

### Step 9.1 — Verify Page Titles and Descriptions

| Page | Expected Title | Expected Description |
|---|---|---|
| `/` | Аренда офисов в бизнес-центрах Санкт-Петербурга — УК АНМ | Офисы в аренду в бизнес-центрах класса B+ в Санкт-Петербурге... |
| `/buildings/fidel/` | Бизнес-центр Фидель — аренда офисов класса B+ \| УК АНМ | Бизнес-центр Фидель на Пр. Обуховской Обороны... |
| `/buildings/fidel/offices/` | Аренда офисов в БЦ Фидель — свободные помещения \| УК АНМ | Свободные офисы в бизнес-центре Фидель... |
| `/about/` | О компании УК АНМ — управляющая компания в Санкт-Петербурге | УК АНМ — девелоперская компания с 15-летним опытом... |
| `/contacts/` | Контакты УК АНМ — телефон, адрес, карта \| Аренда офисов СПб | Контакты управляющей компании АНМ... |
| `/legal/` | Раскрытие информации — УК АНМ | Юридическая информация, реквизиты... |

### Step 9.2 — Verify Heading Hierarchy

Run through every page and confirm:

1. Each page has exactly **one `<h1>`** tag.
2. The homepage H1 is **"Офисы в аренду в бизнес-центрах СПб"**.
3. Building pages have the building name as H1 (e.g., "Фидель").
4. No heading levels are skipped (no H1 → H3 without H2).

### Step 9.3 — Verify Structured Data

Check that the following JSON-LD blocks are present in the `<head>` of each page:

| Page | JSON-LD Type |
|---|---|
| All pages | `Organization` |
| Building detail pages | `OfficeSpace` |
| Building pages with FAQ | `FAQPage` |

### Step 9.4 — Verify Technical SEO

Run this checklist:

| Item | How to verify |
|---|---|
| Sitemap generated | Check `/sitemap-index.xml` after build |
| robots.txt exists | Check `/robots.txt` |
| Canonical URLs set | Inspect `<link rel="canonical">` in page source |
| Open Graph tags | Inspect `<meta property="og:*">` tags |
| hreflang tags | Inspect `<link rel="alternate" hreflang="*">` tags |
| Alt text on all images | Search for `<img` without `alt` attribute |
| No broken links | Run `npx broken-link-checker https://localhost:4321` |

### Step 9.5 — Create `public/robots.txt`

Already created in Step 1.7. Verify it contains:

```
User-agent: *
Allow: /
Sitemap: https://www.a-n-m.ru/sitemap-index.xml
```

---

## 10. Responsive Design Verification

### Step 10.1 — Breakpoint Testing

Test every page at these viewport widths:

| Breakpoint | Width | Key checks |
|---|---|---|
| Mobile S | 320px | No horizontal overflow, readable text, stacked layouts |
| Mobile M | 375px | Standard mobile view |
| Mobile L | 425px | Large mobile view |
| Tablet | 768px | Grid transitions from 1-col to 2-col |
| Laptop | 1024px | Full nav visible, 3-col grids |
| Desktop | 1440px | Max-width container, comfortable spacing |

### Step 10.2 — Mobile-Specific Checks

1. Hamburger menu opens and closes correctly.
2. Phone numbers are clickable (`tel:` links).
3. Map is usable with touch gestures.
4. Office filter controls are usable on small screens.
5. Images are not wider than the viewport.
6. Text is readable without zooming (minimum 16px body).

---

## 11. Performance Optimization

### Step 11.1 — Image Optimization

Replace all `<img>` tags in Astro components with Astro's `<Image>` component where possible:

```astro
---
import { Image } from 'astro:assets';
---
<Image src="/images/buildings/fidel/hero.jpg" alt="..." width={1920} height={1080} format="webp" />
```

For hero images, add `loading="eager"` and `fetchpriority="high"`. For all other images, use `loading="lazy"`.

### Step 11.2 — Font Optimization

Ensure fonts are loaded with `font-display: swap` (already set in typography.css). Preload the primary font:

```html
<link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />
```

Add this to the `<head>` in `BaseLayout.astro`.

### Step 11.3 — Build and Measure

```bash
pnpm run build
pnpm run preview
```

Then run Lighthouse in Chrome DevTools on the preview server. Target scores:

| Metric | Target |
|---|---|
| Performance | > 90 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 95 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |

---

## 12. Deployment

### Step 12.1 — Build Command

```bash
pnpm run build
```

This produces a `dist/` directory containing the complete static site.

### Step 12.2 — Deployment Options

**Option A: Cloudflare Pages (recommended for Russian audience)**

```bash
# Install Wrangler CLI
pnpm add -D wrangler

# Deploy
npx wrangler pages deploy dist/ --project-name=anm-website
```

**Option B: Vercel**

```bash
# Install Vercel CLI
pnpm add -D vercel

# Deploy
npx vercel --prod
```

**Option C: Nginx on VPS**

Upload the `dist/` directory to a VPS and configure Nginx:

```nginx
server {
    listen 80;
    server_name www.a-n-m.ru a-n-m.ru;
    root /var/www/anm-website/dist;
    index index.html;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/html text/css application/javascript application/json image/svg+xml;
}
```

### Step 12.3 — DNS Configuration

Point the domain `a-n-m.ru` and `www.a-n-m.ru` to the hosting provider. If using Cloudflare Pages, add a CNAME record pointing to the Cloudflare Pages URL.

---

## 13. Final File Inventory

When complete, the project should contain exactly these files. Use this as a checklist to verify nothing is missing.

### Configuration Files

| File | Purpose |
|---|---|
| `astro.config.mjs` | Astro configuration |
| `tsconfig.json` | TypeScript configuration |
| `package.json` | Dependencies and scripts |

### Public Assets

| File | Purpose |
|---|---|
| `public/robots.txt` | Search engine directives |
| `public/favicon.ico` | Browser favicon |
| `public/data/offices.json` | Office listings data (consumed by React island) |
| `public/fonts/Inter-Variable.woff2` | Inter font file |
| `public/fonts/Manrope-Variable.woff2` | Manrope font file |
| `public/images/buildings/fidel/*.jpg` | Fidel building photos |
| `public/images/buildings/anm/*.jpg` | ANM building photos |
| `public/images/infrastructure/*.jpg` | Infrastructure photos |
| `public/images/about/*.jpg` | About page photos |
| `public/images/common/logo.png` | Logo (dark version) |
| `public/images/common/logo-white.png` | Logo (light version for dark backgrounds) |
| `public/images/common/scheme.svg` | Territory scheme/plan |

### Source — Styles

| File | Purpose |
|---|---|
| `src/styles/variables.css` | Design tokens (colors, spacing, typography) |
| `src/styles/typography.css` | Font loading and type styles |
| `src/styles/global.css` | Reset, utilities, button styles |

### Source — Layouts

| File | Purpose |
|---|---|
| `src/layouts/BaseLayout.astro` | Root HTML layout with head, header, footer |
| `src/layouts/BuildingLayout.astro` | Building page wrapper with breadcrumbs |

### Source — Components (Static)

| File | Purpose |
|---|---|
| `src/components/Header.astro` | Sticky header with nav, phone, language toggle |
| `src/components/SubNav.astro` | Building sub-navigation bar |
| `src/components/Footer.astro` | Site-wide footer |
| `src/components/Breadcrumbs.astro` | Breadcrumb navigation |
| `src/components/SectionHeading.astro` | Reusable section heading |
| `src/components/HeroSection.astro` | Full-viewport hero |
| `src/components/BuildingCard.astro` | Large building card (zigzag layout) |
| `src/components/StatsRow.astro` | Horizontal statistics row |
| `src/components/FeatureBlock.astro` | Photo + text feature block |
| `src/components/ParameterGrid.astro` | Building parameters grid |
| `src/components/FacilityCard.astro` | Infrastructure facility card |
| `src/components/ContactCTA.astro` | Dark-background contact CTA |

### Source — Components (Island Wrappers)

| File | Purpose |
|---|---|
| `src/components/OfficeFilterIsland.astro` | Astro wrapper for OfficeFilter React island |
| `src/components/InteractiveMapIsland.astro` | Astro wrapper for InteractiveMap React island |
| `src/components/PhotoGalleryIsland.astro` | Astro wrapper for PhotoGallery React island |

### Source — Components (React Islands)

| File | Purpose |
|---|---|
| `src/components/islands/OfficeFilter.tsx` | Office listing filter with real-time results |
| `src/components/islands/OfficeFilter.css` | Styles for office filter and cards |
| `src/components/islands/OfficeCard.tsx` | Individual office listing card |
| `src/components/islands/InteractiveMap.tsx` | Yandex Maps wrapper |
| `src/components/islands/PhotoGallery.tsx` | Photo gallery with lightbox |
| `src/components/islands/PhotoGallery.css` | Styles for photo gallery |

### Source — Pages

| File | Route | Purpose |
|---|---|---|
| `src/pages/index.astro` | `/` | Homepage |
| `src/pages/about.astro` | `/about/` | About company |
| `src/pages/contacts.astro` | `/contacts/` | Contacts |
| `src/pages/legal.astro` | `/legal/` | Legal / disclosure |
| `src/pages/buildings/index.astro` | `/buildings/` | Buildings listing |
| `src/pages/buildings/fidel/index.astro` | `/buildings/fidel/` | Fidel building detail |
| `src/pages/buildings/fidel/offices.astro` | `/buildings/fidel/offices/` | Fidel office listings |
| `src/pages/buildings/fidel/infrastructure.astro` | `/buildings/fidel/infrastructure/` | Fidel infrastructure |
| `src/pages/buildings/fidel/how-to-get.astro` | `/buildings/fidel/how-to-get/` | Fidel directions |
| `src/pages/buildings/anm/index.astro` | `/buildings/anm/` | ANM building detail |
| `src/pages/buildings/anm/offices.astro` | `/buildings/anm/offices/` | ANM office listings |
| `src/pages/buildings/anm/infrastructure.astro` | `/buildings/anm/infrastructure/` | ANM infrastructure |
| `src/pages/buildings/anm/how-to-get.astro` | `/buildings/anm/how-to-get/` | ANM directions |

### Source — Data

| File | Purpose |
|---|---|
| `src/data/navigation.ts` | Navigation items, building nav, contact info |
| `src/data/buildings.ts` | All building data (features, params, infrastructure, FAQ) |
| `src/data/offices.ts` | Office listings data (TypeScript version) |

### Source — Utilities

| File | Purpose |
|---|---|
| `src/utils/types.ts` | TypeScript interfaces for all data structures |
| `src/utils/formatters.ts` | Number, price, area formatting functions |

### Source — i18n

| File | Purpose |
|---|---|
| `src/i18n/ru.json` | Russian translation strings |
| `src/i18n/en.json` | English translation strings |

---

## 14. Adding a New Building in the Future

When a new building needs to be added, follow these steps:

1. **Add building data** to `src/data/buildings.ts` — add a new object to the `buildings` array with all required fields.
2. **Add building to navigation** in `src/data/navigation.ts` — add a new entry to the `buildingNav` array.
3. **Create building pages** — copy the `src/pages/buildings/fidel/` directory, rename it to the new building's slug, and update the `getBuildingBySlug` call in each file.
4. **Add office listings** to `src/data/offices.ts` and `public/data/offices.json` for the new building.
5. **Add images** to `public/images/buildings/[new-slug]/`.
6. **Rebuild** with `pnpm run build`.

No other files need to be modified. The homepage, buildings index, navigation, footer, and sub-nav will automatically include the new building because they read from the data files.

---

## 15. Quality Assurance Checklist

Before considering the site complete, verify every item:

| Category | Check | Status |
|---|---|---|
| **Build** | `pnpm run build` completes without errors | |
| **Build** | `pnpm run preview` serves the site correctly | |
| **Pages** | All 14 pages render without errors | |
| **Navigation** | All nav links work (header, subnav, footer) | |
| **Navigation** | Mobile hamburger menu opens/closes | |
| **Navigation** | Breadcrumbs show correct hierarchy | |
| **Content** | All text is in Russian | |
| **Content** | No placeholder "Lorem ipsum" text remains | |
| **Content** | All phone numbers are correct and clickable | |
| **Content** | Email addresses are correct and clickable | |
| **Content** | Physical address is correct | |
| **Images** | No broken image links (no 404s) | |
| **Images** | All images have descriptive alt text | |
| **Islands** | Office filter loads and filters correctly | |
| **Islands** | Map loads with correct markers | |
| **Islands** | Photo gallery opens lightbox | |
| **SEO** | Each page has unique title and description | |
| **SEO** | Each page has exactly one H1 | |
| **SEO** | JSON-LD structured data is valid | |
| **SEO** | Sitemap is generated | |
| **SEO** | robots.txt is accessible | |
| **SEO** | Canonical URLs are set | |
| **SEO** | Open Graph tags are present | |
| **Responsive** | Site works at 320px width | |
| **Responsive** | Site works at 768px width | |
| **Responsive** | Site works at 1440px width | |
| **Performance** | Lighthouse Performance > 90 | |
| **Performance** | Lighthouse Accessibility > 90 | |
| **Performance** | Lighthouse SEO > 95 | |
| **Accessibility** | All interactive elements are keyboard-accessible | |
| **Accessibility** | Color contrast meets WCAG AA | |
| **Constraints** | No employee photos anywhere | |
| **Constraints** | No login / personal cabinet | |
| **Constraints** | No "leave a request" form collecting personal data | |
| **Constraints** | All CTAs point to phone/email | |
| **Constraints** | Disclosure info accessible from homepage | |

---

*End of implementation guide. This document contains every file, every component, every style, and every page needed to build the complete УК АНМ website. Follow the steps in order, verify each checkpoint, and the result will be a production-ready Astro website.*
