# Canaan Global International — Website

Technical documentation for the corporate marketing website of Canaan Global International, a freight forwarding, customs brokerage, and transportation group headquartered in Tuticorin, Tamil Nadu, India.

This document describes the system end to end: architecture, every route and component, the backend integration contract, SEO implementation, security posture, environment configuration, and deployment. It reflects the actual state of the codebase, not an aspirational design.

---

## 1. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.6 |
| UI library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Icons | Lucide React | 1.16.0 |
| Scroll animation | AOS (Animate On Scroll) | 2.3.4 |
| 3D globe | react-globe.gl (wraps three.js / globe.gl) | 2.38.0 |
| Outbound email | EmailJS (`@emailjs/browser`) | 4.4.1 |
| Backend | Separate FastAPI service (not in this repo) | — |
| Linting | ESLint with `eslint-config-next` | 9.x |
| Package manager | npm | — |

The site is a pure frontend. It has no server-side database, no API routes of its own, and no authentication. All dynamic content is read from a separate FastAPI backend over plain `GET` requests; all outbound mail (contact/quote forms) is sent client-side through EmailJS, bypassing the backend entirely.

---

## 2. Project Structure

```
app/
├── layout.js                 Root layout — fonts, global metadata, JSON-LD, Navbar, Chatbot
├── page.js                   Home page (client component, scroll-snapping section stack)
├── globals.css                Tailwind entrypoint + global scrollbar/theme tokens
├── sitemap.js                 Generates /sitemap.xml
├── robots.js                  Generates /robots.txt
│
├── about/
│   ├── layout.js               Server component — page-specific metadata
│   └── page.js                 Renders <AboutEmbed />
├── services/
│   ├── layout.js
│   └── page.js                 Fetches GET /api/services/
├── cargo/
│   ├── layout.js
│   └── page.js                 Cargo gallery + fleet photo viewer (lightbox)
├── accreditations/
│   ├── layout.js
│   └── page.js                 Fetches GET /api/licenses/
├── updates/
│   ├── layout.js
│   └── page.js                 Fetches GET /api/circulars/ and GET /api/exchange-rates/
│
├── components/
│   ├── Navbar.js                Fixed top navigation, active-route highlighting
│   ├── Hero.js                  Home hero — video background, headline, exchange-rate ticker
│   ├── Group.js                 "Group of companies" cards (CGL, CGSS, CGI, Rehoboth Transports)
│   ├── CustomerGlobe.js         3D interactive globe (react-globe.gl, dynamic import, ssr: false)
│   ├── Timeline.js               Company history timeline (2009 → present)
│   ├── AboutTeaser.js            Home-page teaser section linking to /about
│   ├── AboutEmbed.js             Full About page: founder, achievements, branches, team
│   ├── Fleet.js                  Fleet showcase, fetches GET /api/fleets/
│   ├── Client.js                 Shipping-line client logo strip
│   ├── Contact.js                 Multi-type inquiry form, sends via EmailJS
│   ├── ChatbotWidget.js          Floating chatbot UI ("Joshine")
│   └── AosInit.js                 Initializes the AOS scroll-animation library
│
├── hooks/
│   └── useFadeIn.js              One-shot IntersectionObserver fade-in hook
│
└── lib/
    ├── api.js                    Exports API_BASE_URL
    ├── emailjs.js                 Per-inquiry-type EmailJS credential map
    └── joshine-engine.js          Rule-based chatbot intent/response engine (client-side only)

public/
├── .htaccess                            Apache security headers + 404 routing for the static export (cPanel deployment)
├── favicon.ico, apple-touch-icon.png   Generated from canaan.png's emblem mark
├── canaan.png                          Primary logo (wordmark + emblem), used for OG/Twitter image
├── promo.mp4                            Hero background video — not tracked in git, see note below
├── earth.jpg, earth-tropo.png           Globe texture + bump maps
├── Chatbot.png                          Chatbot avatar
├── cargo/, company/                     Gallery and group-company photography
├── logos/                               16 shipping-line client logos
└── .well-known/security.txt             Vulnerability disclosure contact

next.config.mjs     Security headers, CSP, image remotePatterns, transpilePackages
package.json         Dependencies; postcss override for a transitive CVE (see Section 6)
jsconfig.json        "@/*" path alias → project root
openapi.json          Backend's published OpenAPI schema (reference only, not consumed at runtime)
```

> **`public/promo.mp4` (and any future large media like `.glb` models) is intentionally excluded from git** via `.gitignore` — it's well past GitHub's 100MB push limit, and since deployment is a manual zip-upload to cPanel (Section 12) rather than a git-based deploy, version-controlling it serves no purpose. The file must exist on disk under `public/` before running `npm run build` (anyone cloning this repo fresh needs to drop the video in manually); it is not fetched or restored automatically.

---

## 3. Routing & Pages

All page routes live under the App Router (`app/<route>/page.js`). Every `page.js` in this project is a **client component** (`"use client"`), since each page relies on browser-only state (`useState`, `IntersectionObserver`, scroll listeners) for its entrance animations and data fetching. Because Next.js cannot attach a `metadata` export to a client component, every route that needs page-specific SEO metadata has a sibling **server-component `layout.js`** whose only job is to export `metadata` and render `{children}` — see Section 7.

| Route | Page component | Data source | Purpose |
|---|---|---|---|
| `/` | `app/page.js` | `GET /api/exchange-rates/` (via `Hero.js`), `GET /api/fleets/` (via `Fleet.js`) | Landing page: hero, group-of-companies, globe, timeline, about teaser, fleet, clients, contact |
| `/about` | `app/about/page.js` → `AboutEmbed.js` | `GET /api/owner-image/`, `GET /api/achievements/`, `GET /api/branches/`, `GET /api/teams/` | Founder bio, company achievements, branch network, leadership team |
| `/services` | `app/services/page.js` | `GET /api/services/` | Service catalogue cards |
| `/cargo` | `app/cargo/page.js` | Static gallery images under `public/cargo/` and `public/company/` | Cargo/fleet photo gallery with lightbox viewer |
| `/accreditations` | `app/accreditations/page.js` | `GET /api/licenses/` | Licenses and accreditations; the entire page (and its nav link) is hidden whenever the backend returns zero licenses |
| `/updates` | `app/updates/page.js` | `GET /api/circulars/`, `GET /api/exchange-rates/` | Customs circulars (PDF downloads) and live currency exchange rates |
| `/sitemap.xml` | `app/sitemap.js` | Static route list | XML sitemap for search engines |
| `/robots.txt` | `app/robots.js` | — | Crawl rules, points to the sitemap |

### Home page composition

`app/page.js` renders `Hero.js` (sticky, full-bleed) followed by a vertically stacked, scroll-snapping sequence of sections defined in a `SECTIONS` array: `Group → CustomerGlobe → Timeline → AboutTeaser → Fleet → Client → Contact`. A custom wheel-event handler (`handleWheel`) detects fast/discrete scroll gestures and snaps to the nearest section boundary, while still allowing free native scrolling inside any section taller than 1.5× the viewport (e.g. the photo-heavy sections). Each section fades and scales into view via paired `IntersectionObserver`s (one to reveal the entering section, one to recede the previous section).

---

## 4. Components Reference

| Component | Type | Responsibility |
|---|---|---|
| `Navbar.js` | Client | Fixed top navigation bar with animated active-item slider, mobile hamburger menu, auto-hides on scroll-heavy sections (`[data-hide-navbar]`). Fetches `GET /api/licenses/` once on mount purely to decide whether to show the "Accreditations" nav item. |
| `Hero.js` | Client | Home page hero: full-bleed `promo.mp4` background video, animated two-line wordmark (`<h1>`), tagline, and a live currency exchange-rate ticker fetched from `GET /api/exchange-rates/`. |
| `Group.js` | Client | Presents the four entities under the Canaan group — Canaan Global Logistics, Canaan Global Shipping Services, Canaan Global International, and Rehoboth Transports — each with its own photo set, tagline, and operations list. |
| `CustomerGlobe.js` | Client | Interactive 3D globe (`react-globe.gl`, dynamically imported with `ssr: false` since it depends on WebGL/`window`). Uses `earth.jpg`/`earth-tropo.png` as the globe and bump textures. |
| `Timeline.js` | Client | Five-chapter company history (2009 founding through present), each chapter pairing a photo, a stat, and a short scripture reference consistent with the brand's "Commit, Endure, Achieve, Satisfy" motto. |
| `AboutTeaser.js` | Client | Condensed teaser of the About page shown on the home page — rotating background photography, headline stats (team size, countries, years, shipments), and a "Learn more" link to `/about`. |
| `AboutEmbed.js` | Client | The full `/about` page body: founder section, dynamic achievements grid, branch network with map links, and team grid. Includes a `safeUrl()` helper that allowlists only `http:`/`https:` protocols before any backend-supplied URL is placed into an `href` (defense-in-depth against a compromised or malicious API response injecting a `javascript:` URI). |
| `Fleet.js` | Client | Horizontally scrolling fleet showcase, populated from `GET /api/fleets/`. |
| `Client.js` | Client | Auto-scrolling strip of 16 shipping-line client logos (Maersk, MSC, CMA CGM, COSCO, Evergreen, etc.), driven by AOS for entrance animation. |
| `Contact.js` | Client | The inquiry form — see Section 5 for full detail. |
| `ChatbotWidget.js` | Client | Floating chat widget ("Joshine"). Hidden on `/cargo` (`HIDDEN_PATHS`). Entirely client-side — see Section 8. |
| `AosInit.js` | Client | Mounted once in the root layout; calls `AOS.init()` with the project's shared animation timing/easing config. Renders nothing. |

---

## 5. Contact / Inquiry Form

`Contact.js` presents a single form with a three-way segmented control for **inquiry type**: `Shipping`, `Transportation`, `RFID Seals`. Each type reveals a different set of fields (e.g. port of loading/discharge and container type for Shipping; pickup/delivery for Transportation; quantity and organisation name for RFID Seals), plus shared `name`, `email`, `phone`, and `message` fields. All fields are plain text inputs — **there is no file upload anywhere in this form.**

### Delivery mechanism

The form does **not** call the backend API. On submit, after client-side validation (required fields, email regex, phone regex), it sends the data directly to **EmailJS** via `emailjs.send()`. Each inquiry type is routed to its own, independent EmailJS Service ID / Template ID / Public Key, configured in `app/lib/emailjs.js` and sourced from environment variables (see Section 9):

| Inquiry type | Env var prefix |
|---|---|
| Shipping | `NEXT_PUBLIC_EMAILJS_SHIPPING_*` |
| Transportation | `NEXT_PUBLIC_EMAILJS_TRANSPORTATION_*` |
| RFID Seals | `NEXT_PUBLIC_EMAILJS_RFID_SEALS_*` |

This design means each inquiry type can be configured to land in a different inbox / EmailJS account without any backend changes. Because EmailJS templates use simple `{{variable}}` text substitution (not HTML rendering of user input), there is no reflected-XSS vector through the email itself.

Validation is client-side only. Since there is no backend write path behind this form, this is an accepted, low-severity gap rather than an exploitable one — there is nothing server-side to protect.

---

## 6. Backend API Integration

The frontend's only contract with the backend is **read-only `GET` requests** against a FastAPI service (its schema is checked into this repo as `openapi.json`, for reference only — it is never fetched or parsed at runtime). The base URL is centralized in `app/lib/api.js`:

```js
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.canaanglobalinternational.com";
```

### Endpoints consumed by this frontend

| Endpoint | Consumer | Returns |
|---|---|---|
| `GET /api/exchange-rates/` | `Hero.js` | Current USD/AED/GBP/EUR customs exchange rates |
| `GET /api/achievements/` | `AboutEmbed.js` | Company achievement cards (title, description, image) |
| `GET /api/branches/` | `AboutEmbed.js` | Branch offices (title, address, map link, image) |
| `GET /api/teams/` | `AboutEmbed.js` | Leadership/team members (name, designation, email, image) |
| `GET /api/owner-image/` | `AboutEmbed.js` | Founder portrait URL |
| `GET /api/services/` | `app/services/page.js` | Service catalogue (title, description, image) |
| `GET /api/licenses/` | `app/accreditations/page.js`, `Navbar.js` | License/accreditation cards; an empty result hides the entire page and its nav item |
| `GET /api/circulars/` | `app/updates/page.js` | Customs circulars with PDF links |
| `GET /api/fleets/` | `Fleet.js` | Fleet vehicle entries (title, description, image) |

Every one of these resources is returned by the backend with a ready-to-use, absolute `image_url` (or `pdf_url`) field. The frontend never constructs its own `/api/{resource}/{id}/image`-style URL — it always uses the field the backend supplies directly. This was deliberately verified against `openapi.json`'s schemas during the production audit.

The backend additionally exposes authenticated CMS write endpoints (`POST`/`PUT`/`DELETE` under OAuth2 password-bearer auth, e.g. for managing achievements, branches, teams, licenses, etc.) and a `POST /api/auth/login`. **None of these are used by this frontend** — there is no admin panel, login page, or token storage anywhere in this repository. Those endpoints exist solely for whatever separate CMS/admin tool manages the backend's content.

There is **no `/api/contact/` endpoint** on the backend (older drafts of this codebase assumed one; it was removed once confirmed against the real OpenAPI schema). All inquiry-form delivery goes through EmailJS instead, as described in Section 5.

---

## 7. SEO Implementation

### Metadata architecture

The root `app/layout.js` defines the site-wide default metadata, including a **title template** (`"%s | Canaan Global International"`) so every route's title is unique while staying on-brand. Each route that needs its own title/description overrides the default via a server-component `layout.js` in that route's folder (`about/layout.js`, `services/layout.js`, `cargo/layout.js`, `accreditations/layout.js`, `updates/layout.js`) — necessary because every `page.js` is a client component and cannot itself export `metadata`.

Root metadata includes:

- `metadataBase` set to the canonical production domain, so every relative URL in OG/canonical tags resolves correctly.
- `alternates.canonical` per route (root sets `/`, each sub-layout sets its own path), replacing a previous hardcoded `<link rel="canonical">` that pointed at the homepage on every single page.
- `robots: { index: true, follow: true }` with an explicit Googlebot block.
- `openGraph` and `twitter` (`summary_large_image`) cards with title, description, and a shared share image.
- `icons` pointing at a real, generated `favicon.ico` (multi-resolution) and `apple-touch-icon.png` (180×180), both cropped from the brand emblem in `canaan.png`, and both served from `public/`. The App Router's competing `app/favicon.ico` special-file convention (a leftover `create-next-app` scaffold icon, colliding with the same `/favicon.ico` URL) was removed to leave a single, unambiguous source.

### Structured data

`app/layout.js` injects a JSON-LD `Organization` schema (via `dangerouslySetInnerHTML` with a fully static, hardcoded object — no user input ever flows into it) describing the company's name, founding date, founder, postal address, contact points, service area, and offer catalogue (Freight Forwarding, Customs Brokerage, Transportation).

### Sitemap & robots

`app/sitemap.js` lists all six public routes (`/`, `/about`, `/cargo`, `/services`, `/accreditations`, `/updates`) with appropriate `changeFrequency`/`priority` values. `app/robots.js` allows all crawlers and points to `/sitemap.xml`. Both are statically generated (`export const dynamic = 'force-static'`) and use the canonical production domain.

### Headings

Every page has exactly one `<h1>`: the home page's is the animated wordmark inside `Hero.js`; `/about`'s is the heading inside `AboutEmbed.js`; the remaining routes each have their own page-level `<h1>`.

---

## 8. Chatbot ("Joshine")

`app/lib/joshine-engine.js` is a large (~1,800 line), fully self-contained, rule-based conversational engine — no LLM, no external API, no network calls of any kind. It exports a single entry point, `getResponse()`, consumed by `ChatbotWidget.js`. Internally it does keyword/intent scoring against regex tables and tracks light multi-turn context (e.g. remembering a name the user gave earlier in the conversation, or which service they asked about) in a `ctxRef` object held in component state.

Because the entire engine runs in the browser and never transmits chat content anywhere, there is no data-handling or third-party-disclosure concern for anything typed into the chatbot.

---

## 9. Environment Variables

| Variable | Required | Default | Used by |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | No | `https://api.canaanglobalinternational.com` | `app/lib/api.js` — base URL for every backend `GET` request |
| `NEXT_PUBLIC_EMAILJS_SHIPPING_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | Yes, for the Shipping inquiry flow | — | `app/lib/emailjs.js` |
| `NEXT_PUBLIC_EMAILJS_TRANSPORTATION_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | Yes, for the Transportation inquiry flow | — | `app/lib/emailjs.js` |
| `NEXT_PUBLIC_EMAILJS_RFID_SEALS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` | Yes, for the RFID Seals inquiry flow | — | `app/lib/emailjs.js` |

All of these are intentionally `NEXT_PUBLIC_*` and therefore bundled into client-side JavaScript. This is expected and safe for EmailJS: its "public key" is designed to be embedded in frontend code, and abuse is mitigated on EmailJS's dashboard (domain allowlisting, rate limits), not by keeping the key secret. No genuinely secret credential (database password, private API key, signing secret) exists anywhere in this codebase.

`.env.local` is used for local development and is excluded from version control by `.gitignore`'s blanket `.env*` rule — verified there is no env file tracked in git history.

---

## 10. Security

### HTTP security headers

Defined once in `next.config.mjs` via `headers()`, applied to every route during `npm run dev`. In production this is a static export with no Next.js server (see Section 12), so the identical header set is re-implemented in `public/.htaccess` (Apache `mod_headers`) and is what's actually served once deployed — the two are kept manually in sync.

| Header | Value |
|---|---|
| `Content-Security-Policy` | See below |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `X-DNS-Prefetch-Control` | `on` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (production only) |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` |
| `X-Powered-By` | Removed (`poweredByHeader: false`) |

### Content Security Policy

```
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
img-src 'self' data: blob: https://api.canaanglobalinternational.com https://images.unsplash.com https://*.amazonaws.com https://*.cloudfront.net
font-src 'self' data: https://fonts.gstatic.com
connect-src 'self' https://api.canaanglobalinternational.com https://api.emailjs.com https://fonts.googleapis.com https://fonts.gstatic.com
media-src 'self'
worker-src 'self' blob:
frame-src https://www.google.com https://maps.google.com
frame-ancestors 'none'
object-src 'none'
base-uri 'self'
form-action 'self' https://api.canaanglobalinternational.com
upgrade-insecure-requests   (production only)
```

`script-src` retains `'unsafe-inline'` because the Next.js App Router inlines hydration scripts at build time without nonce support in the open-source runtime; removing it breaks the app. Nonce-based CSP would require a custom server or an edge middleware layer — noted as a future improvement, not a current gap that's practical to close.

In development, `script-src` additionally allows `'unsafe-eval'` (needed for Turbopack/HMR) and `connect-src` allows `localhost:8000` / `127.0.0.1:8000` (local backend) and a `ws://localhost:3000` websocket (HMR). Both relaxations are stripped in production builds.

### Other safeguards

- **Image domain allowlist (dev only)** — `next.config.mjs`'s `images.remotePatterns` restricts which remote hosts `next/image` will fetch/optimize from (production API domain, Unsplash, `*.amazonaws.com`, `*.cloudfront.net`, local dev hosts). This only takes effect under `npm run dev`/`next start`; the production static export sets `images.unoptimized: true` (required by `output: "export"`, see Section 12), so `next/image` renders a plain `<img>` pointing straight at the original URL with no proxying — `remotePatterns` is inert in that mode.
- **URL sanitization** — `AboutEmbed.js`'s `safeUrl()` allowlists only `http:`/`https:` before any backend-supplied URL is placed into an `href`, rejecting `javascript:` URIs even if the backend response were ever compromised.
- **No `eval`/`dangerouslySetInnerHTML` of dynamic data** — the only use of `dangerouslySetInnerHTML` in the codebase is the static, hardcoded JSON-LD block in `app/layout.js`; no user- or API-supplied content is ever injected as raw HTML.
- **No secrets in the repo** — verified by full-text search; the only client-exposed values are EmailJS public keys and the (non-secret) API base URL.
- **No admin/auth surface in this frontend** — the backend's OAuth2 login endpoint has no corresponding page here; there is nothing to attack on this side of that boundary.
- **Vulnerability disclosure** — `public/.well-known/security.txt` lists `canaanglobal@canaanglobal.com` as the contact, per the `security.txt` RFC convention.

### Dependency security

`npm audit` is clean (0 vulnerabilities). A moderate-severity advisory in `postcss` (CVE affecting versions below 8.5.10, used internally by Next.js's own build pipeline — not part of the runtime attack surface) is resolved via a `package.json` `overrides` entry pinning `postcss` to `^8.5.10`, without downgrading Next.js itself (the naive `npm audit fix --force` remediation would have rolled Next.js back to version 9, which would have broken the entire application).

---

## 11. Styling

Tailwind CSS 4 is configured via `postcss.config.mjs` (`@tailwindcss/postcss` plugin) and a single `app/globals.css` entrypoint (`@import "tailwindcss"`). Most components use inline `style={{ ... }}` objects for fine-grained animation/transition control alongside Tailwind utility classes for layout — a deliberate mix favoring precise control over the heavy, bespoke entrance/scroll animations throughout the site. Global theme tokens (`--background`, `--foreground`, font variables) are declared in `:root` and consumed via Tailwind's `@theme inline` block. A custom thin scrollbar style is defined globally for WebKit browsers.

The `Geist` font is loaded via `next/font/google` in the root layout and exposed as the `--font-geist-sans` CSS variable.

---

## 12. Build & Deployment

```bash
npm install        # install dependencies
npm run dev         # local dev server (Turbopack), http://localhost:3000
npm run build       # static export — writes the full site to ./out
npm run lint          # ESLint (eslint-config-next core-web-vitals)
```

`next.config.mjs` sets `output: "export"`, so `npm run build` produces a fully static site in `out/` — plain HTML/CSS/JS with no Node.js server required at runtime. `trailingSlash: true` is set alongside it so every route exports as `route/index.html` (e.g. `out/about/index.html`), which is what conventional static hosts expect when serving a directory URL. `next start` does not apply to this build mode and `next/image` runs with `images.unoptimized: true`, since the Image Optimization API needs a live server.

### Deploying to GoDaddy cPanel (current target)

1. `npm run build` to (re)generate `out/`.
2. Zip the **contents** of `out/` (not the `out` folder itself) — `cd out && zip -r ../site.zip .`
3. In cPanel File Manager, upload `site.zip` into `public_html/` (or the target domain's document root) and extract it there.
4. Confirm `.htaccess` made it into the extracted files (it's hidden — `out/.htaccess`, sourced from `public/.htaccess` in this repo) and that `AllowOverride All` is permitted for the domain (cPanel shared hosting allows this by default).

### Why a server-side `headers()` config still exists

Because this is a static export, **`next.config.mjs`'s `headers()` function has no effect in production** — Next.js itself prints a build warning about this. There is no Next.js server process on cPanel to attach HTTP response headers to. Instead, the exact same security header set (CSP, HSTS, `X-Frame-Options`, etc., see Section 10) is re-implemented in `public/.htaccess` using Apache's `mod_headers`, and copied into `out/.htaccess` on every build like any other `public/` asset. **The two files must be kept in sync by hand** — if you change the CSP in `next.config.mjs`, update `public/.htaccess` to match. `public/.htaccess` also disables directory listing (`Options -Indexes`) and points 404s at the static `404.html` Next.js generates.

`headers()` is left in `next.config.mjs` anyway because it still applies during `npm run dev` (the dev server is a real Node process, independent of `output: "export"`), so local development continues to exercise the same CSP the production `.htaccess` enforces.

---

## 13. Known Limitations

- **CSP `'unsafe-inline'` on `script-src`** — required by the current Next.js App Router hydration mechanism. With the site now deployed as a static export on plain Apache hosting, closing this gap would require moving the CSP enforcement to a CDN/edge layer capable of injecting per-request nonces (e.g. Cloudflare Workers in front of cPanel) — a static `.htaccess` cannot generate a nonce per request.
- **Two header sources to keep in sync** — `next.config.mjs`'s `headers()` (used by `npm run dev`) and `public/.htaccess` (used in production) define the same security headers independently. Apache has no way to read `next.config.mjs`, so any header/CSP change must be applied to both files by hand.
- **Client-side-only form validation** — acceptable today because the inquiry form has no backend write path; would need to be paired with server-side validation if a backend endpoint is ever added for this form.
- **EmailJS rate limiting** — abuse protection for the inquiry form (e.g. spam submissions) is whatever EmailJS's dashboard provides; there is no application-level rate limiting in this codebase.
