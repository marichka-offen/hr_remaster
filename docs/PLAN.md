# Development Plan

The site is built against mock content first. Storyblok is added last, behind the same interface.

**How content flows:** pages → `src/lib/content` → `src/mocks/*` today. Later the bodies of the functions in `src/lib/content` call Storyblok and map its responses to `src/types/content.ts`. Components and pages don't change.

The parked Storyblok work is the `WIP` commit on `feat/storyblok`.

---

## Token review

The palette and contrast are in good shape after the design-token PR. All text pairings pass WCAG AA. The issues are mostly readability for long-form reading, plus a missing semantic layer.

### Should fix

| # | Issue | Why it matters | Proposal |
|---|---|---|---|
| T1 | **Body font was Cormorant Garamond at 18px** | Its designer calls Cormorant "a free display type family" ([README](https://github.com/CatharsisFonts/Cormorant)). Measured x-height is 0.386 em, so at 18px it has the x-height of Georgia at 14.4px (see Measurements). The mocks label articles at 25–60 min. | ✅ **Done:** body is **Literata** (OFL, self-hosted, weight and optical-size axes, latin + latin-ext). Article prose is 18px (`--text-prose`) in `--text` (12:1 contrast). Tried Atkinson (lost the heritage look) and Newsreader first. |
| T2 | **No line-length token** | Article body is 752px wide at 18px. Measured: about 107 characters per line in Cormorant, about 87 in Literata. Bringhurst: 45–75, about 66 ideal. WCAG 1.4.8 (AAA): at most 80. | ✅ **Done:** `--measure: 55ch`, applied globally to `p, li, blockquote, dd, figcaption`. 1ch is the width of "0", wider than an average letter, so the common `65ch` advice overshoots (about 79 real characters in Literata); 55ch gives about 66. The article column follows the measure. Figures and timelines (phase 5) can break out wider. |
| T3 | ✅ **No semantic colour layer** | Components reference palette names directly (`--navy`, `--text-light`, `--parchment`). Re-theming, a later dark mode, or a "colour X means Y" decision means touching every file. | Add role tokens on top of the palette: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-heading`, `--color-link`, `--color-border`, `--color-border-strong`. Migrate gradually. |
| T4 | ✅ **Labels and metadata at 12px** (`--text-xs`): form labels, eyebrows, buttons, chips | Uppercase plus wide tracking at 12px is the legibility floor. | Raise `--text-xs` to 0.8125rem (13px), or move form labels and buttons to `--text-sm`. |
| T5 | ✅ **No skip-to-content link** | Every page has `<main id="main">`, but nothing links to it. The redesign notes list it as a requirement. | Add it to `BaseLayout`, visible on focus. |
| T6 | ✅ **Two near-identical secondary text colours**: `--text-light` #5a5a5a (6.1:1) and `--text-muted` #675f53 (5.5:1) | They are hard to tell apart and get used inconsistently. | Collapse them into `--color-text-secondary` (warm, #675f53) and keep one. |

### Nice to have

- ✅ **T7 Font naming:** now `--font-body`, `--font-display`, `--font-quote` and `--font-ui`.
- ✅ **T8 Shadows** hard-code `rgba(26,35,50,…)`. Use `color-mix(in srgb, var(--navy) N%, transparent)`, like the other tints.
- ✅ **T9 Z-index scale** has only nav and header. The TOC drawer, overlay, reading-progress bar and back-to-top button need slots: `--z-progress`, `--z-overlay`, `--z-drawer`.
- ✅ **T10 Border contrast:** `--parchment-dark` on parchment is 1.16:1. That's fine for decorative rules. Any border that marks an interactive control's edge needs 3:1, which is why `--color-border-strong` is in T3. Inputs already use `--text-muted`, which is correct.
- ✅ **T11 Font fallback metrics:** add `size-adjust` and `ascent-override` fallback `@font-face` rules for Georgia and Arial to cut layout shift while the fonts swap in. Also preload DM Sans, which the nav uses above the fold.
- ✅ **T12 Naming:** `--white` is ivory (#fefcf9) and `--black` is navy-black. Consider `--ivory` and `--ink`.
- **T13 Breakpoints:** the SCSS uses max-width (desktop-first) at 480/768/1024. That works; the redesign notes asked for mobile-first. Not worth a rewrite. New components should use min-width.

### Already good

- Contrast: gold is only ever text on dark backgrounds (5.9:1). `--gold-dark` on parchment is 5.4:1. Body text is 12:1.
- Fluid type with `clamp()` and a rem base, so zoom still works.
- Focus ring tokens swap correctly on dark surfaces through the `on-dark` mixin.
- 44px tap target token. `prefers-reduced-motion` is handled globally.
- A 4px spacing scale and fluid section and gutter spacing.

### Contrast reference (computed)

| Pair | Ratio | |
|---|---|---|
| `--text` on parchment | 12.1 | AAA |
| `--text-light` on parchment | 6.1 | AA |
| `--text-muted` on parchment | 5.5 | AA |
| `--gold-dark` on parchment | 5.4 | AA |
| `--gold` on parchment | **2.4** | Never use for text or icons on light |
| `--gold` on navy | 5.9 | AA |
| white on gold | **2.6** | Never use; solid-gold buttons use navy text (5.9) |
| white 70% on burgundy | 4.9 | AA, but just barely; watch it on gradients |

### Measurements
Computed with fontTools from the font files: x-height of the `x` glyph, and average advance width over a paragraph from the Virginia article. Lines are 752px wide at 18px. These are estimates; real rendering adds kerning and hyphenation.

| Font | x-height (em) | Same x-height as Georgia at | Chars per line |
|---|---|---|---|
| Cormorant Garamond | 0.386 | 14.4px | 107 |
| EB Garamond | 0.405 | 15.1px | 109 |
| Newsreader | 0.441 | 16.5px | 98 |
| Georgia (reference) | 0.481 | 18.0px | 94 |
| Source Serif 4 | 0.492 | 18.4px | 87 |
| Atkinson Hyperlegible Next | 0.496 | 18.5px | 95 |
| Lora | 0.500 | 18.7px | 89 |
| Literata | 0.507 | 19.0px | 87 |
| Merriweather | 0.555 | 20.8px | 87 |

### Sources
- Cormorant described as a display family: [CatharsisFonts/Cormorant README](https://github.com/CatharsisFonts/Cormorant)
- Line length 45–75, about 66 ideal: Bringhurst, *The Elements of Typographic Style*, pp. 25–36 (via [Wikipedia: Line length](https://en.wikipedia.org/wiki/Line_length))
- 80-character maximum: [WCAG 2.2 Understanding SC 1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation)
- x-height as the measure of print size: [Legge & Bigelow 2011, "Does print size matter for reading?"](https://pmc.ncbi.nlm.nih.gov/articles/PMC3428264/). Note: a [2025 VSS poster](https://www.visionsciences.org/presentation/?id=2645) found overall print size mattered more than x-height, which mattered mainly at small sizes.

---

## Phases

### 0. Foundation ✅ (this branch: `feat/mock-content`)
- [x] Sanity client, queries, studio and dependency removed
- [x] CMS-agnostic types in `src/types/content.ts`, with a `RichText` block type in place of Sanity portable text
- [x] `src/lib/content` reads from `src/mocks/`, which uses real copy from `designs/`
- [x] Shared `RichText.astro` replaces four copies of the portable-text parsing
- [x] Article drop cap moved to `::first-letter`, so screen readers no longer hear a split word
- [x] Fixed: the BookPreview CTA defaulted to `/book`, a 404

### 1. Tokens and accessibility baseline
- [x] T1 body font: Literata at 18px for article prose
- [x] T2 measure
- [x] T3 colour roles (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-text-strong`, `--color-border`, `--color-border-strong`, `--color-accent`, `--color-focus`...); all components migrated
- [x] T4 `--text-xs` raised to 13px
- [x] T5 skip-to-content link in `BaseLayout`
- [x] T6 `--text-light` merged into `--color-text-secondary` (stone #675f53)
- [x] T8 shadows on `color-mix`; T9 z-index slots for sticky, progress, overlay, drawer, skip link
- [x] T10 `--color-border-strong` for control edges; T11 metric-matched fallback fonts, DM Sans preloaded
- [x] T12 palette renamed: `--ivory`, `--ink`, `--charcoal`, `--stone`
- [x] Heading order: every page has one h1 and never skips a level (cards, footer, credentials, promos fixed)
- [x] Housekeeping: README rewritten, unused DropCap removed, `npm run check` added and passing (0 errors)

### 2. Global chrome
- [ ] Header: highlight the active link on nested routes (`/articles/foo` should mark Articles; today it's an exact match)
- [ ] Header: the **search button does nothing**. Hide it until search ships in phase 8
- [ ] Sticky slim header on scroll, as in the mock
- [ ] Mobile nav: check focus trap, Escape to close, and returning focus to the button
- [x] Footer: topic links go to `/articles?topic=…`; the filter already reads and writes `?topic=`

### 3. Listing pages
- [ ] Articles: empty state and a result count (`?topic=` sync already works)
- [ ] Articles: sort by newest or by period. This needs a `publishedAt` and a period start year in mock data
- [ ] Books: the grid is fine for two books; consider a feature layout while there are fewer than four

### 4. Article page: the core reading experience
From `designs/article-page`, `hussites` and `eighty-years-war-timeline`:
- [ ] Hero: breadcrumb, tags, title, subtitle, period range, author, read time
- [ ] Prose styles on `--measure`
- [ ] TOC: sticky sidebar on desktop, drawer on mobile, generated from `heading` blocks (they carry `id`s), with scroll-spy
- [ ] Reading-progress bar and back-to-top button
- [ ] Sources and bibliography section, collapsible
- [ ] Related articles: same topic first, then most recent
- [ ] Auto-compute `readTime` from the body (from TODO.md)

### 5. Article content blocks
The mocks are hand-built per article: siege cards, garrison cards, weapon cards, ship manifests, strength bars. Building each one bespoke won't scale once an editor is writing in a CMS. Generalise them into a small block library, all added to the `RichTextBlock` union:

| Block | Covers in the mocks |
|---|---|
| `figure` (image, caption, credit) | portraits, maps, article figures |
| `callout` (variant: note / insight / reading) | insight-box, reading-callout |
| `primarySource` (quote, source, date) | primary-source |
| `collapsible` (title, children) | collapsible-section, decade toggles, sources-toggle |
| `timeline` (groups → events with date, title, text, badge) | tl-*, campaign-year, decade-section, garrison timeline |
| `factCard` (title, badge, key/value rows, body) | siege-card, garrison-card, weapon-card, faction-card, regiment-card |
| `dataList` (rows with label, value, optional bar) | ship manifest, strength bars, personnel rows, crew lists |
| `legend` (colour dot + label) | legend-item |
| `sectionNav` (jump links) | era-nav, section-nav |

Each block gets a mock instance in one "kitchen sink" article, so the whole library can be checked on one page.

### 6. Book detail page
From `designs/about-book-pages`: cover hero, purchase CTA and excerpt link, an "About the Book" prose block, a details table (publisher, period, format), a preview-pages gallery, and a promo for the other book.

### 7. Contact
- [ ] Netlify Forms: a success page (`action="/contact/thanks"`), a honeypot field, and inline validation messages
- [ ] Show the email address as a fallback

### 8. Polish and launch readiness
- [ ] SEO: canonical URLs, an OG image, `@astrojs/sitemap`, Article JSON-LD
- [ ] Images through `astro:assets` (responsive, lazy, WebP/AVIF)
- [ ] **Print stylesheet.** The old site had a print button, and long sourced articles get printed
- [ ] axe and Lighthouse pass, plus a keyboard-only walkthrough
- [ ] **Search** with Pagefind (static index, no backend), wired to the header button

### 9. Storyblok (last)
- [ ] Model components in Storyblok to match `src/types/content.ts` one to one (sections and rich-text blocks)
- [ ] Write the adapter: replace the bodies in `src/lib/content` and map Storyblok rich text to `RichText`
- [ ] Draft and preview mode with the Visual Editor, and a webhook to trigger a Netlify rebuild on publish
- [ ] Migrate the mock content into Storyblok as seed data

---

## Decisions log
- **2026-11-07:** body font is Literata (tried Atkinson Hyperlegible Next, which lost the heritage look, then Newsreader). Search is deferred to phase 8. `pages-mocks/` deleted; `designs/` is the design reference and is committed.
