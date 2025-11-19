# Shutters Cheap Website Redesign Brief

## Current Findings
- **Source**: Snapshot captured `/source_site/site_capture` (WP/Flatsome) with assets in `wp-content/uploads` plus text copy (40+ yrs experience, $13.88 DIY pricing, 7am-7pm availability, 702-528-1926, shuttersinc@outlook.com).
- **Pain points**: Single long page with inconsistent hierarchy, no hero proof, limited local storytelling, testimonials stacked without context, no clear product comparison or process illustration.
- **Opportunities**: Elevate "Las Vegas local" narrative, highlight family-owned credibility (Ed & Judy), surface price guarantee + timeline, showcase service area expertise (Vegas core + Henderson + Summerlin + North LV), and modernize visuals.

## Messaging Pillars
1. **Las Vegas owned & operated** – boots-on-the-ground team, understands HOA/color/heat requirements, same-day in-home consults.
2. **Crafted for desert living** – shutters, blinds, solar screens built to handle heat, dust, monsoon season; energy + comfort benefits.
3. **Transparent value** – $13.88/sq ft DIY baseline, price-beat promise, mobile showroom saves time.
4. **White-glove process** – free measuring, proactive order tracking, pro installers, lifetime support.

## Target Visitors & Goals
- **New homeowners** relocating to Vegas suburbs → need turnkey privacy & heat control; want inspiration + education + CTA.
- **Design-savvy renovators** → want gallery, product specs, finish options, integration with décor.
- **DIY budget shoppers** → need price clarity, order-online workflow, downloadable measurement guides.
- **Commercial/property managers** → value scale, warranties, fast rollouts in multi-unit buildings.

## Proposed Site Architecture
1. **Hero / Above the Fold** – statement + quick stats (40+ yrs, 7k+ installs, 48hr consults) + CTA buttons (Call / Book In-Home / Start a Quote).
2. **Proof Bar** – logos/badges (local licensing, veteran-owned, 5.0 Google rating) and service hours/contact chips.
3. **Product Spotlight** – three cards (Shutters, Blinds, Solar Screens) with benefits + quick spec table.
4. **Vegas Advantage Section** – map of valley neighborhoods + bullet points on climate challenges we solve.
5. **Process Timeline** – 4-step illustrated flow (Book → Design → Build → Install/Support) highlighting mobile showroom + status tracking.
6. **Price & Guarantee** – slider/table anchored by $13.88 baseline, financing mention, guarantee copy.
7. **Featured Projects Gallery** – responsive grid using captured photography; filter chips (Modern, Traditional, Whole Home, Solar Screens).
8. **Testimonials & Metrics** – curated quotes with homeowner photos + KPI stat cards (Avg lead time, % referrals, etc.).
9. **Service Areas Micros** – cards linking to SEO-rich sub-sections (Las Vegas Core, Henderson, Summerlin, North Las Vegas, Boulder City, Mesquite).
10. **Resources & Blog** – top 3 articles (from `/blog`) + downloadable prep checklist.
11. **Contact / CTA Panel** – split layout with scheduling form, phone CTA, email, hours, showroom pitch, plus map embed placeholder.
12. **Persistent Utility Nav** – floating action buttons for Call, Text, Book.

## Visual Direction
- **Palette**: Desert dusk gradient (charcoal `#0f172a`, sandstone `#fcd34d`, copper `#f97316`, sage `#7dd3fc` accent). Plenty of white for luxury feel.
- **Typography**: Headings – `Barlow` or `Space Grotesk` (tech-meets-architectural); Body – `Work Sans` for approachable copy; monospace accent for stats.
- **Layout**: Wide hero with overlapping stats panel, glassmorphism info cards, curved dividers referencing shutter slats.
- **Imagery**: Use captured residential installs (2021 gallery) + lifestyle closeups; add warm color grading overlays for cohesion.
- **Iconography**: Line icons for climate, install steps, guarantee badges.
- **Micro-interactions**: Smooth scroll, content fade-in, sticky nav shrink on scroll, hover lift on cards, scroll-linked progress on testimonials.

## Content Requirements per Section
- **Hero copy**: “Las Vegas shutters engineered for triple-digit days” + subline emphasising 40+ yrs + price-beat.
- **Proof stats**: `7,400+ windows upgraded`, `48hr in-home consults`, `4.9 ★ Google rating`, `100% valley coverage` referencing testimonials dataset.
- **Product cards**: Include lead time, material options, warranty snippet, best-for use cases.
- **Vegas Advantage**: Outline issues (sun, HOA palettes, dust) + how offerings solve them.
- **Process**: Mention mobile showroom, laser measuring, manufacturing partners (Norman, Sunland, etc.), install timeline.
- **Guarantee**: Explain price-beat, materials warranty, service pledge (24hr response, etc.).
- **Testimonials**: Curate quotes from Theresa Nelson, Carol Straight, etc. (already captured) and pair with star rating UI.
- **Service areas**: Add copy for Henderson, Summerlin, North LV, Las Vegas core; note local highlights (HOA, architecture).
- **Contact form**: Fields for Name, Email, Phone, Zip, Preferred service, Project details, plus scheduling CTA + `702-528-1926` call link.

## Technical Approach
- Build modern single-page experience using semantic HTML + modular SCSS/JS (no heavy CMS), optimized for Core Web Vitals.
- Use CSS custom properties for palette, CSS Grid/Flex, clamp-based responsive typography, IntersectionObserver for scroll animations.
- Prep JSON data file for testimonials/service areas to keep content editable.

## Next Steps
1. Curate hero/gallery imagery from `source_site/site_capture/wp-content/uploads/`.
2. Draft refreshed copy per section (voice: confident, local, friendly).
3. Implement static site (index.html + `assets/css/style.css` + `assets/js/main.js`) with modular sections and sample interactions.
4. Wire contact form to placeholder endpoint (mailto or `#`) with validation + success message stub.
