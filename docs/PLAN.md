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
- [x] Header: active link covers nested routes (Articles stays lit on article pages; `aria-current="page"` on the exact page, `"true"` inside a section)
- [x] Header: search button removed until search ships in phase 8
- [x] Slim header on scroll (72px → 56px, smaller logo, soft shadow); `--header-offset` keeps the progress bar and contents list attached to it
- [x] Mobile nav: rebuilt with the menu button inside the island, `aria-expanded`, focus trap, Escape to close, focus returns to the button, current section highlighted; header stays visible above the menu
- [x] Footer: topic links go to `/articles?topic=…`; the filter already reads and writes `?topic=`

### 3. Listing pages
- [x] Articles: result count ("3 articles in Colonial History"), announced to screen readers when the filter changes
- [x] Articles: sort by newest or by period (earliest first). Uses `startYear`, taken from the mocks' date ranges; Scottish Traditions has none and sorts last
- [x] Articles: topic and sort both kept in the address bar (`?topic=…&sort=period`); filter buttons report their state with `aria-pressed`
- [x] Articles: empty state with "Show all articles", for topics that have no articles yet (not reachable with the current mock data)
- [x] Books: cards keep a readable size and centre as a group, so two books don't leave half a row empty
- [x] Book cards show the typographic cover (title, subtitle, author) instead of the first three letters of the title; fixed the summary showing half a fourth line

### 4. Article page: the core reading experience
From `designs/article-page`, `hussites` and `eighty-years-war-timeline`:
- [x] Mock content: Virginia and Ireland articles carry their full text from `designs/` (verbatim), Virginia with its 11 sources
- [x] Hero: dark band with breadcrumb, topic tags, title, summary, author, read time and word count. Uses the article image when there is one, otherwise the topic colours
- [x] Prose styles on `--measure`
- [x] Contents list: sticky sidebar from 1024px, "Contents" button and drawer below that (focus trap, Escape, focus moves to the chosen heading), highlights the section being read. Built from headings, which get ids automatically
- [x] Reading-progress bar under the header and back-to-top button (focus returns to the title)
- [x] Sources & Bibliography: collapsible `<details>`, listed in the contents
- [x] Related articles: same topic first, then most recent
- [x] Read time calculated at 238 words per minute (Brysbaert 2019) when the body has 200+ words; shorter placeholder bodies keep the typed value

### 5. Article content blocks
The mocks are hand-built per article. They are generalised into a small block library in the `RichTextBlock` union (`src/types/content.ts`), rendered by `RichText` with components in `src/components/blocks/`:

| Block | Covers in the mocks | Status |
|---|---|---|
| `quote` (text, cite) | pull quotes and primary-source boxes: the citation names the document | ✅ |
| `figure` (src, alt, caption, credit, aspect) | portraits, maps, article figures. Without `src`, a labelled "Image to come" placeholder | ✅ |
| `callout` (note / insight / reading) | insight-box, reading-callout, "An Open Question" | ✅ |
| `collapsible` (title, nested blocks) | collapsible-section, "Detailed Events of Late 1641" | ✅ |
| `timeline` (periods → events with kind, date, title, text; quote events) | tl-*, decade sections, campaign years. Periods collapse, appear in the contents list, legend is built from the kinds used | ✅ |
| `factCards` (title, badge, meta, rows, text) | siege, garrison, weapon, faction and regiment cards, regimental staff | ✅ |
| `dataList` (rows, optional bars and total) | ship manifest, equipment, troop strengths, personnel tracker | ✅ |
| `table` (caption, columns, rows) | officer roster | ✅ |
| `legend`, `sectionNav` | legend dots, era and section nav | Folded in: the timeline draws its own legend, and the contents list does the jumping |

- [x] Mock instances use real data from the mocks: Virginia (roster, staff, strengths, equipment, fleet, personnel, open question), Ireland (reading callout, collapsible, regiment cards), Eighty Years War (background + two timeline periods), Hussites (figures)
- [x] "Text and content" page section (`_type: 'content'`): any article block on any page, in the same reading column. Available but not used on any page yet
- [x] All blocks on one internal page: `/dev/blocks` (noindex, not linked). Exclude it from the sitemap in phase 8
- [x] Shared `.prose` styles (RichText.scss) replace the article page's own, so nested content (collapsibles) gets the same typography
- [ ] Wide blocks: let tables, timelines and fact cards break out into the empty right-hand column on wide screens
- [ ] Real images for figures once they exist (with `astro:assets`, phase 8)

### 6. Book detail page
From `designs/about-book-pages`:
- [x] Dark hero: cover, status ("Published · Available Now"), title, subtitle, summary, Buy and Excerpt buttons
- [x] About the Book (rich text, the mock's pull quote as a quote block) with a sidebar: Book Details list and Preview Pages (labelled placeholders until images exist)
- [x] Other books shown below as book promos with "Learn More"
- [x] Shared `BookCover` component (image, or framed typographic cover), also used by the book promo section
- [x] Removed `publishedYear: '2023'` from the mock: it wasn't in the design
- [ ] Real Amazon and excerpt links (the mock has "#"), cover images and preview pages

### 7. Contact
- [x] Netlify Forms redirects to `/contact/thanks` after sending (noindex)
- [x] Spam protection: Netlify honeypot field, kept off-screen and out of the tab order
- [x] Inline error messages under each field (`aria-invalid`, `aria-describedby`), focus moves to the first problem, messages clear as you type. Without JavaScript the browser's own checks still apply
- [x] `autocomplete` on name and email; placeholders removed since every field has a label
- [x] Optional email address shown under the form (`email` on the contact page data)
- [ ] The real contact email address (not in the designs); check that submissions arrive once deployed to Netlify

### 8. Polish and launch readiness
- [ ] SEO: canonical URLs, an OG image, `@astrojs/sitemap`, Article JSON-LD
- [ ] Images through `astro:assets` (responsive, lazy, WebP/AVIF)
- [ ] **Print stylesheet.** The old site had a print button, and long sourced articles get printed
- [ ] axe and Lighthouse pass, plus a keyboard-only walkthrough
- [ ] **Search** with Pagefind (static index, no backend), wired to the header button

### 9. Storyblok (last)
**Who edits:** Lee writes in Word and should be able to publish on his own: create an article from a Word file, fix typos, reorder home page sections, rename section titles, and build the complex parts (timelines, tables, fact cards) himself, as he did in the originals. Marichka sets up the structure. Sanity was dropped because it was too hard to understand.

- [ ] Before building: a 30-minute trial with Lee in a free space (one article from his Word file, fix a typo, reorder the home page, rename a section title, add a few timeline events, publish)
- [ ] Make the complex blocks writable the way he writes in Word. Candidates to test in the trial: a timeline period as one text area where each event is a paragraph starting with a bold date (parsed into events), versus one nested block per event; tables in Storyblok's table field; how his existing Word tables survive the Word import
- [ ] Page type with a `sections` list (hero, featured, article grid, author card, book promo...) matching `Section` in `src/types/content.ts`, so sections can be dragged to reorder in the Visual Editor
- [ ] Article type kept minimal: title, topic, summary, body (rich text with Word import), sources. Plain field names ("Who said it", "Caption")
- [ ] Lee's account sees content only, not component or field setup; drafts stay off the live site until he presses Publish
- [ ] Write the adapter: replace the bodies in `src/lib/content` and map Storyblok rich text to `RichText`
- [ ] Draft and preview mode with the Visual Editor, and a webhook to trigger a Netlify rebuild on publish
- [ ] Migrate the mock content into Storyblok as seed data
- [ ] One-page guide with screenshots: new article from Word, fix a typo, reorder the home page, publish

---

## Decisions log
- **2026-11-07:** body font is Literata (tried Atkinson Hyperlegible Next, which lost the heritage look, then Newsreader). Search is deferred to phase 8. `pages-mocks/` deleted; `designs/` is the design reference and is committed.
