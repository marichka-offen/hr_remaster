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

- Use tokens from `src/design-tokens/tokens.css`, never raw values.
- For colour, use the role tokens (`--color-text`, `--color-surface`, `--color-border`...). Palette names (`--navy`, `--gold`, `--burgundy`) are only for brand decoration.
- Headings get their font globally. Components set heading size and weight, not the family.
- Running text is capped at `--measure` globally. Centred blocks use the `centered` mixin so capped paragraphs stay centred.
- Dark sections include the `on-dark` mixin, which switches the accent and focus colours to gold.
