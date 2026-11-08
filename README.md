# History Reconsidered

Website for History Reconsidered, Lee G. Offen's military history research. Built with Astro, React islands and SCSS, deployed on Netlify.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build the static site to `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run check` | Type-check `.astro`, `.ts` and `.tsx` files |
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

Pages call functions in `src/lib/content` (`getPage`, `getArticles`, `getArticle`...). Today these return data from `src/mocks/`. Storyblok will be connected last by replacing the bodies of those functions; their signatures and the types in `src/types/content.ts` stay the same, so pages and components don't change.

## Styling rules

Full token reference: [docs/TOKENS.md](docs/TOKENS.md) (tables, generated with `npm run tokens-doc`) and [docs/tokens.html](docs/tokens.html) (open in a browser for swatches and live contrast checks).


- Use tokens from `src/design-tokens/tokens.css`, never raw values.
- For colour, use the role tokens (`--color-text`, `--color-surface`, `--color-border`...). Palette names (`--navy`, `--gold`, `--burgundy`) are only for brand decoration.
- Headings get their font globally. Components set heading size and weight, not the family.
- Running text is capped at `--measure` globally. Centred blocks use the `centered` mixin so capped paragraphs stay centred.
- Spacing: pick from the roles, not raw steps. `--gap-related` (8px) between things that belong together, `--gap-items` (16px) between items in a group, `--gap-groups` (32px) between groups; `--inset-sm/md/lg` (12/16/24px) for padding. A container's padding should be at least its largest inner gap, and equal on all sides unless there's a reason.
- Dark sections include the `on-dark` mixin, which switches the accent and focus colours to gold.
