# Packaging Hype — Next.js Migration (Phase 1)

A modern, high-performance B2B custom packaging platform built with Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and Prisma ORM.

Migrated from legacy WordPress + WooCommerce + Elementor to deliver sub-second page loads, a streamlined Request-for-Quote (RFQ) flow, and complete preservation of SEO authority.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Language:** TypeScript (Strict mode enabled)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom B2B design system tokens
* **Icons:** [Lucide React](https://lucide.dev/)
* **Database & ORM:** PostgreSQL + [Prisma ORM](https://www.prisma.io/)
* **Forms & Validation:** [Zod](https://zod.dev/) for both client & server validation
* **Images:** Next.js Image Optimization with Cloudinary remote patterns configured

---

## 🎨 Design System Tokens

* **Primary Navy:** `#172455` (Brand core, headings, footer)
* **Coral Accent:** `#FF5548` (Primary Action CTAs, quote buttons)
* **Teal Accent:** `#21AAA5` (Secondary accents, badges, checkmarks)
* **Surface Background:** `#F6F8FA`
* **Typography:** `Poppins` (Body) + `Raleway` (Headings) via `next/font/google`
* **Layout Container:** Max-width 1200px boxed container matching production design

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js v18.18+ or v20+ (tested on Node v24)
* npm, pnpm, or yarn

### 2. Installation

```bash
cd packaginghype-next
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your local environment variables in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/packaginghype?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/packaginghype?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

RESEND_API_KEY=""
QUOTE_NOTIFICATION_EMAIL="info@packaginghype.com"
```

### 4. Prisma Validation & Generation

```bash
npx prisma validate
npx prisma generate
```

### 5. Running Locally

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build & Quality Check

```bash
npm run build
npm run lint
```

---

## 📂 Project Structure

```text
packaginghype-next/
├── prisma/
│   └── schema.prisma              # Complete PostgreSQL schema (Category, Product, Quote, Blog)
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts, Header, Footer & SEO
│   │   ├── page.tsx               # Homepage composing all 7 key sections
│   │   ├── globals.css            # Design tokens & Tailwind CSS directives
│   │   ├── not-found.tsx          # Custom 404 page
│   │   ├── robots.ts              # SEO robots configuration
│   │   ├── sitemap.ts             # Dynamic sitemap generator
│   │   ├── products/
│   │   │   ├── page.tsx           # Product catalog with category filter pills
│   │   │   └── [slug]/page.tsx    # Dynamic single product page with specs & quote form
│   │   ├── categories/
│   │   │   ├── page.tsx           # All 20 categories directory
│   │   │   └── [slug]/page.tsx    # Category detail & product listing
│   │   ├── blog/
│   │   │   ├── page.tsx           # Knowledge hub & blog archive
│   │   │   └── [slug]/page.tsx    # Single article layout with takeaways
│   │   ├── quote/
│   │   │   └── page.tsx           # Dedicated RFQ quote page
│   │   ├── about-us/page.tsx      # Company story & manufacturing values
│   │   ├── contact-us/page.tsx    # Direct contact, phone, email & hours
│   │   ├── terms-and-conditions/  # Legal policies
│   │   ├── privacy-policy/
│   │   ├── shipping-delivery-policy/
│   │   ├── refund-return-policy/
│   │   └── api/
│   │       └── quotes/route.ts    # Zod-validated quote submission endpoint
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Sticky header with mega menu & contact
│   │   │   ├── MobileNavigation.tsx # Slide-over mobile drawer
│   │   │   └── Footer.tsx         # Comprehensive footer with policy & category links
│   │   ├── home/
│   │   │   ├── HeroSection.tsx    # B2B Hero with CTAs and metrics
│   │   │   ├── CategoryShowcase.tsx # Top category cards
│   │   │   ├── WhyChooseUs.tsx    # Verified manufacturing benefits
│   │   │   ├── FeaturedProducts.tsx # Verified products grid
│   │   │   ├── HowItWorks.tsx     # 4-step packaging workflow
│   │   │   └── FaqSection.tsx     # Verified packaging FAQs
│   │   ├── products/
│   │   │   ├── ProductCard.tsx    # Reusable card with quote CTA
│   │   │   └── ProductGrid.tsx    # Configurable responsive grid
│   │   ├── forms/
│   │   │   └── QuoteRequestForm.tsx # RFQ form with dimensions, stock & uploads
│   │   └── ui/
│   │       ├── Container.tsx      # 1200px boxed container
│   │       ├── Button.tsx         # Multi-variant accessible button
│   │       ├── SectionHeading.tsx # Reusable section title with badge
│   │       ├── CategoryCard.tsx   # Category presentation card
│   │       ├── Breadcrumbs.tsx    # Accessible breadcrumb trail
│   │       ├── FAQAccordion.tsx   # ARIA-compliant accordion
│   │       └── QuoteCTA.tsx       # Conversion quote section
│   ├── data/
│   │   └── verified-data.ts       # 20 verified categories, products, FAQs & info
│   ├── lib/
│   │   ├── prisma.ts              # Singleton Prisma Client
│   │   ├── utils.ts               # cn, formatPrice, slugify helpers
│   │   └── env.ts                 # Server-side environment validation
│   └── types/
│       └── index.ts               # TypeScript data definitions
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🔒 Verification & Compliance

* **Data Integrity:** Only verified categories (20 items) and verified sample products from the live site are included. No fabricated prices or false certifications.
* **Quote-Based Model:** Designed specifically for B2B custom box manufacturing without artificial e-commerce carts or checkout barriers.
* **Responsive Viewports:** Tested and formatted for mobile (375px/390px), tablet (768px), laptop (1024px), and desktop (1440px).
