# Canaan Global International — Website

Corporate website for **Canaan Global International**, a freight forwarding, customs brokerage, and transportation company headquartered in Tuticorin, India.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| 3D / Globe | Three.js, react-globe.gl |
| Animations | AOS (Animate On Scroll) |
| Icons | Lucide React |
| Chatbot | Custom rule-based engine (`joshine-engine.js`) |
| Deployment | Vercel (recommended) |
| Backend API | Django REST API at `api.canaanglobalinternational.com` |

---

## Project Structure

```
app/
├── components/          # All UI components
│   ├── AboutEmbed.js    # About page sections (Founder, Team, Achievements, Branches)
│   ├── ChatbotWidget.js # Floating chatbot (Joshine)
│   ├── Contact.js       # Contact & inquiry form (POSTs to API)
│   ├── Navbar.js        # Responsive navigation
│   ├── Hero.js          # Hero section with animated ship
│   ├── Frame.js         # Scroll-driven frame animation (500 frames)
│   └── ...
├── lib/
│   ├── api.js           # API base URL (reads NEXT_PUBLIC_API_BASE_URL)
│   └── joshine-engine.js # Chatbot intent/response engine
├── hooks/
│   └── useFadeIn.js     # IntersectionObserver fade-in hook
├── layout.js            # Root layout, metadata, JSON-LD schema
├── page.js              # Home page
├── robots.js            # robots.txt generation
└── sitemap.js           # sitemap.xml generation
public/
├── frames/              # 500 PNG frames for scroll animation
├── cargo/               # Cargo gallery images
├── company/             # Company/fleet images
├── clients/             # Shipping line logos
└── .well-known/
    └── security.txt     # Vulnerability disclosure contact
next.config.mjs          # Security headers, image domains, CSP
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | No | Backend API base URL. Defaults to `https://api.canaanglobalinternational.com` |

Create a `.env.local` for local development:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

> **Never commit `.env.local` or any file containing secrets to version control.**

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Integration

The frontend communicates with a Django REST backend. All API calls go through `app/lib/api.js`:

```js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  || "https://api.canaanglobalinternational.com";
```

### Endpoints consumed

| Endpoint | Component | Purpose |
|---|---|---|
| `GET /api/owner-image/` | `AboutEmbed.js` | Founder photo URL |
| `GET /api/achievements/` | `AboutEmbed.js` | Dynamic achievements cards |
| `GET /api/branches/` | `AboutEmbed.js` | Branch offices with map links |
| `GET /api/teams/` | `AboutEmbed.js` | Team member list |
| `POST /api/contact/` | `Contact.js` | Inquiry form submission (multipart/form-data) |
| `GET /api/customs-updates/` | `CustomsUpdates.js` | Live customs news feed |

### Contact form payload

The form submits `multipart/form-data` to `/api/contact/`. Fields vary by `inquiry_type`:

- **Shipping**: `name`, `email`, `phone`, `message`, `companyName`, `shippingMode`, `portOfLoading`, `portOfDischarge`, `containerType`, `weight`, `factoryLocation`
- **Transportation**: `name`, `email`, `phone`, `message`, `transportExportImport`, `pickupLocation`, `deliveryLocation`, `transportCargoType`, `containerType`, `weight`
- **RFID Seals**: `name`, `email`, `phone`, `message`, `quantity`, `rfidOrgName`, `rfidIec` (PDF), `rfidGst` (PDF), `rfidSelfSealing` (PDF), `rfidPan` (PDF)

---

## Security

### HTTP Security Headers

All headers are set globally in `next.config.mjs` via `async headers()`:

| Header | Value |
|---|---|
| `Content-Security-Policy` | Full CSP (see below) |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (production only) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera, microphone, geolocation, interest-cohort all denied |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` |
| `X-Powered-By` | Removed (`poweredByHeader: false`) |

### Content Security Policy

```
default-src 'self'
script-src 'self' 'unsafe-inline'          ← required by Next.js App Router hydration
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: blob: https://api.canaanglobalinternational.com https://images.unsplash.com https://*.amazonaws.com https://*.cloudfront.net
font-src 'self' data: https://fonts.gstatic.com
connect-src 'self' https://api.canaanglobalinternational.com https://fonts.googleapis.com https://fonts.gstatic.com
media-src 'self'
worker-src 'self' blob:
frame-src https://www.google.com https://maps.google.com
frame-ancestors 'none'
object-src 'none'
base-uri 'self'
form-action 'self' https://api.canaanglobalinternational.com
upgrade-insecure-requests
```

> **Note on `unsafe-inline`**: Next.js 15+ App Router inlines hydration scripts at build time. Removing `'unsafe-inline'` breaks the application. Nonce-based CSP requires a custom Next.js server or Vercel's Edge Middleware — a recommended future improvement for the highest security posture.

### API Data Sanitization

All data from the backend API that is used in sensitive HTML attributes is sanitized client-side as a defence-in-depth measure:

- **`branch.map_link` → `<a href>`**: validated through `safeUrl()`, which only allows `http:` and `https:` protocols. `javascript:` URIs are rejected.
- **`member.email` → `<a href="mailto:...">`**: validated against an RFC-compliant email regex before being placed in an `href`. Invalid values are rendered as plain text.
- **Text fields** (`title`, `description`, `name`, `role`): rendered as React text nodes — React escapes these automatically; no `dangerouslySetInnerHTML` is used.

### Image Domain Allowlist

Next.js `<Image>` only optimises/proxies images from explicitly allowlisted hostnames (`next.config.mjs` → `images.remotePatterns`):

- `api.canaanglobalinternational.com`
- `images.unsplash.com`
- `*.amazonaws.com`
- `*.cloudfront.net`
- `127.0.0.1:8000` / `localhost:8000` (dev only)

### Vulnerability Disclosure

Security issues can be reported to: **canaanglobal@canaanglobal.com**

The `/.well-known/security.txt` file is served from `public/.well-known/security.txt`.

---

## Deployment (Vercel)

1. Push to your GitHub repository.
2. Import the project in [Vercel](https://vercel.com).
3. Set the environment variable `NEXT_PUBLIC_API_BASE_URL` in Vercel's project settings.
4. Deploy — Vercel will run `npm run build` automatically.

The `upgrade-insecure-requests` CSP directive and HSTS header are only injected in production (`NODE_ENV !== 'development'`), so local dev still works over HTTP.

---

## Chatbot (Joshine)

`app/lib/joshine-engine.js` is a fully client-side, rule-based conversational engine. It uses:

- Keyword/intent matching via regex scoring
- A multi-turn context object (`ctxRef`) for name recall, service preference, and follow-up handling
- Zero external API calls — all responses are hardcoded

No user chat messages are transmitted to any server or third party.

---

## Scroll Animation

The Hero section uses a 500-frame PNG sequence (`public/frames/001.png` → `public/frames/500.png`) driven by `IntersectionObserver` and `requestAnimationFrame`. Frames are preloaded into `<img>` elements off-screen on mount.

---

## Known Limitations & Roadmap

- **`'unsafe-inline'` in CSP**: Blocked by Next.js App Router architecture. Nonce-based CSP via custom server or Vercel Edge Middleware is the path forward.
- **No rate limiting on `/api/contact/`**: Must be enforced at the Django API layer.
- **CSRF protection**: The contact form relies on Django's CSRF handling. Ensure the backend sets `SameSite=Strict` or `SameSite=Lax` cookies and validates the CSRF token on `POST /api/contact/`.
- **File upload validation**: PDF uploads for RFID Seals are validated client-side by MIME type hint only. The backend **must** validate file type, size, and content before storing.
