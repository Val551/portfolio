# design_plan.md

Portfolio site for Fabio Campos — ECE @ Carnegie Mellon.
Single page. Web. Themed on the PlayStation 5 system UI.

Status: **plan only. No implementation code has been written.**
Strategic context lives alongside this in `PRODUCT.md`.

---

## 0. The one decision this plan turns on

Your brief describes the theme as "PS5 dark navy/black gradient + electric blue
accent, glowing game tile cards." I want to push back on that description before
anything else, because it is the difference between a site that reads as
*PlayStation* and one that reads as *every dark developer portfolio ever made*.

Navy gradient + electric-blue glow + glowing cards is the single most saturated
aesthetic in the personal-portfolio category. If we build that, a recruiter's
pattern-matcher fires "template" in under a second, and the PS5 reference is lost
on them entirely.

The actual PS5 UI is a different object:

| The reflex version | What the PS5 actually does |
|---|---|
| Navy-to-black CSS gradient | A near-black, *desaturated* blue-gray base (`#1B1E23`-ish) under an enormous, heavily-blurred image |
| Electric blue accent everywhere | **White** is the accent. PlayStation blue appears rarely, mostly on focus and selection |
| Every card glows | Exactly *one* element is focused at a time. The glow is a focus state, not decoration |
| Uniform grid of tiles | One large focused tile, a row of smaller siblings. The asymmetry *is* the layout |
| Static background | The background is derived from the focused item, so the page's color changes as you move |

That last row is the important one. **The dynamic background is not a decoration;
it is the color system.** It means the site is not "a navy page" — it is a page
whose ambient color shifts per section and per focused project. That single
mechanic solves the monotony problem, gives each section its own art direction,
and is unmistakably PlayStation.

Everything below is built on the right-hand column.

---

## 1. PS5 patterns → site sections

Six PS5 mechanics, each mapped to one section. Nothing is included because
"portfolios have that section"; each earns its place by having a real console
analogue.

### 1.1 Dynamic Ambient Background → the whole page

**PS5 behavior.** Behind the home screen sits the focused game's key art, scaled
up, blurred to roughly 80–120px, desaturated, and darkened under a gradient
scrim. Change focus and it crossfades. It is what makes the OS feel alive without
any element visibly moving.

**Web translation.** A single fixed-position layer at the root, below all
content. It holds two stacked image layers that crossfade. An IntersectionObserver
tracks the active section; focusing a project tile also drives it. Each section
and each project declares an ambient source, so scrolling the page continuously
re-tints it.

Implementation notes:
- Blur via `filter: blur(80px)` on a **downscaled** image (roughly 64×64px source,
  scaled up). Blurring a full-resolution image is the performance trap here —
  a tiny source blurred huge is visually identical and effectively free.
- Crossfade with `opacity` on the two layers, ~700ms. This is plain CSS. Do not
  route it through the animation library.
- A fixed gradient scrim always sits above the image and below content. This is
  non-negotiable: it is the only thing guaranteeing text contrast over an
  arbitrary image.
- Reduced motion: crossfade still happens (it is opacity, not movement), but drops
  to ~200ms. Optionally, a static ambient per section.

### 1.2 Media Bar → the navigation

**PS5 behavior.** A slim horizontal bar at the top. Left side: the section
switcher (Games / Media). Right side: a small strip of circular icons — profile,
search, settings — plus a live clock. Extremely thin, very high contrast, and it
never competes with content.

**Web translation.** A sticky top bar, roughly 56–64px tall, with the same
left/right split.
- **Left:** "Fabio Campos" as the persistent identity, plus the section switcher.
  The active section underlines/highlights and animates between positions.
- **Right:** the circular icon strip — GitHub, LinkedIn, résumé, email. These are
  the site's ambient CTAs, always reachable.
- **Clock:** the PS5 bar shows a live clock. Keeping a real one is a small,
  cheap, genuinely delightful fidelity detail. Recommended.
- On mobile the bar collapses: identity stays, sections move to a bottom-sheet.

### 1.3 Focused Hero Tile → Hero

**PS5 behavior.** On boot, the leftmost tile is focused. It sits large, the
ambient background is its art, and the tile's metadata sits beneath it.

**Web translation.** The hero is the "focused tile" of the site itself. Name,
`ECE @ Carnegie Mellon`, tagline, and the primary CTA. First load runs a short,
deliberate entrance choreography (see §4) — the one place on this site where
ambitious motion is warranted, exactly like a console boot.

The tagline is currently **TBD** in your brief and is the highest-value missing
piece of copy on the page. See §7.

### 1.4 Activity Feed → Experience / Journey

**PS5 behavior.** PS5 Activities are horizontal cards showing what you did,
when, and how far you got — each with a thumbnail, a title, a short line of
detail, and a timestamp. They are scannable and chronological.

**Web translation.** This is the single best mapping in the plan, and it is why
"Experience" should be presented as a *feed*, not a résumé list. Each role —
Microsoft Azure Security, CMU TA, MoonRanger, CMU Research — becomes an activity
card: organization, role, dates as a system-style timestamp, and 2–3 bullets.
Cards are horizontal, left-aligned to a vertical spine, and reveal on scroll with
a short stagger.

Deliberate constraint: these cards are **not** the same shape as project tiles.
Activity cards are wide and text-led; project tiles are large and image-led. Two
different card shapes for two different content types keeps this off the
"identical card grid" failure mode.

### 1.5 The Home Row → Projects

**PS5 behavior.** The heart of the interface. A horizontal row of game tiles.
The focused one is noticeably larger and brighter; siblings are smaller and
dimmer. Critically: **the content below the row swaps to match whatever is
focused** — its activities, its media, its news — without any page navigation.

**Web translation.** This is the centerpiece of the site and the reason the
single-page structure works.

- A horizontal row of project tiles. One is focused at a time (larger, lit,
  slightly raised, with a soft white focus ring).
- Below the row sits a **detail panel** that swaps content to match the focused
  project: description, stack, role, links, and metrics.
- Focus follows hover *and* keyboard *and* touch. Arrow keys move between tiles —
  which is both faithful to a console and a genuine accessibility win.
- The row scrolls horizontally with snap points on narrow viewports; on desktop
  it fits, with the focused tile expanding and siblings compressing.
- The focused-tile → detail-panel relationship is where the animation library
  earns its keep (shared-layout transitions, §4).

With 5–10 projects this row is the right density. If it grows past ~8, add a
second row rather than shrinking tiles.

### 1.6 Control Center → Skills, and Contact

**PS5 behavior.** Pressing the PS button raises a strip of circular icons across
the bottom — a compact, single-row set of system controls with labels appearing
on focus.

**Web translation, two uses:**

**Skills.** Your list has 15 entries (Python, JS, TS, React, Node, SQL/NoSQL, R,
HTML/CSS, Linux, Git, Docker, MongoDB, C/C#/C++, Rust, Java). Rendering 15
identical icon cards in a grid is the exact pattern this site is supposed to be
better than — and it is also uninformative, since a flat grid says a recruiter
should weigh Rust and HTML equally. The Control Center strip solves both: a
compact horizontal strip of circular icons, grouped into 3–4 rows by category
(Languages / Web / Systems & Tools / Data), with the label revealing on focus.
Small, dense, and it reads as *system chrome* rather than as content — which is
the correct hierarchy, because skills are the least persuasive thing on this page.

I would go further and suggest weighting: a small set marked as primary. Flagged
as an open question in §7 rather than assumed.

**Contact.** The Control Center's power/action panel becomes the contact section:
a small panel of large, unmissable actions with email as the primary. Not a
contact form — a form is friction, and a recruiter would rather use their own
mail client with your address in their sent folder. Email address shown in full
and click-to-copy.

---

## 2. Design system

### 2.1 Color

**Strategy: Committed.** A single dark base carries the surface, with the ambient
layer supplying variable color per context. This is not "restrained dark mode";
the ambient layer means color is doing real work.

The PS5 base is not navy. It is a very dark, very low-chroma blue-gray. Chroma
stays under 0.015 on every surface token — the moment surfaces get saturated,
it reads as the template.

All values OKLCH.

```
/* Surfaces — the dark chassis */
--void:            oklch(0.155 0.006 265)   /* deepest; page ground behind everything */
--base:            oklch(0.215 0.008 265)   /* the PS5 body color */
--surface:         oklch(0.275 0.010 265)   /* cards, panels */
--surface-raised:  oklch(0.335 0.012 265)   /* focused tile, hovered rows */
--hairline:        oklch(1.000 0     0 / 0.10)

/* Ink */
--ink:             oklch(0.985 0     0)     /* headings, focused labels */
--ink-muted:       oklch(0.760 0.004 265)   /* body copy — the floor for body text */
--ink-faint:       oklch(0.620 0.005 265)   /* timestamps, metadata, labels only */

/* Accent — used sparingly, on purpose */
--ps-blue:         oklch(0.540 0.170 252)   /* PlayStation blue; selection, links */
--ps-blue-lift:    oklch(0.700 0.140 248)   /* focus ring, active indicator */
--focus-white:     oklch(1.000 0     0 / 0.85) /* the PRIMARY focus treatment */

/* Ambient — set per section/project at runtime */
--ambient-image:   <url>
--ambient-tint:    <oklch, sampled or authored per item>
```

Three rules that keep this from drifting into the template:

1. **White is the accent.** Focus rings, active states, and emphasis are white
   first. PlayStation blue is a *seasoning* — the active nav indicator, link
   underlines, the selection state. If blue is showing up on more than ~5% of the
   surface, we have drifted.
2. **No glow as decoration.** Glow (`box-shadow` bloom) appears only on the
   single focused element. An unfocused tile has no glow. Ever.
3. **Contrast is verified, not assumed.** Body text hits ≥4.5:1, large text ≥3:1.
   The dark base makes this easy; the *ambient image* makes it hard. Hence the
   mandatory scrim: any text over the ambient layer sits on a gradient scrim
   tuned so the worst-case image still clears 4.5:1. This gets measured at build
   time against the actual images, not eyeballed.

### 2.2 Typography

Procedure, run honestly:

1. **Three voice words:** machined, ambient, effortless.
2. **Reflex picks:** Inter, Space Grotesk, IBM Plex Sans. All three are
   training-data defaults and all three are rejected.
3. **The physical object:** Sony's proprietary UI face is **SST** (Monotype,
   directed by Akira Kobayashi, 2013) — a neo-grotesque with faint humanist
   warmth, engineered for screen UI across 90+ languages. It is not available for
   web licensing, so we need a close relative, not a lookalike gimmick.
4. **Recommendation: Hanken Grotesk.** Neo-grotesque skeleton, softened
   terminals, a genuinely wide weight range (300 → 800), and it holds up at both
   11px label size and 96px display size. It sits in SST's lineage without being
   Helvetica cosplay. Free, on Google Fonts, variable.
   *Alternate if you dislike it:* Schibsted Grotesk (slightly cooler, tighter).

**One family, not two.** A console OS is monotypographic, and a single family
with committed weight contrast is stronger here than a display/body pair. We get
contrast from weight and scale, not from a second typeface.

Numerals use `font-variant-numeric: tabular-nums` throughout — dates, GPA, the
media-bar clock. Small detail, very legible as *care*.

**Scale** — fluid, ratio ≈1.25:

```
--t-display: clamp(2.75rem, 1.6rem + 5.2vw, 5.25rem)   /* hero name. Ceiling 84px */
--t-h1:      clamp(2.0rem,  1.4rem + 2.6vw, 3.25rem)
--t-h2:      clamp(1.5rem,  1.2rem + 1.4vw, 2.25rem)
--t-h3:      clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)
--t-body:    1.0625rem                                  /* 17px */
--t-small:   0.9375rem
--t-label:   0.8125rem
```

- Display letter-spacing `-0.025em`. Never past `-0.04em`.
- Line-height on dark: body `1.65` (light text on dark needs the extra room).
  Display `1.05`.
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on prose.
- Prose measure capped at 68ch.
- **No tiny uppercase tracked eyebrows above every section.** The media bar
  already provides section labeling; repeating it as a kicker on each section is
  the AI tell.

### 2.3 Spacing and radius

Spacing, 4px-based, used with rhythm rather than uniformly — tight inside a card,
generous between sections:

```
--s-1: 0.25rem   --s-2: 0.5rem   --s-3: 0.75rem  --s-4: 1rem
--s-5: 1.5rem    --s-6: 2rem     --s-7: 3rem     --s-8: 4rem
--s-9: 6rem      --s-10: 8rem
--section-y: clamp(4rem, 2rem + 8vw, 9rem)
```

Radius — the PS5 uses *restrained* radii on tiles (small relative to tile size)
and perfect circles on control icons. Big soft 24px rounding is a modern-web
habit, not a PS5 one:

```
--r-sm: 4px    /* chips, inputs */
--r-md: 8px    /* activity cards */
--r-lg: 12px   /* project tiles */
--r-full: 999px /* control-center icons, avatar */
```

### 2.4 Elevation

Two tools only: a hairline border and a shadow. No glassmorphism as a default
surface — the ambient blur is already doing that job at the page level, and
stacking blur on blur is both muddy and expensive. Backdrop blur is used in
exactly two places: the media bar and the mobile sheet, where PS5 uses it too.

```
--e-flat:    none
--e-card:    0 1px 0 var(--hairline) inset
--e-raised:  0 8px 24px -8px oklch(0 0 0 / 0.5)
--e-focus:   0 0 0 2px var(--focus-white), 0 12px 40px -8px oklch(0 0 0 / 0.6)
```

### 2.5 Motion principles

The PS5's motion signature: **fast, confident, exponentially eased, never
bouncy.** Focus snaps; ambient drifts.

```
--ease-out-expo:  cubic-bezier(0.16, 1, 0.30, 1)
--ease-out-quart: cubic-bezier(0.25, 1, 0.50, 1)

--d-focus:    220ms   /* tile focus scale + glow */
--d-ui:       320ms   /* panel swaps, nav indicator */
--d-expand:   420ms   /* tile → detail shared-layout transition */
--d-ambient:  700ms   /* background crossfade */
```

Rules:
- No bounce, no elastic, no spring overshoot. A console UI is precise.
- Animate `transform` and `opacity`. Blur and shadow are permitted where they
  materially improve the effect (the ambient layer, the focus bloom) but are
  never animated on more than one element at a time.
- **Motion is not applied uniformly per section.** One orchestrated hero entrance;
  a stagger within the activity feed because a feed genuinely reads sequentially;
  the project row animates on *focus*, not on scroll. No identical fade-up
  applied to every section — that is the reflex, and it is visible.
- **Reveals enhance an already-visible default.** Content is never gated behind a
  class-triggered transition. If JS fails or the tab is backgrounded, everything
  is still there and readable.
- `@media (prefers-reduced-motion: reduce)`: all transforms drop to opacity
  crossfades at ≤150ms; the ambient crossfade shortens; the hero choreography
  becomes a single fade. Nothing is removed, only calmed.

---

## 3. Component inventory

Your proposed list, with names adjusted where the pattern changed.

**Chrome**
| Component | Notes |
|---|---|
| `AmbientBackground` | Fixed root layer; two crossfading blurred images + scrim. Owns ambient state. |
| `MediaBar` | Sticky nav. Identity, section switcher w/ animated indicator, icon strip, live clock. |
| `MobileSheet` | Bottom-sheet nav for narrow viewports. |
| `ControlIcon` | Circular icon button. Used in the media bar and in Skills. Label on focus. |

**Content**
| Component | Notes |
|---|---|
| `HeroTile` | The focused-tile hero. Name, affiliation, tagline, primary CTA. Owns the boot choreography. |
| `SectionHeader` | Deliberately minimal — no uppercase eyebrow. |
| `ActivityCard` | Experience entry. Wide, text-led, spine-aligned, timestamped. |
| `ActivityFeed` | Ordered list of `ActivityCard`, staggered reveal. |
| `ProjectTile` | Image-led tile. Focused / unfocused states. |
| `ProjectRow` | Horizontal row, focus management, keyboard arrow nav, scroll-snap on mobile. |
| `ProjectDetail` | Swapping detail panel below the row. Shared-layout target. |
| `ControlStrip` | Skills. Grouped rows of `ControlIcon`. Replaces `SkillIconGrid`. |
| `AboutPanel` | Profile-card treatment: education, GPA, graduation, coursework. |
| `ContactPanel` | Power-menu treatment. Email primary + click-to-copy, LinkedIn secondary, résumé. |

**Primitives**
`FocusRing` (shared focus treatment), `Chip` (stack tags), `Timestamp` (tabular, system-styled), `ExternalLink`.

**Hooks / state**
`useAmbient()` (the ambient context + setter), `useActiveSection()` (IntersectionObserver), `useRovingFocus()` (arrow-key nav for the project row and control strip).

---

## 4. Tech architecture

### 4.1 Stack — confirming, with three corrections

Your lean is **Next.js + TypeScript + Tailwind + Framer Motion on Vercel.**
I confirm it. Three notes:

1. **"Framer Motion" is now just `motion`** (motion.dev). Same library, renamed
   and rewritten. Install `motion`, import from `motion/react`. Worth knowing so
   you're not installing a deprecated package name.
2. **Next.js is somewhat heavyweight for one static page** — Astro would ship
   less JS. I still recommend Next, for three reasons: you already know it, it is
   the credible choice to show a recruiter who will look at your repo, and
   `next/image` gives us the blurred-placeholder pipeline that *is* the ambient
   background mechanic, essentially for free. Configure it as a static site
   (SSG); there is no server, no API, no runtime.
3. **Tailwind v4** with the CSS-first `@theme` block. All tokens from §2 live in
   one `theme.css` as CSS custom properties and become Tailwind utilities
   automatically. This matters: the design system stays readable as CSS rather
   than being buried in a JS config object.

**Scope discipline for the motion library:** `motion` handles the tile→detail
shared-layout transition (`layoutId`), the nav indicator, and the hero
choreography. It does **not** handle the ambient crossfade, hover states, or
focus rings — those are CSS transitions. Routing every animation through the
library is how these sites end up janky.

No state manager. Two React contexts (`AmbientContext`, `NavContext`) plus local
component state is the entire state architecture.

### 4.2 File structure

```
portafolio/
├─ PRODUCT.md
├─ design_plan.md
├─ public/
│  ├─ ambient/            # 64px ambient sources, one per section + project
│  ├─ projects/           # full-res project imagery
│  ├─ icons/              # skill glyphs (SVG)
│  └─ fabio-campos-resume.pdf
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx       # fonts, metadata, AmbientBackground mount
│  │  ├─ page.tsx         # the single page: section composition
│  │  └─ globals.css      # @import tailwind; @theme tokens
│  ├─ components/
│  │  ├─ chrome/          # AmbientBackground, MediaBar, MobileSheet, ControlIcon
│  │  ├─ sections/        # Hero, About, Experience, Skills, Projects, Contact
│  │  └─ ui/              # FocusRing, Chip, Timestamp, ExternalLink
│  ├─ content/            # ← all copy lives here, typed
│  │  ├─ profile.ts
│  │  ├─ experience.ts
│  │  ├─ projects.ts
│  │  └─ skills.ts
│  ├─ hooks/              # useAmbient, useActiveSection, useRovingFocus
│  ├─ lib/                # cn(), constants, motion presets
│  └─ styles/
│     └─ theme.css        # the §2 token set
└─ ...config
```

The `content/` split is deliberate: every string and every project lives in typed
data files, so you can update the site for a new application without touching a
component. That separation is itself a small piece of evidence for a recruiter
reading the repo.

### 4.3 How state and animation actually work

**Active section.** One IntersectionObserver in `useActiveSection`, watching all
six section elements with a `rootMargin` biased toward the viewport's upper third.
It writes to `NavContext`. The media bar reads it for the indicator; the ambient
layer reads it to swap the background. One observer, not one per section.

**Tile focus.** `ProjectRow` owns a `focusedId`. It is set by pointer enter,
by keyboard (roving tabindex — the row is one tab stop, arrows move within it),
and by tap on touch. `focusedId` drives three things simultaneously: the tile's
own visual state, the `ProjectDetail` contents, and the ambient background. This
is the PS5 mechanic and it needs to be exactly one source of truth.

**Tile → detail transition.** `motion`'s `layoutId` shared between the focused
tile's image and the detail panel's image, so the image appears to travel. This
is the one visual flourish worth real effort.

**Mobile menu.** Local state in `MediaBar`, rendered as a native `<dialog>` or
the popover API — **not** an absolutely-positioned div, which would be clipped by
the sticky bar's stacking context.

**Z-index** as a named scale in `theme.css`: `--z-ambient: 0`, `--z-content: 10`,
`--z-sticky: 100`, `--z-sheet-backdrop: 200`, `--z-sheet: 210`, `--z-toast: 300`.
No arbitrary `9999`.

### 4.4 Performance and accessibility budget

- LCP < 2.0s on a mid-tier laptop over 4G. The ambient images are 64px sources,
  so they are effectively free; the hero's real image is the LCP element and gets
  `priority`.
- Ambient blur uses `will-change` only while crossfading, then releases it.
- Target ≥95 Lighthouse across all four categories, verified in-browser during
  the polish pass.
- WCAG 2.2 AA. Every interactive element reachable and operable by keyboard,
  with a visible focus ring that is *the same* white ring as the console focus
  state — the theme and the accessibility affordance are the same object.
- Semantic landmarks: `<header>`, `<main>`, six `<section>` with `aria-labelledby`.
- The project row is an ARIA `listbox`-style roving-focus widget with proper
  `aria-selected` and `aria-controls` pointing at the detail panel.
- `prefers-reduced-motion` honored everywhere (§2.5).
- The site renders complete and readable with JavaScript disabled.

---

## 5. Sitemap

Single page, six sections, in this order:

1. **Hero** — `#top`. Focused-tile treatment. Name, ECE @ CMU, tagline, primary CTA.
2. **About** — `#about`. Profile-card treatment. Degree, CMU, graduation May 2027, coursework, GPA (pending a decision — see §7).
3. **Journey** — `#journey`. Activity feed. Microsoft Azure Security → CMU TA → MoonRanger → CMU Research.
4. **Projects** — `#projects`. Home row + detail panel. Engineering OS, Multithreaded Web Proxy, + others.
5. **Skills** — `#skills`. Control-center strip, grouped.
6. **Contact** — `#contact`. Power-menu panel. Email primary, LinkedIn secondary, résumé.

Ordering note: **Projects before Skills is deliberate.** A recruiter evaluating
an ECE student weighs built artifacts far above a technology list, and the
section order should reflect what we want them to spend their attention on.

---

## 6. Content plan — mapped, with gaps flagged

Mapping what you provided. **I have not invented anything to fill a gap**; every
blank is listed in §7 instead.

| Section | Provided | Missing / ambiguous |
|---|---|---|
| Hero | Fabio Campos; ECE @ CMU | **Tagline is marked TBD.** This is the most important sentence on the site. |
| About | B.S. ECE, CMU, GPA 3.49, May 2027 | Coursework list was truncated to "coursework: ...". Need the actual courses. Also: whether to display GPA at all. |
| Journey | Four roles named: Microsoft Azure Security, CMU TA, MoonRanger, CMU Research | **The bullets were referenced ("as provided") but not actually included.** Also missing: dates for each, exact titles, and team/org context for MoonRanger and the research role. |
| Projects | Two named: Engineering OS, Multithreaded Web Proxy | **Descriptions were referenced but not included.** Also missing: repo/demo links, stack per project, your role, and — critically — **imagery**. You said 5–10 pieces; only 2 are named. |
| Skills | 15 technologies listed | Whether to weight/prioritize them, and how to group. Icon source. |
| Contact | fabiocam@andrew.cmu.edu | LinkedIn URL. GitHub URL. Résumé PDF. |

### The imagery problem — the plan's #1 dependency

This needs its own callout because it can sink the design. The PS5 look is
**image-led**: blurred key art is the entire ambient system, and project tiles are
image tiles. Right now there are zero assets, and two of your named projects
(a multithreaded web proxy, an OS) have no natural screenshot — a proxy has no UI.

Three viable sources, in order of preference:

1. **Real artifacts.** Terminal captures, architecture diagrams, benchmark plots,
   `htop`/trace output, board photos for hardware work. For systems projects this
   is *more* persuasive than a UI screenshot would be, and it is on-brand for
   "unusually rigorous."
2. **Purpose-built visuals.** A clean architecture diagram per project, rendered
   in the site's own palette. High effort, very high payoff — it reads as
   someone who can explain their own system.
3. **Generated ambient fields.** For anything with no visual output, a canvas or
   SVG scene seeded per project. Legitimate as *ambient* source material, but not
   as a project tile's primary image.

What I want to avoid, and will not do silently: flat colored rectangles standing
in for images. That is the failure mode, not a minimalist choice.

---

## 7. Open questions — I need answers before building

Ordered by how much they block.

**Blocking**
1. **The tagline.** One line under your name. What is the single claim? (I can draft 3–5 options against the belief ladder in `PRODUCT.md` if you'd rather react than write.)
2. **The experience bullets.** Your brief said "bullets as provided" but they didn't come through. Please paste the actual content for all four roles, with dates and exact titles.
3. **The project descriptions.** Same — "descriptions as provided" didn't come through. For each: what it does, your role, the stack, and the hardest part.
4. **Projects 3 through N.** You said 5–10 pieces; two are named. What are the others? If it really is only two, the Projects row design changes materially and I'd want to rethink §1.5.
5. **Imagery.** Which of the three §6 sources do you want to use, and do you have any existing assets — screenshots, diagrams, photos?

**Important**
6. **Links.** LinkedIn URL, GitHub URL, and do you have a résumé PDF to host?
7. **GPA.** 3.49 is solid but not a headline. Show it, or omit it and let the work carry the weight? My inclination is to omit it from the hero and include it quietly in About.
8. **Coursework.** The actual list, and whether you'd like it filtered to the 5–6 most relevant rather than shown in full.
9. **Skill weighting.** Should any subset be marked as primary strengths? A flat list of 15 reads as less confident than 5 strong + 10 familiar.

**Worth deciding, not blocking**
10. **Anti-references.** In the question round you replaced the anti-reference list with your brief, so `PRODUCT.md` records only "not a generic dev portfolio template." Are the others fair game to avoid too — dark-gradient dev portfolio, Notion/resume dump, template startup landing, overdesigned agency showreel?
11. **Accessibility.** Confirming WCAG 2.2 AA as the target, with full keyboard operability and reduced-motion support.
12. **The typeface.** Hanken Grotesk is my recommendation. Do you want to see it against Schibsted Grotesk before we commit?
13. **The live clock** in the media bar. Charming fidelity detail, or too cute?

---

## 8. Build order

Nothing here starts until you approve this plan and answer §7's blocking items.

1. **Scaffold.** Next.js + TS + Tailwind v4, static export config, `motion`, fonts, repo, Vercel project. Confirm a blank deploy is green before writing any UI.
2. **Design tokens.** `theme.css` with the complete §2 token set. Build a throwaway `/styleguide` route showing every token, type step, radius, and easing curve. This is the foundation everything else reads from; getting it right here prevents drift later.
3. **Content layer.** Type the `content/*.ts` files against your real answers from §7. Content before components, so no placeholder ever gets written.
4. **Chrome.** `AmbientBackground` + `MediaBar` + `useActiveSection`. Getting the ambient crossfade and the sticky bar right first means every subsequent section is built inside the real environment rather than against a plain background.
5. **Hero.** `HeroTile`, static first. Choreography deferred to step 10.
6. **Journey.** `ActivityCard` / `ActivityFeed`. The most content-dependent section and the most straightforward to build.
7. **Projects.** `ProjectRow` + `ProjectTile` + `ProjectDetail`, including roving focus and the shared-layout transition. **The hardest part of the build — budget accordingly.**
8. **Skills + Contact.** `ControlStrip`, `ContactPanel`, click-to-copy.
9. **Responsive pass.** Every section at 360 / 768 / 1024 / 1440 / 1920. Specifically verify heading copy does not overflow at any width, and that the project row's mobile scroll-snap behaves.
10. **Motion pass.** Hero boot choreography, feed stagger, nav indicator, focus timing. Then the full reduced-motion alternative.
11. **Accessibility + performance audit.** Keyboard-only traversal of the whole page, contrast measured against real ambient images, Lighthouse, axe. Fix what it finds.
12. **Polish.** Real-browser review at every breakpoint, copy edit, metadata, OG image, favicon, 404. Ship.

Steps 1–4 are safe to start the moment the plan is approved, since they depend on
tokens rather than copy. Steps 5–8 need §7's blocking answers.

---

*End of plan. No implementation code has been written. Awaiting go-ahead.*
