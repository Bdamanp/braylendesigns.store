# Braylen Digital — Project Primer

Read this at the start of every session. Update it at the end of every session with anything new learned.

---

## The Business

**Braylen Digital** is a web design service for small businesses in Plainfield and Indianapolis, Indiana.

- **Founder:** Braylen (15 years old, Plainfield, IN)
- **Founded:** 2025
- **Mission:** Agency-quality websites at prices small businesses can actually afford
- **Tagline:** "Agency quality. Small-business prices."
- **Website:** https://braylendesigns.store
- **GitHub:** https://github.com/Bdamanp/braylendesigns.store (branch: `master`)

---

## Services & Pricing

| Service | Price Range |
|---------|------------|
| Website Design (new build) | $500 – $3,000 |
| Website Redesign | $800 – $2,500 |
| Monthly Maintenance | $50 – $150/mo |

- Turnaround: 5–7 business days for most sites
- Every site: mobile-responsive, SEO-optimized, loads under 3 seconds
- Serves: plumbers, salons, restaurants, barber shops, real estate, contractors, auto shops, dentists, fitness studios, SaaS startups

---

## Tech Stack

- **Language:** Vanilla HTML, CSS, JavaScript (no frameworks)
- **Fonts:** Outfit (display), Plus Jakarta Sans (body) — loaded from Google Fonts
- **Analytics:** PostHog (`phc_4zFkZs0F4crKb1Es9lXXW9lSHndkgI2MgkCgXpGb2L9`)
- **Hosting/Deploy:** Vercel (auto-deploys from GitHub `master` branch)
- **Contact API:** `api/contact.js` (serverless function)
- **Config:** `vercel.json`

---

## Project Structure

```
braylendesigns.store-main/
├── index.html          ← Main homepage (active, has PostHog)
├── about.html
├── services.html
├── portfolio.html
├── robots.txt          ← AI bot permissions
├── sitemap.xml
├── api/
│   └── contact.js      ← Contact form serverless handler
├── braylendesigns/     ← Older version of the site (no PostHog)
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── portfolio.html
│   └── braylen-digital-landing.html
└── braylen-video/      ← Remotion video project (separate, has node_modules)
```

**Root pages are the live/active ones.** The `braylendesigns/` subfolder is an older version kept for reference.

---

## Design System

```css
--bg: #08090d          /* Dark background */
--accent: #4f8fff      /* Blue accent */
--purple: #a78bfa      /* Purple accent */
--white: #edeef1
--text: #c8cad0
--text-muted: #6e7179
--font-display: 'Outfit'
--font-body: 'Plus Jakarta Sans'
```

- Dark theme, glassmorphism cards, gradient text animations
- Scroll-reveal animations (`.reveal` class + IntersectionObserver)
- Particle canvas on hero
- Blob morph background animations

---

## Git Workflow

- Remote: `https://github.com/Bdamanp/braylendesigns.store.git`
- Branch: `master` (not `main` — remote uses `master`)
- Deploy: Vercel auto-deploys on push to `master`
- Always `git pull origin master` before pushing to avoid rejection

---

## AI SEO (added 2026-04-05)

All pages have:
- JSON-LD structured data (LocalBusiness, Service, FAQPage, Person, WebPage schemas)
- Open Graph + Twitter Card meta tags
- Canonical URL tags

Root-level files added:
- `robots.txt` — allows GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot; blocks CCBot
- `sitemap.xml` — covers all 4 main pages

---

## Key Contacts / Testimonials

- James Blackwood — Owner, Blackwood Contracting, Avon IN (5-star review on site)

---

## Session Log

| Date | What was done |
|------|--------------|
| 2026-04-05 | Added AI SEO schema markup, OG tags, robots.txt, sitemap.xml to all 9 HTML pages. Pushed to GitHub. |
