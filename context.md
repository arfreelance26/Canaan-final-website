# Canaan Global International — Full Codebase Context

_Last audited: May 23, 2026_

---

## 1. Project Overview

| Field | Value |
|---|---|
| **Company** | Canaan Global International (CGI) |
| **Business** | Freight Forwarding · Customs Brokerage · Transportation |
| **Founded** | 2009 |
| **Founder** | Arun Samuel Alfred |
| **Tagline** | Commit · Endure · Achieve · Satisfy |
| **HQ** | Tuticorin, India (per schema) |
| **Website** | www.canaanglobal.com |
| **Email** | canaanglobal@canaanglobal.com |
| **Phone** | +91 90470 12891 / 0461 2900886 |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.6 (App Router) |
| **React** | 19.2.4 |
| **Styling** | Tailwind CSS v4 via `@tailwindcss/postcss` |
| **Font** | Geist Sans (`next/font/google`) |
| **Icons** | lucide-react v1.16.0 |
| **World Map** | react-svg-worldmap v2.0.2 (dynamic, SSR disabled) |
| **Linting** | ESLint 9 + eslint-config-next |

---

## 3. Design System

### Palette
- **Primary background**: `#f5f4f0` — warm off-white (used on ALL sections)
- **Near-black**: `#1a1916`
- **Dark green accent**: `#2d4a3e`
- **Overlay backgrounds**: `rgba(0,0,0,0.35–0.72)` on image cards
- **White cards**: `bg-white` / `bg-white/80–90`

### Typography
- Font: Geist Sans
- Headings: bold, `tracking[-0.03em]`, `clamp()` responsive sizing
- Labels: 10–11px, uppercase, `tracking-[0.12–0.18em]`, `text-neutral-400`
- Body: 14–15px, `text-neutral-500`, relaxed line-height

### Card Pattern ("Bento Grid")
Every section uses rounded-2xl cards with corner-cut pill labels:
- **Top-left** and **top-right** corners have small info badges (bg-[#f5f4f0] or white/90)
- **Bottom** overlay with content, also rounded-t-2xl
- `.bento-card` class applies hover lift: `translateY(-5px)` + shadow

### Animation System (`globals.css`)
- `fadeInUp`, `fadeInDown`, `scaleUp`, `smoothPulse` keyframes
- `.animate-fade-in-up`, `.animate-fade-in-down`, `.animate-scale-up`, `.animate-pulse-slow` utilities
- `.bento-card` hover transition: `cubic-bezier(0.16, 1, 0.3, 1)` spring easing
- Stagger delay utilities: `.delay-75` through `.delay-500`

---

## 4. File Structure

```
app/
  layout.js           — Root layout, Navbar, metadata, SEO JSON-LD
  page.js             — Home page (client component, loader logic)
  globals.css         — Tailwind v4 + animation system
  about/
    page.js           — /about route (standalone page)
  components/
    Hero.js           — Full-height hero section
    Navbar.js         — Fixed split navbar (logo left, links right)
    Loading.js        — Animated loader (canvas + progress bar)
    Timeline.js       — Milestone history cards
    Frame.js          — 500-frame scroll-driven canvas animation
    Fleet.js          — Horizontal-scroll fleet card strip
    World.js          — SVG world map + regional stats
    Client.js         — Client logo grid (logo.dev API)
    Testimonial.js    — Auto-playing testimonial carousel
    Contact.js        — Contact info + form
    About.js          — About section (imported but NOT rendered on home)
    Founder.js        — Founder card (imported but NOT rendered on home)
  hooks/
    useScrollReveal.js — Continuous IntersectionObserver visibility hook
public/
  frames/             — 500 PNGs (001.png … 500.png) for scroll animation
```

---

## 5. Routes

| Route | File | Description |
|---|---|---|
| `/` | `app/page.js` | Single-page landing with loader logic |
| `/about` | `app/about/page.js` | About / team page |

---

## 6. Home Page Section Order (`page.js`)

Loader: Shows `LoadingPage` on first visit (4.5s), controlled by `sessionStorage["cgi_loaded"]`.

| # | Component | Section ID | Description |
|---|---|---|---|
| 1 | `DavidHazHero` | _(none)_ | Full-height hero, cargo vessel image |
| 2 | `TimelineSection` | _(none)_ | Scrollable company milestones |
| 3 | `FrameScrollSection` | `service` | 500-frame canvas scroll animation |
| 4 | `FleetSection` | `fleet` | Horizontal-scroll fleet cards |
| 5 | `WorldNetworkSection` | `world-network` | World map + region stats |
| 6 | `ClientsSection` | `clients` | Logo grid, 15 clients |
| 7 | `TestimonialsSection` | _(none)_ | Auto-playing carousel |
| 8 | `ContactSection` | `contact` | Info cards + contact form |

---

## 7. Component Details

### Navbar (`Navbar.js`)
- **Fixed**, split layout: logo + name `top-left rounded-br-2xl`, nav `top-right rounded-bl-2xl`
- Nav items: `Home`, `About`, `Service`, `Fleet`, `Clients`, `Contact`
- `Home` → scrolls to top or pushes `/`
- `About` → pushes `/about`
- `Service / Fleet / Clients / Contact` → scroll to section by ID (with 150ms delay if navigating from `/about`)
- Mobile: hamburger toggles a dropdown (hidden by default)
- Logo: Anchor icon in black square pill

### LoadingPage (`Loading.js`)
- Canvas animates warm blob background
- Progress bar with 5 status steps ("Initialising…" → "Almost ready…")
- Triggered on first visit via `sessionStorage["cgi_loaded"]`
- Hardcoded 4.5s in `page.js` (via `setInterval`)
- Accepts `onComplete` + `duration` props but `page.js` does not use them (uses its own timer)

### Hero (`Hero.js`)
- Full-viewport, `min-h-screen`, `bg-[#f5f4f0]`
- Background: external Unsplash URL (cargo vessel)
- Bottom-left: eyebrow + "Canaan" + "Global International" + tagline
- Bottom-right: scroll indicator with `animate-bounce` arrow

### Timeline (`Timeline.js`)
- 8 milestones: 2009 (Founded) → 2025 (Award)
- Three internal hooks: `useParallax`, `useFadeIn`, `useActiveIndex`
- Active milestone highlighted by scroll position
- Tilt effect on card hover (mouse position tracking → `rotateX/Y`)
- `MilestoneCard` accepts `ref: outerRef` via props (non-standard; not using `forwardRef`)

### Frame Scroll (`Frame.js`)
- 500 PNG frames in `/public/frames/`
- `TOTAL_FRAMES = 500`, `SCROLL_MULTIPLIER = 5` → section height = `500vh`
- Preloads all frames on mount; renders on `<canvas>` with cover-fit
- Scroll progress 0→1 maps to frame 0→499
- 4 copy step overlays at frames 0, 100, 250, 400: "Global Reach", "Customs Cleared", "Last Mile Delivered", "Built for Scale"
- Loading bar shown until all 500 frames loaded
- Dark `#0d0c0a` background (only dark section in app)

### Fleet (`Fleet.js`)
- 6 vehicles: Flatbed (30T), Semi Trailer (40T), Box Truck (10T), Tanker (25T), Refrigerated (15T), Heavy Hauler (60T)
- Horizontal scroll track driven by vertical scroll progress
- Section height: `calc(100vh + 300vh)` (6 cards × 50vh extra)
- All images: external Unsplash URLs
- Corner badges: top-left tag, top-right capacity, bottom name/type

### World Network (`World.js`)
- `react-svg-worldmap` with 20 country data points (shipment volume values)
- 5 regions: Middle East, Asia Pacific, Europe, Americas, Africa
- `useFadeIn` hook (local, defined inline — duplicate of pattern)
- Animated header image (Unsplash: galaxy/earth from space)

### Clients (`Client.js`)
- 15 clients: Amazon, DHL, Maersk, FedEx, Samsung, Siemens, Nestle, Unilever, IKEA, Adidas, Sony, Philips, Caterpillar, 3M, Honeywell
- Logos via `https://img.logo.dev/{domain}?token=pk_TCYqoFGsRJK7RG3c9IqeQQ&size=128`
- Grayscale default → full color + name on hover
- Fallback text if image 404s
- `useFadeIn` re-triggers on every scroll in/out (not one-shot)

### Testimonials (`Testimonial.js`)
- 5 testimonials (India, Ireland, Germany, USA, UAE)
- Auto-plays every 4s; pauses on hover
- Slide-in/out CSS animations injected via `<style>` tag
- Avatar initials with deterministic color based on name char code
- Metric highlight per testimonial (e.g. "98% On-time rate")

### Contact (`Contact.js`)
- Info cards: Email, Phone, Head office, Working hours
- Map image card (Unsplash)
- Form fields: Full name, Email, Phone, Service (dropdown), Message
- **No backend** — `handleSubmit` sets `submitted: true` only; no API call
- Success state shows a checkmark with "Message received!"

### About (`About.js`)
- Stats: 15+ years, 50K+ shipments, 30+ countries
- Pillars: Global reach, End-to-end cargo, On-time delivery, Scalable
- Uses `useScrollReveal` from hooks (continuous toggle)
- ⚠️ **Imported in `page.js` but NOT rendered** — dead import

### Founder (`Founder.js`)
- Founder: Arun Sam Alfred, photo from Unsplash placeholder
- Pull quote: "Every shipment represents someone's livelihood."
- ⚠️ **Imported in `page.js` but NOT rendered** — dead import
- ⚠️ `alt` text says "John Doe" (placeholder not updated)

### About Page (`/about/page.js`)
- Standalone page with its own `FounderSection` (inline, not imported from `Founder.js`)
- Has its own `useFadeIn` hook (duplicate)
- Sections: hero banner, founder photo + bio, achievements/stats, mission quote

---

## 8. Hooks

| Hook | File | Behavior |
|---|---|---|
| `useScrollReveal` | `app/hooks/useScrollReveal.js` | Continuous toggle — `true` when in view, `false` when out |
| `useFadeIn` (inline) | World.js, Client.js, Contact.js, about/page.js | Same as above, duplicated in 4 files |

---

## 9. SEO & Metadata (`layout.js`)

- Title: "Canaan Global International"
- Description: Full freight forwarding description
- Keywords: 9 terms including Tuticorin, cargo, logistics
- OpenGraph + Twitter cards
- JSON-LD `Organization` schema with full address (Tuticorin), phone, email, founder
- Canonical: `https://www.canaanglobal.com`

---

## 10. Known Issues & Inconsistencies

### Data Inconsistencies
| # | Issue | Location |
|---|---|---|
| 1 | Contact phone `+1 (800) 000-0000` is a placeholder | `Contact.js` `CONTACT_INFO` |
| 2 | Contact office says "Dubai, UAE" but schema + real address is Tuticorin, India | `Contact.js` vs `layout.js` |
| 3 | Founder alt text says "John Doe" | `Founder.js` img alt |
| 4 | Founder bio says "John founded…" in body text | `Founder.js` paragraph |

### Code Issues
| # | Issue | Location |
|---|---|---|
| 5 | `About` imported but never rendered in home page | `page.js` |
| 6 | `FounderSection` imported but never rendered in home page | `page.js` |
| 7 | Navbar navigates to `#world` but section ID is `world-network` | `Navbar.js` vs `World.js` |
| 8 | `useFadeIn` hook duplicated in 4 files | World.js, Client.js, Contact.js, about/page.js |
| 9 | `MilestoneCard` uses `ref: outerRef` via props instead of `forwardRef` | `Timeline.js` |
| 10 | Duplicate `z-50` on right nav div | `Navbar.js` |
| 11 | `LoadingPage` has `onComplete`/`duration` props but `page.js` ignores them, using its own timer | `page.js`, `Loading.js` |
| 12 | Contact form has no API/email integration — submit is fake | `Contact.js` |
| 13 | All section images are external Unsplash URLs — no local fallback, CDN-dependent | Multiple components |
| 14 | `logo.dev` API token exposed in client-side code | `Client.js` |

---

## 11. Assets

| Asset | Path | Count |
|---|---|---|
| Frame PNGs | `/public/frames/001.png` … `500.png` | 500 |
| Favicon | `/favicon.ico` | — |
| Apple Touch Icon | `/apple-touch-icon.png` | — |
| Logo | `/logo.png` | — |

All section images (hero, fleet, world, contact, about) are **external Unsplash URLs**, not hosted locally.

---

## 12. Placeholder / TODO Items

- [ ] Replace `+1 (800) 000-0000` with real phone number in `Contact.js`
- [ ] Change "Dubai, UAE" to correct office location in `Contact.js`
- [ ] Fix Founder.js: replace "John Doe" alt text and "John founded" body copy with "Arun Sam Alfred"
- [ ] Fix Navbar: `#world` → `#world-network` (or change World.js id to `world`)
- [ ] Either render `About` + `Founder` on home page or remove unused imports
- [ ] Implement real contact form submission (email API, e.g. Resend, Nodemailer)
- [ ] Extract `useFadeIn` into `app/hooks/useFadeIn.js` to eliminate duplication
- [ ] Consider hosting critical images locally in `/public/` for reliability
