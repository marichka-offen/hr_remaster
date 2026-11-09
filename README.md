# History Reconsidered

Website for History Reconsidered, Lee G. Offen's military history research. Built with Astro, React islands and SCSS, content in Storyblok, hosted on Cloudflare.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build the static site to `dist/` |
| `npm run preview` | Serve the built site locally (Cloudflare runtime: `npx wrangler dev`) |
| `npm run check` | Type-check `.astro`, `.ts` and `.tsx` files |
| `npm run storyblok:push` | Create or update the Storyblok blocks from `storyblok/components.mjs` |
| `npm run storyblok:seed` | Copy the mock content into Storyblok (creates or updates stories) |
| `npm run tokens-doc` | Regenerate `docs/TOKENS.md` from `tokens.css` |
| `npm run og-image` | Re-render the social preview image from `scripts/og-default.html` |

## Where things live

```text
designs/              HTML mocks and redesign notes: the visual reference
docs/PLAN.md          Token review, development phases, decisions log
public/fonts/         Self-hosted fonts (Literata, Playfair Display, Cormorant Garamond, DM Sans)
src/
  design-tokens/      tokens.css (all design tokens), base.css (fonts, reset, globals), _mixins.scss
  components/
    base/             Small building blocks: Button, Eyebrow, RichText...
    composite/        Built from base: ArticleCard, SectionHeader, MobileNav...
    sections/         Page sections: HomeHero, ArticlesSection, Footer...
  layouts/            BaseLayout (html shell), SiteLayout (header and footer)
  lib/content/        The only module pages read content from
  mocks/              Mock content, used until the CMS is connected
  pages/              Routes
  types/              Content types shared by mocks, components and the future CMS adapter
```

## Content

Copy `.env.example` to `.env`. `CONTENT_SOURCE=storyblok` builds from Storyblok; anything else uses the mock files.


Pages call functions in `src/lib/content` (`getPage`, `getArticles`, `getArticle`...), which read from `src/mocks/` or from Storyblok. The Storyblok side is `src/lib/storyblok/`: `client.ts` fetches every story once per build, `richtext.ts` converts rich text into the site's blocks, and `adapter.ts` maps stories to the types in `src/types/`. Components never see Storyblok's format. Block definitions live in `storyblok/components.mjs` and are pushed with `npm run storyblok:push`.

## Storyblok Visual Editor

Lee edits pages inside Storyblok with the page shown beside the fields (click a section to edit it, see changes as he types). Storyblok loads `/preview/<story slug>` from this site in a frame:

- `src/pages/preview/[...slug].astro` is rendered on request (in a Cloudflare Worker), along with `/api/contact`; everything else is static. It checks Storyblok's signature (`src/lib/storyblok/preview.ts`), so drafts are never shown outside the editor.
- Pages and preview share the same templates (`src/views/`). Blocks carry Storyblok's `_editable` markers in draft content only (`src/lib/storyblok/editable.ts`).
- Typing sends the unsaved story to the preview route, which re-renders and swaps the page content; saving or publishing reloads.

- `src/pages/preview/[...slug].astro` and `src/pages/api/contact.ts` are the only server routes; they run in a Cloudflare Worker. Everything else is static files.

## Hosting: Cloudflare Workers

Static files plus one small Worker (`wrangler.jsonc`). Redirects from the old site are in `public/_redirects`, headers in `public/_headers`.

One-time setup:

1. **Deploy:** Cloudflare → Workers & Pages → Create → Import a repository → this repo. Build command `npm run build`, deploy command `npx wrangler deploy`.
2. **Build variables** (Worker → Settings → Build → Variables and secrets): `CONTENT_SOURCE=storyblok`, `STORYBLOK_DELIVERY_API_TOKEN` (the preview token), `STORYBLOK_SPACE_ID`, `STORYBLOK_REGION=eu`, and `SITE_URL` (the `*.workers.dev` address until the domain is connected). Not the personal access token.
3. **Storyblok → Settings → Visual Editor → Preview URL:** `https://<site address>/preview/`
4. **Rebuild on publish:** Worker → Settings → Builds → Deploy Hooks → create one; Storyblok → Settings → Webhooks → new webhook for "Story published", "unpublished" and "deleted" with that URL.
5. **Contact form** (once the domain is on Cloudflare): Email Routing → verify the address that should receive messages; Worker → Settings → Variables and secrets: `CONTACT_FROM` (e.g. `contact@<domain>`) and `CONTACT_TO` (the verified address).

## Styling rules

Full token reference: [docs/TOKENS.md](docs/TOKENS.md) (tables, generated with `npm run tokens-doc`) and [docs/tokens.html](docs/tokens.html) (open in a browser for swatches and live contrast checks).


- Use tokens from `src/design-tokens/tokens.css`, never raw values.
- For colour, use the role tokens (`--color-text`, `--color-surface`, `--color-border`...). Palette names (`--navy`, `--gold`, `--burgundy`) are only for brand decoration.
- Headings get their font globally. Components set heading size and weight, not the family.
- Running text is capped at `--measure` globally. Centred blocks use the `centered` mixin so capped paragraphs stay centred.
- Spacing: pick from the roles, not raw steps. `--gap-related` (8px) between things that belong together, `--gap-items` (16px) between items in a group, `--gap-groups` (32px) between groups; `--inset-sm/md/lg` (12/16/24px) for padding. A container's padding should be at least its largest inner gap, and equal on all sides unless there's a reason.
- Dark sections include the `on-dark` mixin, which switches the accent and focus colours to gold.
