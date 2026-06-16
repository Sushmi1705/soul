# Astro Power 24 — Modern Redesign (Frontend Design Demo)

## Original Problem Statement
> "create a design only now use this given url old wesbite we going to modern take the image url use in our demo and content alos take with there excommerce product and services and book appointments for there services like calender like option https://gitikasharma.in/"

## User Choices (Jan 2026)
1. Scope: **Frontend design-only demo** (no backend; all data mocked in React)
2. Design style: **Elegant & spiritual** — earthy tones, warm golds, serif typography
3. Appointment booking: click a service → popup opens showing available time slots
4. Checkout: Add-to-cart + checkout with mocked "Order Placed"
5. Content: scraped real content/images from gitikasharma.in

## Architecture
- **Stack**: React 19 + Tailwind + shadcn/ui, react-day-picker, sonner, lucide-react
- **State**: React Context (`CartContext`) for cart; local state for booking modal
- **Data**: `/app/frontend/src/data/content.js` holds all mock data (services, courses, testimonials, journal, time-slot logic)
- **Routing**: single-page with anchor nav (`#home`, `#about`, `#services`, `#courses`, `#journal`, `#contact`)

## Key Features Implemented (Jan 2026)
- **Hero**: dark cosmic backdrop, elegant split-serif headline "Where the universe whispers its secrets"
- **Sticky header** with transparent → glass-morphism transition on scroll; cart badge live count
- **About**: split layout with Gitika portrait + "15 years guiding souls" badge + skill pillars
- **Services grid**: 6 service cards (Kundali Analysis/Making, Match Making, Numerology, Vastu, Soul Purpose) — each opens a `BookingModal`
- **BookingModal**: 3-step flow — (1) react-day-picker calendar (2) available time slots (deterministic per date, disabled slots shown line-through) (3) name/email/phone form → success confirmation screen with toast
- **Courses e-commerce**: dark section with 6 courses (Akashic, Bhrigu Nandi Nadi, Lal Kitab, Numerology, Palmistry, Vastu Shastra)
- **CartDrawer** (Sheet): 3 stages — cart (qty controls, remove, subtotal) → checkout (form + total) → order placed confirmation
- **Testimonials carousel** with auto-rotate + prev/next
- **Journal** preview (3 cards from real gitikasharma.in blog posts)
- **Footer**: newsletter signup (email validated) + socials + link columns
- All interactive elements use kebab-case `data-testid` attributes

## Testing Summary
- `testing_agent_v3` iteration 1 → **frontend 100% (12/12 acceptance criteria passed)**, no critical issues
- Minor design fix applied: added `scroll-margin-top: 96px` to sections so fixed header no longer overlaps first row on anchor scroll

## What's Deferred / Backlog (P1)
- Real backend (FastAPI + MongoDB) for persisting appointments and orders
- Payment gateway (Stripe/Razorpay) for real checkout
- SendGrid/Resend for appointment & order confirmation emails
- Admin dashboard for Gitika to view/approve bookings
- Dynamic time-slot availability from a backend calendar (Google Calendar integration)
- Individual product detail pages (`/product/:slug`)
- Auth (client accounts + order history)

## Backlog (P2)
- Live horoscope widget (CoinGecko-style API or custom)
- Multi-language (Hindi) toggle
- WhatsApp float + FAQ section
- Blog detail pages with MDX
- Testimonial video carousel

## Credentials / Env
- No auth implemented — public single-page design demo
- Font pipeline: Google Fonts (Cormorant Garamond + Outfit) loaded via `public/index.html`
