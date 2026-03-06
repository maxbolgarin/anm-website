# Development Specification: УК АНМ Corporate Website

**Project:** Redesign and rebuild of the Александро-Невская Мануфактура (УК АНМ) corporate website
**Framework:** Astro (static-first with dynamic islands)
**Language:** Russian (primary), English (secondary)
**Date:** March 2026
**Author:** Manus AI

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Goals and Visitor Needs](#2-project-goals-and-visitor-needs)
3. [Information Architecture and Sitemap](#3-information-architecture-and-sitemap)
4. [Design System](#4-design-system)
5. [Page Specifications](#5-page-specifications)
6. [Component Library](#6-component-library)
7. [Dynamic Islands and Interactivity](#7-dynamic-islands-and-interactivity)
8. [Technical Architecture](#8-technical-architecture)
9. [SEO Strategy](#9-seo-strategy)
10. [Content Strategy](#10-content-strategy)
11. [Deployment and Performance](#11-deployment-and-performance)
12. [Appendix: Reference Analysis](#12-appendix-reference-analysis)

---

## 1. Executive Summary

This document provides a complete development specification for rebuilding the УК АНМ website using the Astro framework. The current website at [a-n-m.ru](https://www.a-n-m.ru/) serves as the digital presence for a St. Petersburg-based developer and management company that specializes in redeveloping former industrial territories into modern business centers. The company has operated on the real estate market for over 15 years, with its primary project located on Prospekt Obukhovskoy Oborony.

The redesign aims to modernize the site's structure and user experience while preserving the established brand language — the red/maroon accent color, the Александро-Невская Мануфактура identity, and the professional, understated tone. The reference website [sppcm.ru](https://sppcm.ru/) serves as the primary UX and structural benchmark: a clean, building-centric layout with quick access to property information, interactive maps, and office rental listings.

The new site will be built as a **static-first Astro project** with selective dynamic islands for interactive features such as the office filter, interactive map, and photo galleries. This approach ensures fast load times, excellent SEO performance, and low hosting costs, while still providing rich interactivity where it matters.

---

## 2. Project Goals and Visitor Needs

### 2.1 Site Goals

The website serves as a **digital business card and information hub** for the management company and its business centers. It is designed primarily for **potential clients** (prospective tenants) rather than existing tenants. The site must not focus too heavily on servicing existing clients — there is no personal cabinet, no login system, and no "leave a request" form that collects personal data.

The core functional objectives are as follows:

| Objective | Description |
|---|---|
| **Showcase business centers** | Provide fast, structured access to information about each building managed by УК АНМ, with the ability to easily add new project pages in the future. |
| **Facilitate contact** | Replace traditional lead-capture forms with direct contact information (phone numbers, email addresses, and links), making it easy for visitors to reach the commercial department. |
| **Present the management company** | Communicate the company's history, mission, and redevelopment expertise, with the company history placed inside the "About Company" section. |
| **Support image refresh** | The redesign coincides with a new project launch; the website should reflect a modern, updated brand image. |
| **Provide disclosure information** | Legally required disclosure information should be accessible at the bottom of the homepage. |
| **Interactive territory orientation** | An interactive map with simple navigation is mandatory, helping visitors understand the location and layout of the business center territory. |

### 2.2 Visitor Needs

Visitors come to the site with specific, practical questions. The information architecture must address these needs within one or two clicks from the homepage.

| Visitor Need | Expected Content |
|---|---|
| **Available office space** | Current vacancies with area, floor, price, and photos. If no vacancies exist, a clear "contact us with your request" message and contact details. |
| **How to get to the business center** | Address, metro station, walking time, driving directions, parking information, and an interactive map. |
| **Contacts** | Phone numbers for the reception and commercial department, email address, and physical address — all prominently displayed without requiring form submission. |
| **Services and facilities** | Information about on-site infrastructure: cafe, parking, security, cleaning, telecom operators, and other amenities. |
| **Company background** | Who manages the buildings, how long they have been operating, and what their approach to property management is. |

### 2.3 Key Constraints

Several constraints, derived from the client's notes, must be observed throughout the project:

**No employee photos** are to be displayed anywhere on the site, in order to avoid collecting and publishing personal data. **No personal cabinet or login system** is required. The site must not include a "leave a request" form that collects personal information; instead, all calls to action should direct visitors to **contact information and direct links** (phone, email). Images for the new site can be sourced from the existing website at a-n-m.ru.

---

## 3. Information Architecture and Sitemap

The sitemap follows a building-centric model inspired by the SPPC reference site, where each business center is a primary navigable entity. The structure is flat enough for quick access yet deep enough to accommodate detailed building information.

### 3.1 Sitemap Diagram

```
/                           → Homepage
├── /buildings/
│   ├── /buildings/fidel/           → BC Fidel (detail page)
│   │   ├── /buildings/fidel/offices/    → Office rental listings for Fidel
│   │   ├── /buildings/fidel/infrastructure/  → Infrastructure & facilities
│   │   └── /buildings/fidel/how-to-get/     → How to get there
│   ├── /buildings/anm/             → BC Александро-Невская Мануфактура
│   │   ├── /buildings/anm/offices/
│   │   ├── /buildings/anm/infrastructure/
│   │   └── /buildings/anm/how-to-get/
│   └── /buildings/[new-project]/   → Future new project (same structure)
├── /about/                 → About the company (includes history)
├── /contacts/              → Contacts page
└── /legal/                 → Legal disclosure / requisites
```

### 3.2 Navigation Structure

The primary navigation bar should contain the following items, always visible in the sticky header:

| Nav Item | Target | Notes |
|---|---|---|
| **Главная** | `/` | Homepage link, also accessible via logo click |
| **Бизнес-центры** | `/buildings/` | Dropdown or sub-nav showing individual buildings |
| **Аренда офисов** | Anchor or page | Scrolls to / navigates to office listings section |
| **О компании** | `/about/` | Company info with history |
| **Контакты** | `/contacts/` | Contact information and map |

A **secondary sub-navigation bar** (inspired by SPPC) should appear below the main nav, displaying the names of individual business centers with their class ratings (e.g., "Фидель B+", "АНМ B+"). Clicking a building name navigates to its detail page. This sub-nav provides instant building-level navigation from any page on the site.

The **phone number** must be visible in the header at all times. A **language toggle** (RU/EN) should be placed in the header, consistent with the current site.

---

## 4. Design System

The design system preserves the existing ANM brand language while modernizing the visual presentation to match the quality level seen on the SPPC reference site.

### 4.1 Color Palette

The color palette is derived from the current ANM branding and the mockup analysis. The primary accent is the distinctive red/maroon that appears in the ANM logo and throughout the existing site.

| Token | Hex Value | Usage |
|---|---|---|
| `--color-primary` | `#B71C1C` | Primary brand red/maroon — logo, CTAs, accent elements, active nav states |
| `--color-primary-dark` | `#7F0000` | Darker variant for hover states and emphasis |
| `--color-primary-light` | `#E53935` | Lighter variant for subtle highlights |
| `--color-surface-cream` | `#F5F0E8` | Warm cream background for content blocks (from mockups) |
| `--color-surface-white` | `#FFFFFF` | Clean white for primary backgrounds |
| `--color-surface-dark` | `#1A1A2E` | Dark navy/charcoal for footer and dark sections |
| `--color-accent-yellow` | `#F5D45E` | Yellow highlight for key information blocks (from mockups) |
| `--color-text-primary` | `#1A1A1A` | Primary text color — near-black |
| `--color-text-secondary` | `#6B6B6B` | Secondary text — descriptions, captions |
| `--color-text-inverse` | `#FFFFFF` | Text on dark backgrounds |
| `--color-border` | `#E0E0E0` | Subtle borders and dividers |

### 4.2 Typography

The typography should be clean and modern, using a system that supports both Latin and Cyrillic characters. Based on the mockup analysis, the site uses a combination of a display/heading typeface and a body typeface.

| Role | Font Family | Weight | Notes |
|---|---|---|---|
| **Headings (H1–H2)** | `Inter` or `Manrope` | 700 (Bold), 800 (ExtraBold) | Large, impactful headings for building names and section titles. Consider using a condensed variant for very large display text. |
| **Subheadings (H3–H4)** | `Inter` or `Manrope` | 600 (SemiBold) | Section subheadings and card titles |
| **Body text** | `Inter` | 400 (Regular), 500 (Medium) | All paragraph text, descriptions, and UI labels |
| **Captions / Small** | `Inter` | 400 (Regular) | Metadata, timestamps, legal text |
| **Stats / Numbers** | `Inter` or `Manrope` | 700 (Bold) | Large numerical displays (area, floors, etc.) |

The type scale should follow a modular approach:

| Element | Desktop Size | Mobile Size | Line Height |
|---|---|---|---|
| Display (building names) | 72–96px | 40–48px | 1.0–1.1 |
| H1 | 48–56px | 32–36px | 1.1–1.2 |
| H2 | 36–40px | 24–28px | 1.2 |
| H3 | 24–28px | 20–22px | 1.3 |
| H4 | 20–22px | 18–20px | 1.3 |
| Body | 16–18px | 16px | 1.5–1.6 |
| Caption | 14px | 13px | 1.4 |
| Small | 12px | 12px | 1.4 |

### 4.3 Spacing and Grid

The layout uses a **12-column grid** on desktop with a maximum content width of **1280px** (with 1440px outer container). The spacing scale follows an 8px base unit.

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 4px | Tight spacing, icon gaps |
| `--space-sm` | 8px | Small gaps between related elements |
| `--space-md` | 16px | Standard component padding |
| `--space-lg` | 24px | Section internal padding |
| `--space-xl` | 32px | Between content blocks |
| `--space-2xl` | 48px | Between major sections |
| `--space-3xl` | 64px | Large section separators |
| `--space-4xl` | 96px | Hero and major section vertical padding |
| `--space-5xl` | 128px | Top-level section breaks |

### 4.4 Breakpoints

| Breakpoint | Width | Description |
|---|---|---|
| `mobile` | < 768px | Single column, stacked layout |
| `tablet` | 768px – 1023px | Two-column where appropriate |
| `desktop` | 1024px – 1439px | Full layout, 12-column grid |
| `wide` | ≥ 1440px | Max-width container, centered |

### 4.5 Component Styling Principles

The visual style draws from both the existing ANM brand and the mockup designs. The overall aesthetic is **professional, clean, and warm** — not cold-corporate but not overly decorative either. The cream/beige tones from the mockups add warmth, while the dark navy sections provide contrast and gravitas.

**Cards and containers** use subtle rounded corners (4–8px radius), with occasional use of the cream background color to differentiate content blocks. **Shadows** are minimal — prefer border-based separation or background color changes over drop shadows. **Photography** is the primary visual element; the site relies on high-quality building and interior photographs rather than illustrations or icons. **Hover states** should use subtle color shifts and scale transforms (1.02x) rather than dramatic animations. **Transitions** should be smooth and quick (200–300ms ease-out).

---

## 5. Page Specifications

### 5.1 Homepage (`/`)

The homepage is the primary entry point and must provide quick access to all major sections. It follows a long-scroll, section-based layout similar to the SPPC reference, but adapted to the ANM brand.

#### Section 1: Hero

The hero section occupies the full viewport height and features a large, high-quality photograph of the main business center territory (sourced from the existing site). The ANM logo and tagline **"Все уровни комфорта для вашего бизнеса"** are overlaid on the image. A subtle scroll indicator at the bottom encourages users to explore further.

| Element | Specification |
|---|---|
| Background | Full-bleed photograph of the business center exterior |
| Overlay | Semi-transparent dark gradient from bottom (for text legibility) |
| Logo | ANM logo in white/light variant, positioned top-left or centered |
| Headline | "Все уровни комфорта для вашего бизнеса" — H1, white, large display size |
| Sub-headline | Brief one-line description of the company's focus |
| CTA | "Аренда помещений" button linking to the office listings section or page |
| Scroll indicator | Animated down-arrow or "scroll" text at the bottom of the viewport |

#### Section 2: Building Cards

This section presents each business center as a large, visually prominent card. The layout alternates between left-text/right-image and right-text/left-image (zigzag pattern), following the SPPC model.

Each building card contains the following elements:

| Element | Description |
|---|---|
| Building name | Very large display typography (e.g., "ФИДЕЛЬ") |
| Class badge | Building class rating (e.g., "B+") displayed prominently |
| Address | Full street address |
| Metro | Nearest metro station with walking time in minutes |
| Key stats row | Floors count, total area (m²), parking type/capacity |
| Description | 2–3 sentence summary of the building's character |
| Photo | Large, high-quality exterior photograph |
| CTA link | Arrow-link to the building detail page |

If a downloadable presentation PDF exists for a building, a "Скачать презентацию" (Download presentation) button should appear on the card.

#### Section 3: Advantages / Comfort in Details

A horizontal scrolling or tabbed section showcasing the key advantages of the business centers. This section uses large photographs with overlay text, organized into categories.

The categories, drawn from the existing site's advantages and the SPPC "Комфорт в деталях" section, are:

| Category | Content Focus |
|---|---|
| **Транспортная доступность** | Metro proximity, road access, parking |
| **Инженерное оснащение** | Power reliability, ventilation, heating, telecom |
| **Инфраструктура** | Cafe, parking, security, cleaning, ATM |
| **Безопасность** | 24/7 security, access control, CCTV, fire systems |

Each category tab/slide shows a full-width photograph with a text overlay describing the specific advantages.

#### Section 4: Interactive Map

A full-width section with an interactive Yandex Maps embed showing the business center territory. The map should display building locations with labeled markers. A toggle between "Схема" (scheme/plan view) and "На карте" (map view) provides two ways to orient visitors.

The scheme view is a simplified illustrated site plan showing building positions, entrances, parking areas, and key infrastructure points. The map view is a standard Yandex Maps embed with custom markers for each building.

This section also includes a brief text block about the territory's location advantages (proximity to metro, city center, etc.).

#### Section 5: Office Rental Quick View

A compact section that surfaces available office listings directly on the homepage. This is a **dynamic island** — an interactive React or Preact component hydrated on the client side.

The section includes basic filters (building selector, area range) and displays 3–6 featured available offices as cards. Each card shows the building name, office area (m²), floor, type (cabinet/open space), and price per m². A "Все предложения" (All listings) link leads to the full rental page.

If no offices are currently available, this section displays a message: **"Свободных помещений нет. Свяжитесь с нами для обсуждения вариантов"** with contact phone and email.

#### Section 6: About Company Teaser

A brief section introducing the management company with 2–3 sentences, key statistics (years on market, total managed area, number of tenants), and a link to the full About page.

| Stat | Example Value |
|---|---|
| Years on market | 15+ лет |
| Total managed area | XX 000 м² |
| Number of tenants | XXX арендаторов |

#### Section 7: Contact Bar / CTA

A dark-background section with the heading **"Давайте обсудим детали"** (Let's discuss the details), the main phone number displayed prominently, and the email address. This serves as the primary call-to-action at the bottom of the homepage, replacing the traditional contact form.

#### Section 8: Disclosure Information

As specified in the client's notes, legally required disclosure information should be accessible at the bottom of the homepage, above the footer. This can be implemented as a collapsible accordion or a link to the `/legal/` page.

#### Footer

The footer appears on every page and contains:

| Element | Description |
|---|---|
| Logo | ANM logo (light variant on dark background) |
| Navigation links | All primary nav items |
| Building links | Direct links to each building page |
| Contact info | Phone numbers (reception, commercial dept), email |
| Address | Physical address |
| Legal links | Privacy policy, requisites, disclosure |
| Social links | If applicable (VK, Telegram) |
| Copyright | © 2026 УК АНМ |

---

### 5.2 Building Detail Page (`/buildings/[slug]/`)

Each business center has its own detail page that serves as the comprehensive information hub for that property. The structure is modeled after the SPPC building pages but adapted to ANM's content.

#### Section 1: Building Hero

| Element | Specification |
|---|---|
| Breadcrumbs | Главная > Бизнес-центры > [Building Name] |
| Building name | Very large display text (e.g., "ФИДЕЛЬ") |
| Class badge | Building class (e.g., "B+") in a large colored block |
| Address | Full street address |
| Metro | Station name + walking time |
| Key stats | Floors, total area (m²), parking capacity |
| Hero photo | Large exterior photograph of the building |
| Description | 1–2 paragraph description of the building |

#### Section 2: Building Details ("В деталях")

A tabbed or scrolling section with detailed information about the building, organized into thematic blocks. Each block features a photograph and descriptive text.

| Block | Content |
|---|---|
| **Архитектура и дизайн** | Architectural style, renovation history, interior design approach (loft-style for Fidel, etc.) |
| **Инженерное оснащение** | Power supply category, ventilation, AC system, heating, elevators, telecom operators |
| **Отделка** | Interior finish details — flooring, walls, lighting, windows |
| **Сервис** | Management company services, tenant care department |

#### Section 3: Key Parameters Grid

A structured grid displaying all technical parameters of the building.

| Parameter | Example (Fidel) |
|---|---|
| Класс | B+ |
| Этажей | [number] |
| Общая площадь | [number] м² |
| Год постройки | [year] |
| Реконструкция | [year] |
| Электроснабжение | II категория надежности |
| Кондиционирование | Централизованное (Ciat) |
| Вентиляция | Приточно-вытяжная |
| Отопление | Автономное, газовая котельная |
| Лифты | 4 |
| Пожарная сигнализация | Да |
| Телеком-операторы | 6 операторов |

#### Section 4: Location and Transport

This section provides detailed information about how to reach the building.

The content includes a list of nearby metro stations with line names, distances, and walking times; driving directions from key city landmarks (Nevsky Prospekt, Ring Road); and a list of nearby infrastructure (cafes, restaurants, banks, shops). An embedded Yandex Map focused on this specific building is included, with markers for the building entrance, parking, and nearby metro stations.

#### Section 5: Infrastructure on Territory

A photo gallery section showcasing the on-site facilities: cafe/canteen, parking area, reception zone, common areas, promenade zone (for buildings near the Neva). Each facility is presented as a card with a photo and brief description.

#### Section 6: Office Rental Listings (Internal Tab)

As specified in the client's notes, office rental is an **internal tab within the building pages**. This section displays available offices for this specific building.

If offices are available, they are shown as filterable cards with area, floor, type, and price. If no offices are available, the section displays: **"В данный момент свободных помещений нет. Обратитесь с запросом"** with a direct link to the contacts page and the commercial department phone number.

This section is a **dynamic island** — the filter and listing functionality is hydrated on the client side.

#### Section 7: FAQ (Optional)

A collapsible FAQ section addressing common questions about the building (lease terms, minimum rental period, included services, etc.). Based on the mockup, this section uses an accordion pattern.

#### Section 8: Contact CTA

A dark-background section with the phone number prominently displayed and a "Давайте обсудим детали" heading, consistent with the homepage CTA.

---

### 5.3 Building Sub-pages

Each building has three sub-pages that provide focused information. These can be implemented as separate pages or as deep-linked tabs within the building detail page.

#### 5.3.1 Office Listings (`/buildings/[slug]/offices/`)

A dedicated page for browsing available offices in a specific building. This is the full version of the rental listings section from the building detail page.

**Filters (dynamic island):**

| Filter | Type | Options |
|---|---|---|
| Floor | Multi-select buttons | All available floors |
| Area range | Range slider | Min–Max m² |
| Price range | Range slider | Min–Max ₽/m² |
| Type | Toggle buttons | Cabinet, Open Space |

**Office Card Fields:**

| Field | Description |
|---|---|
| Building name | Name of the business center |
| Office area | Total area in m² |
| Floor | Floor number |
| Class | Building class |
| Type | Cabinet / Open Space |
| Address | Building address |
| Price per m² | Monthly rate per square meter |
| Total price | Calculated monthly total |
| Photos | Thumbnail count, expandable gallery |

#### 5.3.2 Infrastructure (`/buildings/[slug]/infrastructure/`)

A page dedicated to the facilities and services available on the building's territory.

The page is organized into sections, each with a photo and description:

| Section | Content |
|---|---|
| **Кафе и столовая** | On-site dining options with photos |
| **Парковка** | Parking type (closed/open), capacity, pricing if applicable |
| **Охрана и безопасность** | Security systems, access control, CCTV |
| **Клининг** | Cleaning services |
| **Банковские услуги** | ATM, payment terminals |
| **Велопарковка** | Bicycle parking capacity |
| **Набережная** | Promenade zone (if applicable) |
| **Телеком** | Available telecom operators |

#### 5.3.3 How to Get There (`/buildings/[slug]/how-to-get/`)

A focused page about reaching the business center.

The page includes a large interactive map (Yandex Maps) centered on the building, with detailed directions from metro stations (with walking routes), driving directions from major roads, public transport options (bus, tram routes), and parking information (location, capacity, access). A printable/downloadable PDF map or directions sheet could be a useful addition.

---

### 5.4 About Company Page (`/about/`)

The About page presents the management company's identity, history, and approach. As noted in the client's requirements, the company history is placed within this page rather than as a separate section.

#### Section 1: Company Hero

| Element | Specification |
|---|---|
| Breadcrumbs | Главная > О компании |
| Company name | "Александро-Невская Мануфактура" / "УК АНМ" in large display text |
| Tagline | Company mission or positioning statement |
| Key stats | Years on market, total managed area, number of tenants |
| Hero image | Aerial or panoramic photo of the territory |

#### Section 2: Company Description

Two to three paragraphs describing the company's focus on redevelopment, its mission to create quality business space and comfortable environments for the business community, and its focus on the grey zone of St. Petersburg. The description should mention the British architectural firm Horan Keoghan Ryan Limited that developed the redevelopment concept.

#### Section 3: History

A timeline or narrative section covering the company's 15+ year history. This replaces the separate history page — as per the client's notes, history goes inside the "About Company" tab. The timeline should highlight key milestones: founding, acquisition of the territory, start of redevelopment, completion of major buildings, and any upcoming projects.

#### Section 4: Management Approach

Blocks describing the company's approach to property management, similar to the SPPC "About" page structure:

| Block | Content |
|---|---|
| **Европейский уровень обслуживания** | Quality of service, tenant care department |
| **Инженерные решения** | Technical infrastructure management |
| **Редевелопмент** | The company's expertise in transforming industrial territories |

Each block includes a photograph (of the territory or interiors, not of employees) and a descriptive paragraph.

#### Section 5: New Project Teaser

Since the redesign coincides with a new project, this section provides a preview of the upcoming development. It should be designed as a modular block that can be updated or removed as the project progresses.

#### Section 6: Contact CTA

Same dark-background CTA section as other pages.

---

### 5.5 Contacts Page (`/contacts/`)

The contacts page is designed to be immediately useful, with all contact information visible without scrolling on desktop.

#### Section 1: Header

| Element | Specification |
|---|---|
| Breadcrumbs | Главная > Контакты |
| Heading | "Хотите задать вопрос или обсудить сотрудничество?" or similar inviting headline |

#### Section 2: Interactive Map

A large Yandex Maps embed showing all business center locations with labeled markers. Clicking a marker should display the building name, address, and a link to its detail page. The map should be prominent — occupying at least 50% of the viewport on desktop.

#### Section 3: Contact Information

Organized by department, with phone numbers and email addresses displayed as clickable links (tel: and mailto:).

| Department | Phone | Email |
|---|---|---|
| **Приемная** | +7 (812) 703-50-09 | — |
| **Коммерческий отдел** | +7 (812) 336-55-64 / +7 (812) 313-18-04 | mail@ukanm.ru |
| **Общий** | +7 (812) 313 18 04 | mail@ukanm.ru |

The physical address is displayed prominently: **Санкт-Петербург, Пр. Обуховской Обороны д. 70, корпус 2, лит А**.

#### Section 4: Requisites

A link or expandable section with the company's legal requisites (ИНН, КПП, ОГРН, bank details). This can be a separate page (`/legal/`) or an expandable block on the contacts page, following the SPPC pattern of a "РЕКВИЗИТЫ" button.

#### Section 5: "Давайте обсудим детали" CTA

The same dark-background CTA block used across the site, reinforcing the invitation to make direct contact.

---

### 5.6 Legal / Disclosure Page (`/legal/`)

A simple, text-heavy page containing legally required disclosure information, the company's privacy policy, and full legal requisites. This page is linked from the homepage footer and the contacts page.

---

## 6. Component Library

The following reusable components should be developed as Astro components (`.astro` files) for static rendering, with React/Preact islands where interactivity is required.

### 6.1 Layout Components

| Component | File | Description |
|---|---|---|
| `BaseLayout` | `layouts/BaseLayout.astro` | Root layout with `<html>`, `<head>`, meta tags, font loading, and global styles |
| `Header` | `components/Header.astro` | Sticky header with logo, main nav, phone number, language toggle |
| `SubNav` | `components/SubNav.astro` | Secondary navigation bar with building names and class badges |
| `Footer` | `components/Footer.astro` | Site-wide footer with contacts, nav, legal links |
| `Breadcrumbs` | `components/Breadcrumbs.astro` | Breadcrumb navigation trail |

### 6.2 Content Components

| Component | File | Description |
|---|---|---|
| `HeroSection` | `components/HeroSection.astro` | Full-viewport hero with background image, overlay text, and CTA |
| `BuildingCard` | `components/BuildingCard.astro` | Large building presentation card with zigzag layout |
| `StatsRow` | `components/StatsRow.astro` | Horizontal row of key statistics (floors, area, parking, class) |
| `FeatureBlock` | `components/FeatureBlock.astro` | Photo + text block for advantages/features |
| `ParameterGrid` | `components/ParameterGrid.astro` | Grid of building technical parameters |
| `FacilityCard` | `components/FacilityCard.astro` | Infrastructure item card with photo and description |
| `FAQAccordion` | `components/FAQAccordion.astro` | Collapsible FAQ section (can use `<details>` for zero-JS) |
| `ContactCTA` | `components/ContactCTA.astro` | Dark-background CTA section with phone and heading |
| `TimelineBlock` | `components/TimelineBlock.astro` | Company history timeline entry |
| `SectionHeading` | `components/SectionHeading.astro` | Consistent section heading with optional subtitle |

### 6.3 Interactive Components (Dynamic Islands)

These components require client-side JavaScript and should be implemented using Astro's island architecture with `client:visible` or `client:load` directives.

| Component | Framework | File | Description |
|---|---|---|---|
| `OfficeFilter` | React/Preact | `components/islands/OfficeFilter.tsx` | Office listing filter with building, floor, area, price, and type filters |
| `OfficeCard` | React/Preact | `components/islands/OfficeCard.tsx` | Individual office listing card within the filter results |
| `InteractiveMap` | React/Preact | `components/islands/InteractiveMap.tsx` | Yandex Maps wrapper with custom markers and info windows |
| `PhotoGallery` | React/Preact | `components/islands/PhotoGallery.tsx` | Image gallery with thumbnails and lightbox |
| `BuildingTabs` | React/Preact | `components/islands/BuildingTabs.tsx` | Tab navigation within building detail pages |
| `SchemeMapToggle` | React/Preact | `components/islands/SchemeMapToggle.tsx` | Toggle between scheme view and map view |

---

## 7. Dynamic Islands and Interactivity

Astro's island architecture allows the site to remain mostly static while hydrating specific interactive components on the client side. This section defines which parts of the site require JavaScript and how they should be implemented.

### 7.1 Island Strategy

| Island | Hydration Directive | Rationale |
|---|---|---|
| `OfficeFilter` | `client:visible` | Only hydrate when the user scrolls to the rental section; this is the most complex interactive component |
| `InteractiveMap` | `client:visible` | Maps are heavy; load only when visible |
| `PhotoGallery` | `client:visible` | Gallery interaction (lightbox, thumbnails) only needed when visible |
| `BuildingTabs` | `client:load` | Tabs on building pages should be interactive immediately for navigation |
| `SchemeMapToggle` | `client:visible` | Toggle between scheme and map views |
| `FAQAccordion` | None (use `<details>`) | Native HTML accordion requires no JavaScript |

### 7.2 Office Filter Specification

The office filter is the most complex interactive component. It should support the following functionality:

**Data source:** Office listings are stored as a JSON file or fetched from a lightweight API endpoint. For a static site, a JSON file at `/data/offices.json` is the simplest approach. This file can be regenerated during the build process or updated via a simple CMS.

**Filter logic:** All filters are applied client-side using array filtering. Filters are combined with AND logic (all conditions must match). The results update in real-time as filters change, with no page reload.

**Filter controls:**

| Control | Type | Behavior |
|---|---|---|
| Building | Toggle buttons (All, Fidel, ANM, ...) | Filter by building |
| Floor | Multi-select buttons | Filter by floor number |
| Area | Dual range slider | Filter by min/max area in m² |
| Price | Dual range slider | Filter by min/max price per m² |
| Type | Toggle buttons (Cabinet, Open Space) | Filter by office type |

**Empty state:** When no offices match the filters, display a message with contact information.

**No offices at all:** When a building has zero available offices, display a prominent message encouraging visitors to contact the commercial department.

### 7.3 Interactive Map Specification

The map uses the Yandex Maps JavaScript API (v3). Each building is represented by a custom marker with the building name as a label. Clicking a marker opens an info window with the building name, address, class, and a link to the building detail page.

On the homepage, the map shows all buildings. On individual building pages, the map is centered on that building and also shows nearby infrastructure (metro stations, cafes, parking).

The **scheme view** is a static SVG or image overlay that shows a simplified site plan. It is displayed as an alternative to the map and toggled via the `SchemeMapToggle` component.

### 7.4 Photo Gallery Specification

Photo galleries appear on building detail pages and infrastructure pages. The gallery component displays a grid of thumbnails. Clicking a thumbnail opens a full-screen lightbox with navigation arrows, image counter, and close button. The gallery supports swipe gestures on mobile.

Recommended library: a lightweight option such as `yet-another-react-lightbox` or a custom implementation using `<dialog>` elements.

---

## 8. Technical Architecture

### 8.1 Project Structure

```
anm-website/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── buildings/
│   │   │   ├── fidel/
│   │   │   └── anm/
│   │   ├── infrastructure/
│   │   ├── about/
│   │   └── common/
│   ├── data/
│   │   └── offices.json
│   ├── documents/
│   │   └── presentations/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BuildingLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contacts.astro
│   │   ├── legal.astro
│   │   └── buildings/
│   │       ├── index.astro
│   │       ├── [slug].astro          (or individual files)
│   │       └── [slug]/
│   │           ├── offices.astro
│   │           ├── infrastructure.astro
│   │           └── how-to-get.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── SubNav.astro
│   │   ├── Footer.astro
│   │   ├── Breadcrumbs.astro
│   │   ├── HeroSection.astro
│   │   ├── BuildingCard.astro
│   │   ├── StatsRow.astro
│   │   ├── FeatureBlock.astro
│   │   ├── ParameterGrid.astro
│   │   ├── FacilityCard.astro
│   │   ├── ContactCTA.astro
│   │   ├── TimelineBlock.astro
│   │   ├── SectionHeading.astro
│   │   └── islands/
│   │       ├── OfficeFilter.tsx
│   │       ├── OfficeCard.tsx
│   │       ├── InteractiveMap.tsx
│   │       ├── PhotoGallery.tsx
│   │       ├── BuildingTabs.tsx
│   │       └── SchemeMapToggle.tsx
│   ├── content/
│   │   └── buildings/
│   │       ├── fidel.md
│   │       └── anm.md
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── typography.css
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── types.ts
│   └── data/
│       ├── buildings.ts
│       ├── offices.ts
│       └── navigation.ts
```

### 8.2 Astro Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';       // For interactive islands
import sitemap from '@astrojs/sitemap';    // Auto-generate sitemap
import compress from 'astro-compress';      // Asset compression

export default defineConfig({
  site: 'https://www.a-n-m.ru',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru-RU', en: 'en-US' },
      },
    }),
    compress(),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    css: {
      preprocessorOptions: {
        // If using SCSS or similar
      },
    },
  },
});
```

### 8.3 Content Collections

Building data should be managed through Astro's Content Collections feature, allowing structured content with type safety.

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const buildingsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    class: z.enum(['A', 'A+', 'B', 'B+']),
    address: z.string(),
    metro: z.object({
      station: z.string(),
      walkingMinutes: z.number(),
      line: z.string().optional(),
    }),
    stats: z.object({
      floors: z.number(),
      totalArea: z.number(),
      parkingCapacity: z.number().optional(),
      parkingType: z.enum(['closed', 'open', 'none']).optional(),
    }),
    yearBuilt: z.number().optional(),
    yearReconstructed: z.number().optional(),
    heroImage: z.string(),
    galleryImages: z.array(z.string()),
    features: z.array(z.object({
      title: z.string(),
      description: z.string(),
      image: z.string().optional(),
    })),
    parameters: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })),
    infrastructure: z.array(z.object({
      name: z.string(),
      description: z.string(),
      image: z.string().optional(),
    })),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    order: z.number(),
  }),
});

export const collections = {
  buildings: buildingsCollection,
};
```

### 8.4 Office Data Schema

```typescript
// src/utils/types.ts
export interface Office {
  id: string;
  buildingSlug: string;
  buildingName: string;
  area: number;           // m²
  floor: number;
  class: string;          // A, B+, etc.
  type: 'cabinet' | 'open-space';
  pricePerSqm: number;    // ₽/m² per month
  totalPrice: number;     // ₽ per month
  address: string;
  photos: string[];
  available: boolean;
}
```

### 8.5 Internationalization (i18n)

The site supports Russian (primary) and English (secondary). Astro's built-in i18n routing can be used, or a simpler approach with separate page directories:

```
src/pages/
├── index.astro          (Russian)
├── en/
│   ├── index.astro      (English)
│   ├── about.astro
│   └── ...
```

Translation strings should be stored in JSON files:

```
src/i18n/
├── ru.json
└── en.json
```

A utility function provides translations based on the current locale:

```typescript
// src/utils/i18n.ts
import ru from '../i18n/ru.json';
import en from '../i18n/en.json';

const translations = { ru, en };

export function t(key: string, locale: string = 'ru'): string {
  return translations[locale]?.[key] || key;
}
```

### 8.6 Key Dependencies

| Package | Purpose |
|---|---|
| `astro` | Core framework |
| `@astrojs/react` | React integration for interactive islands |
| `react`, `react-dom` | UI library for islands |
| `@astrojs/sitemap` | Automatic sitemap generation |
| `astro-compress` | HTML/CSS/JS compression |
| `sharp` | Image optimization |
| `yet-another-react-lightbox` | Photo gallery lightbox (or similar) |

The Yandex Maps API is loaded via a `<script>` tag rather than an npm package, using the official JavaScript API v3.

---

## 9. SEO Strategy

### 9.1 Page Titles and Meta Descriptions

Each page must have a unique, keyword-rich title and meta description. The following table provides templates:

| Page | Title Template | Meta Description Template |
|---|---|---|
| Homepage | Аренда офисов в бизнес-центрах Санкт-Петербурга — УК АНМ | Офисы в аренду в бизнес-центрах класса B+ в Санкт-Петербурге. Рядом с метро, развитая инфраструктура, круглосуточный доступ. УК АНМ — 15+ лет на рынке. |
| Building page | Бизнес-центр [Name] — аренда офисов класса [Class] \| УК АНМ | Бизнес-центр [Name] на [Address]. [Area] м², [Floors] этажей, метро [Station] [Minutes] мин пешком. Аренда офисов от УК АНМ. |
| Offices page | Аренда офисов в БЦ [Name] — свободные помещения \| УК АНМ | Свободные офисы в бизнес-центре [Name]. Площади от [Min] до [Max] м², цены от [MinPrice] ₽/м². |
| About page | О компании УК АНМ — управляющая компания в Санкт-Петербурге | УК АНМ — девелоперская компания с 15-летним опытом. Редевелопмент промышленных территорий, управление бизнес-центрами в СПб. |
| Contacts page | Контакты УК АНМ — телефон, адрес, карта \| Аренда офисов СПб | Контакты управляющей компании АНМ. Телефон: +7 (812) 313-18-04. Адрес: СПб, Пр. Обуховской Обороны, 70. |

### 9.2 Heading Hierarchy

Every page must follow a strict heading hierarchy. The H1 on the homepage should be **"Офисы в аренду в бизнес-центрах СПб"** (as recommended in the SEO audit notes), with the company name in the title tag. Each building page should have the building name as H1. Only one H1 per page is allowed.

### 9.3 Structured Data (JSON-LD)

Implement Schema.org structured data for key entities:

**Organization** (on all pages):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "УК АНМ",
  "alternateName": "Александро-Невская Мануфактура",
  "url": "https://www.a-n-m.ru",
  "telephone": "+7-812-313-18-04",
  "email": "mail@ukanm.ru",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Пр. Обуховской Обороны д. 70, корпус 2, лит А",
    "addressLocality": "Санкт-Петербург",
    "addressCountry": "RU"
  }
}
```

**LocalBusiness** (on building pages):
```json
{
  "@context": "https://schema.org",
  "@type": "OfficeSpace",
  "name": "Бизнес-центр Фидель",
  "address": { ... },
  "geo": { "@type": "GeoCoordinates", "latitude": "...", "longitude": "..." },
  "openingHours": "Mo-Su 00:00-23:59"
}
```

**FAQPage** (on building pages with FAQ sections):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

### 9.4 Technical SEO

| Requirement | Implementation |
|---|---|
| **Sitemap** | Auto-generated via `@astrojs/sitemap` |
| **robots.txt** | Static file in `/public/robots.txt` allowing all crawlers |
| **Canonical URLs** | Set via `<link rel="canonical">` in BaseLayout |
| **Open Graph tags** | Title, description, image for each page |
| **Alt text** | All images must have descriptive Russian-language alt text |
| **Page speed** | Target Lighthouse score > 90 on all metrics |
| **Mobile-first** | Responsive design, mobile-friendly test pass |
| **HTTPS** | Required for all pages |
| **hreflang** | `<link rel="alternate" hreflang="ru">` and `hreflang="en"` for i18n |

---

## 10. Content Strategy

### 10.1 Image Assets

Images should be sourced from the existing ANM website (as per client's notes) and optimized for web delivery. Astro's built-in image optimization pipeline (using Sharp) should be used to generate responsive image sets.

| Image Type | Recommended Sizes | Format |
|---|---|---|
| Hero backgrounds | 1920px, 1280px, 768px wide | WebP with JPEG fallback |
| Building cards | 800px, 600px wide | WebP with JPEG fallback |
| Gallery thumbnails | 400px, 200px wide | WebP |
| Gallery full-size | 1600px, 1200px wide | WebP with JPEG fallback |
| Infrastructure photos | 600px, 400px wide | WebP |
| Scheme/plan images | SVG preferred, or 1200px PNG | SVG or PNG |

### 10.2 Content Tone and Voice

The content should maintain the existing ANM brand voice: **professional, confident, and informative** without being overly corporate or cold. The tone should convey reliability and expertise in property management. Avoid marketing superlatives; instead, let specific facts and numbers speak for themselves (e.g., "II категория надежности электроснабжения" rather than "the best power supply").

All content is written in Russian for the primary version, with English translations for the secondary version. The English version should be a professional translation, not a machine translation.

### 10.3 Content That Must Be Created

| Content Item | Source | Notes |
|---|---|---|
| Building descriptions | Rewrite from existing site | Modernize language, add more detail |
| Company history timeline | New content needed | Key milestones over 15+ years |
| FAQ for each building | New content needed | Common tenant questions |
| Infrastructure descriptions | Partially from existing site | Expand with more detail and photos |
| SEO-optimized page copy | New content needed | Homepage H1, meta descriptions |
| Legal/disclosure text | From existing site | Verify with legal team |
| English translations | New content needed | Professional translation required |

---

## 11. Deployment and Performance

### 11.1 Hosting Recommendation

Since the site is static-first, it can be deployed to any static hosting platform. Recommended options:

| Platform | Pros | Cons |
|---|---|---|
| **Vercel** | Zero-config Astro support, global CDN, preview deployments | Vendor lock-in |
| **Netlify** | Similar to Vercel, good form handling if needed later | Similar to Vercel |
| **Cloudflare Pages** | Excellent performance, free tier, Russian edge nodes | Slightly more setup |
| **VPS (Nginx)** | Full control, Russian hosting possible | Requires server management |

For a Russian-market site, **Cloudflare Pages** or a **Russian VPS with Nginx** may provide the best latency for the target audience.

### 11.2 Build and CI/CD

The recommended workflow uses Git-based deployment:

1. Code is stored in a Git repository (GitHub, GitLab, or Bitbucket).
2. Pushing to the `main` branch triggers an automatic build and deployment.
3. Preview deployments are created for pull requests.
4. The build command is `astro build`, producing a static `dist/` directory.

### 11.3 Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 90 |
| Lighthouse Best Practices | > 90 |
| Lighthouse SEO | > 95 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Total page weight (homepage) | < 2MB (including images) |

### 11.4 Image Optimization Pipeline

Astro's `<Image>` component should be used for all images, which automatically generates optimized WebP versions and responsive `srcset` attributes. For the build process, Sharp handles image resizing and format conversion.

Large hero images should use `loading="eager"` and `fetchpriority="high"`, while below-the-fold images use `loading="lazy"`.

---

## 12. Appendix: Reference Analysis

### 12.1 Current ANM Website (a-n-m.ru)

The current website has the following structure: Homepage with hero, links to About/Gallery/Contacts, and a CTA for office rental. The Gallery section presents the Fidel business center with detailed feature descriptions. The Advantages page lists 12 key selling points with icons. The Contacts page provides departmental phone numbers and email. The About page describes the company's mission and redevelopment focus.

The brand elements to preserve include the red/maroon logo color, the "Александро-Невская Мануфактура" name and logo, the professional tone, the RU/EN language toggle, and the emphasis on building quality and infrastructure.

### 12.2 SPPC Reference Website (sppcm.ru)

The SPPC website demonstrates the target UX quality. Its key patterns that should be adopted include the building-centric navigation with a sub-nav bar showing building names and classes, the zigzag building card layout with large typography and key stats, the "Comfort in details" tabbed section with large photos, the interactive map with scheme/map toggle, the integrated office filter with real-time results, the "Download presentation" feature for each building, the clean footer with departmental contacts, and the "Давайте обсудим детали" CTA pattern.

The SPPC site uses a neon green accent color, which should **not** be adopted — the ANM site should retain its red/maroon brand color. The overall layout structure and information hierarchy, however, serve as an excellent model.

### 12.3 Key Differences Between ANM and SPPC

| Aspect | SPPC | ANM (New Site) |
|---|---|---|
| Number of buildings | 3 (Oscar, Magnus, Gustaf) | 2+ (Fidel, ANM main, future projects) |
| Building locations | Scattered across central SPb | Concentrated on one territory |
| Brand color | Neon green | Red/maroon |
| Company origin | Swedish investment company | Russian developer |
| Unique selling point | Swedish approach, central locations | Redevelopment of industrial territory, Neva embankment |
| Map focus | City-wide map showing all buildings | Territory-focused map showing building cluster |
| Office listings | Cross-building filter | Per-building listings (internal tab) |

---

## Summary of Deliverables

The development of this website requires the following deliverables, organized by phase:

| Phase | Deliverables |
|---|---|
| **Phase 1: Setup** | Astro project initialization, design tokens in CSS, BaseLayout, Header, Footer, SubNav components |
| **Phase 2: Homepage** | Hero section, Building cards, Advantages section, Map placeholder, Office quick view placeholder, About teaser, Contact CTA |
| **Phase 3: Building Pages** | Building detail template, Building hero, Details tabs, Parameter grid, Location section, Infrastructure section, FAQ accordion |
| **Phase 4: Dynamic Islands** | Office filter component, Interactive map (Yandex), Photo gallery with lightbox, Scheme/map toggle |
| **Phase 5: Supporting Pages** | About page, Contacts page, Legal page, Building sub-pages (offices, infrastructure, how-to-get) |
| **Phase 6: Content & Polish** | Content population, image optimization, i18n (English version), SEO meta tags, structured data, responsive testing |
| **Phase 7: Launch** | Performance optimization, Lighthouse audit, deployment setup, DNS configuration, analytics integration |

---

*This document provides the complete specification for developing the УК АНМ website. All design decisions, page structures, and technical choices are based on analysis of the client's mockups, notes, the existing ANM website, and the SPPC reference site. The document should be used as the primary reference throughout the development process.*
