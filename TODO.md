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

- [ ] Create a Storyblok personal access token (My account > Account settings > Personal access token) and add it to `.env` as `STORYBLOK_PERSONAL_ACCESS_TOKEN`; then run `npm run storyblok:push` and `npm run storyblok:seed`
- [ ] Review and merge PR #83 (`feat/mock-content`)
- [ ] One pass in a real browser: contents list highlighting, contents drawer, back-to-top, mobile menu, slim header on scroll, search (`npm run build` then `npm run preview`, press `/`), printing an article
- [ ] Decide whether to keep or delete the parked `feat/storyblok` branch (local WIP commit, not pushed)
- [ ] Set up the free Storyblok space for the trial with Lee

### After launch

- [ ] Attach the domain in Netlify (the site reads it from Netlify's `URL` automatically)
- [ ] Send a test message through the contact form and confirm it arrives (Netlify Forms only works once deployed)
- [ ] Add the site to Google Search Console and Bing Webmaster Tools; submit `sitemap-index.xml`
- [ ] Test a few articles and a book in Google's Rich Results Test
- [ ] Watch Search Console's AI features report

## Development backlog

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
- [x] Importer for the old site (`scripts/import-old-site.py`): all 19 articles converted into `src/mocks/imported/articles.json`; the site now shows the real articles. Old URLs redirect to the new ones (netlify.toml)
- [ ] Seeding Storyblok with the imported articles: images are linked from the old GitHub repo; upload them to Storyblok's asset library once their rights are checked (the seed currently creates image blocks without the file)
- [ ] Design the articles that need it:
  - Williamite War: the whole article is an order of battle (army → arm → regiment → engagements)
  - British Military Presence: unit lists with coat/facing colours, imported as text inside timeline events
  - Virginia Rangers: "Periods of Service and County" is a roster (company, county, dates); imported as a timeline, better as a table
  - Eighty Years War: 27 images were placed after the chronology (a timeline can't hold images); an image per era or a gallery
  - Maryland: unit and commander lists
- [x] Phase 9a, Storyblok: block definitions in code, push and seed scripts, delivery client, rich text converter, adapter, `CONTENT_SOURCE` switch
- [ ] Phase 9b: push blocks and seed content (needs the personal access token), switch `CONTENT_SOURCE=storyblok` locally and on Netlify
- [ ] Phase 9c: Visual Editor preview (click-to-edit markers, a draft preview deploy), publish webhook to rebuild Netlify, a one-page guide for Lee
- [ ] Source links on the site (the Storyblok `source` block already has an optional link field)
- [ ] Only if logs show a crawler ignoring robots.txt: block AI training crawlers at the server (Netlify)

## Done

- [x] Assign a unique gradient per topic (`gradientFrom`/`gradientTo`), now in `src/mocks/articles.ts`; will move to Storyblok
- [x] Calculate `readTime` automatically from article body content (`src/lib/content/article-utils.ts`)
- [x] ~~Custom Sanity Studio tool to view all sections~~ Sanity was dropped; revisit as a Storyblok equivalent
