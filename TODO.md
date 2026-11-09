# TODO

Everything still open, grouped by who acts on it. Details and history are in [docs/PLAN.md](docs/PLAN.md).

## For Lee

### Content to provide

- [ ] Full text for every article. Only Virginia and Ireland have their full mock text; Eighty Years War, Hussites and British Military Presence have part of it; Czechoslovak Legion, Gooch's American Regiment and Scottish Military Traditions are placeholders ("Article text to come")
- [ ] Publish dates for each article (Google recommends them for articles; answer engines prefer content they can date)
- [ ] Images: Hussite battle flags, portrait of Jan Hus (both shown as "Image to come"), an author portrait, article hero images if he has them
- [ ] Books: the real Amazon link and the excerpt link for America's First Marines (both are "#" now), cover images, the four preview pages (Map 1, Map 2, Interior 1, Interior 2)
- [ ] The contact email address to show under the contact form (hidden until set)
- [ ] One original Word document that includes a timeline or table, for the Storyblok trial and to test the Word import

### To check or decide

- [ ] Summaries for the 13 articles that weren't redesigned: generated from each article's first paragraph (two, Williamite War and Maryland Forces, are short placeholders). They show on cards and in search results
- [ ] Image sources and rights for the old site's images (see docs/CONTENT-INVENTORY.md): only the Czechoslovak Legion photos are marked as his own. Each other image needs a source and credit, and permission if it comes from a modern book or website
- [ ] Sources in the Virginia article:
  - Cannon, *Historical Record… Third Regiment of Foot*: cited as London 1837; the online copy is dated 1839 (the series is 1837, this volume runs to 1838). Which date is right?
  - Hening, *Statutes at Large* Vol. II: cited as New York 1823; the free scan is the 1809/1810 Richmond first edition. Do page references need the 1823 edition, or is linking the first edition fine?
  - Knight, *Historical Record of the Buffs* Vol. I, 1905: no online copy found. The archive.org item search engines suggest is the 1935 Vol. II by C. R. B. Knight, a different book
- [ ] Optional shorter "search description" for summaries longer than ~155 characters (six of them: British Military Presence, Czechoslovak Legion, Eighty Years War, both books). Otherwise Google cuts them off with "…"
- [ ] Topics he's known for, used in the site's author data: currently "Military history, Colonial American military history, Early modern European warfare"
- [ ] A start year for Scottish Military Traditions, so it sorts correctly by period (currently sorts last)
- [ ] Check the copy written as placeholders: listing page descriptions (Articles, Books, Contact) in `src/mocks/pages.ts`

### Storyblok trial (30 minutes, before the integration is built)

- [ ] Create an article from a Word file, fix a typo, reorder the home page sections, rename a section title, add a few timeline events, publish

## For Marichka

### Now

- [ ] Storyblok after the home redesign: run `npm run storyblok:push` (new blocks: Read in order, Books, new hero and author fields, "Last year covered" on articles), then `npm run storyblok:seed` to update the home page. Delete the Kent County Militia story by hand (the seed doesn't delete)
- [ ] Set up Cloudflare (step by step in the conversation of 2026-11-09; summary in README)
- [ ] Review and merge PR #83 (`feat/mock-content`)
- [ ] One pass in a real browser: contents list highlighting, contents drawer, back-to-top, mobile menu, slim header on scroll, search (`npm run build` then `npm run preview`, press `/`), printing an article
- [ ] Decide whether to keep or delete the parked `feat/storyblok` branch (local WIP commit, not pushed)
- [ ] Set up the free Storyblok space for the trial with Lee

### After launch

- [ ] Move the domain's DNS to Cloudflare, add it to the Worker as a custom domain, and update `SITE_URL`
- [ ] Contact form: enable Email Routing, verify the receiving address, set `CONTACT_FROM` and `CONTACT_TO`, then send a test message
- [ ] Add the site to Google Search Console and Bing Webmaster Tools; submit `sitemap-index.xml`
- [ ] Test a few articles and a book in Google's Rich Results Test
- [ ] Watch Search Console's AI features report

## Development backlog

### Build the redesign (designs on the canvas: https://claude.ai/artifact/3cb9wQK9eb8RLHmUMguBgv)

- [x] Stage 1: tokens and home page. Period colours (`--era-*`); quotes in Literata (Cormorant removed); labels, nav, buttons and filters in normal case; new home sections: opening with image, Read in order, Latest research card, archive cards with images or period bands and source counts, author with photo and credentials, Books. Header search is a labelled box on wide screens
- [ ] Stage 2: article template v2 (period-tinted header with the period ribbon, lighter portraits, opener card when there is no lead image, wide blocks, contents list rule)
- [ ] Stage 3: About, Articles list (grouped by period), Books, book pages (real cover), Contact
- [ ] Stage 4: remove the discarded tokens once nothing uses them (`--tracking-wider`, `--tracking-widest`, `--text-decor`, the gradients and overlays, `--font-quote`)
- [ ] Read times differ from the canvas mockups (e.g. Eighty Years War: 37 min here, 32 on the canvas); the Legion shows "1 min read" because its text is a placeholder. Hide the read time when the body is a placeholder

- [ ] Contents list rule (agreed with Marichka): show "On this page" only when the article has three or more sections (counting Sources); otherwise leave it out and centre the text column. List h2 sections only, and expand a section's h3s while the reader is in it. Check the long articles (Three Kingdoms, House of Stuart, Eighty Years War) once their headings are fixed.
- [ ] Importer: "The House of Stuart and Jacobitism" has the same problem as the Maryland article below. Each Jacobite and government regiment is an h3 ending in "▾" with its details run into one paragraph. Import each regiment as a collapsible block.
- [ ] Importer: in the Williamite War order of battle, each regiment is a bold paragraph followed by a paragraph of engagements and coat colours separated by line breaks. Import them as a table: regiment, engagements, coat and facings. See the canvas mockup.
- [ ] Importer: the "Scottish Regiments (Army of Ulster)" list in the War of Three Kingdoms came through as alternating loose paragraphs (name, then details). Import it as one block per regiment.
- [ ] Importer: in "A Brief Military History of the Colony of Maryland" the old collapsible county sections came through as h2 headings ending in "▾", each with all its units run together in one paragraph. Import them as collapsible blocks, one per county, with one list item per unit. Splitting before each leading year ("1634-47 …", "1642 …") works.
- [ ] Fix two copy-paste captions from the old site: the Maryland Forces flag reads "Flag of the Dutch West Indies Company" (it is the Calvert arms with the King's Colours). The militia photo had the same caption, but that page is being removed.
- [ ] Source links: change sources from plain text to text plus an optional link; show the link on the article and in print; add the confirmed links:
  - Cannon: <https://archive.org/details/cihm_48340>
  - Hamilton Vol. I: <https://archive.org/details/originhistoryfi00hamigoog>
  - McKinnon Vol. II: <https://archive.org/details/originandservic02mackgoog>
  - Calendar of State Papers Colonial, Vols. 9, 10, 11: <https://www.british-history.ac.uk/cal-state-papers/colonial/america-west-indies/vol9> (and vol10, vol11)
  - After Lee's answers: Hening (https://archive.org/details/statutesatlargeb02virg), Calendar of State Papers Domestic (archive.org, one item per year)
  - Modern books (Lustig, Oberg, Tisdale, Webb): publisher or WorldCat links, if wanted
- [ ] Optimised images through `astro:assets` (responsive sizes, lazy loading, WebP/AVIF) once real images exist
- [ ] Full accessibility pass: axe and Lighthouse, keyboard-only walkthrough
- [ ] Move components onto the spacing roles (`--gap-*`, `--inset-*`); only the search dialog uses them so far
- [ ] Wide blocks: let tables, timelines and fact cards use the empty right-hand column on wide screens
- [ ] New components use min-width (mobile-first) media queries
- [x] Importer for the old site (`scripts/import-old-site.py`): all 19 articles converted into `src/mocks/imported/articles.json`; the site now shows the real articles. Old URLs redirect to the new ones (public/_redirects)
- [ ] Seeding Storyblok with the imported articles: images are linked from the old GitHub repo; upload them to Storyblok's asset library once their rights are checked (the seed currently creates image blocks without the file)
- [ ] Design the articles that need it:
  - Williamite War: the whole article is an order of battle (army → arm → regiment → engagements)
  - British Military Presence: unit lists with coat/facing colours, imported as text inside timeline events
  - Virginia Rangers: "Periods of Service and County" is a roster (company, county, dates); imported as a timeline, better as a table
  - Eighty Years War: 27 images were placed after the chronology (a timeline can't hold images); an image per era or a gallery
  - Maryland: unit and commander lists
- [x] Phase 9a, Storyblok: block definitions in code, push and seed scripts, delivery client, rich text converter, adapter, `CONTENT_SOURCE` switch
- [x] Phase 9b: blocks pushed, content seeded (19 articles, 2 books, pages, settings), formatting preserved; Storyblok build matches the mock build except images
- [x] Phase 9c (code): Visual Editor preview at /preview/<slug> (on-request Cloudflare Worker route, token-checked, click-to-edit markers, live typing via the bridge); page templates moved into src/views so static and preview pages share code
- [x] Hosting moved from Netlify to Cloudflare Workers (free plan: unlimited static traffic, 3,000 build minutes/month); contact form now emails through Cloudflare
- [ ] Turn on Workers Paid ($5/month) before Lee uses the Visual Editor: preview renders measured 24–39ms CPU locally, above the free plan's 10ms per request (the static site stays free)
- [ ] Optional: make preview renders cheaper (convert only the edited article's text, not all 19, when finding related articles and read times)
- [ ] Phase 9c (setup): Cloudflare deploy, build variables, Storyblok preview URL, deploy hook webhook (steps in README); a one-page guide for Lee
- [ ] Source links on the site (the Storyblok `source` block already has an optional link field)
- [ ] Only if logs show a crawler ignoring robots.txt: block AI training crawlers at the server (Cloudflare can do this)

## Done

- [x] Assign a unique gradient per topic (`gradientFrom`/`gradientTo`), now in `src/mocks/articles.ts`; will move to Storyblok
- [x] Calculate `readTime` automatically from article body content (`src/lib/content/article-utils.ts`)
- [x] ~~Custom Sanity Studio tool to view all sections~~ Sanity was dropped; revisit as a Storyblok equivalent
