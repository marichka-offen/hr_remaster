# Content inventory: old site

Source: [marichka-offen/history-reconsidered](https://github.com/marichka-offen/history-reconsidered) (Vue, last commit 28 March 2021). Articles are Vue templates in `src/views/HistoryArticles/`, images in `src/assets/images/`.

Word counts are approximate (they include source lists). Total: 19 articles, about 75,000 words.

"Dated lines" are chronology entries written as a bold date followed by text, the pattern that maps to the Timeline block. "Quotes" are blockquotes, almost always followed by an attribution line, which maps to a quote with a citation.

## Redesigned in `designs/`

| Article | Words | Images | Dated lines | Quotes | Notes |
|---|---|---|---|---|---|
| The War of Three Kingdoms in Ireland, 1641–1648 | 9,909 | 0 | 0 | 0 | 27 headings; regiment lists at the end → fact cards |
| The Eighty Years War (1568–1648) | 9,153 | 27 | 376 | 19 | Mostly a chronology → timeline periods; many portraits and flags |
| The Hussites | 3,908 | 10 | 14 | 5 | Weapons and wagon-fort diagrams (GIFs) |
| The British Military Presence in America | 3,693 | 0 | 182 | 0 | Chronologies with unit lists and coat/facing colours → timeline + unit lists |
| British Regulars in Virginia, 1677–82 | 2,894 | 0 | 0 | 3 | One table (officer roster) |

## Not yet designed

| Article | Words | Images | Dated lines | Quotes | Likely shape |
|---|---|---|---|---|---|
| The House of Stuart and Jacobitism, 1603– | 9,433 | 0 | 0 | 0 | Long prose, 45 headings, 65 list items |
| The Virginia Ranger Companies, 1755–176x | 6,652 | 0 | 55 | 37 | Chronology full of primary-source quotes |
| A Brief Military History of the Colony of Maryland | 5,738 | 0 | 0 | 0 | Chronology section; unit and commander lists |
| Timeline of Maryland Forces 1754–1764 | 4,428 | 1 | 36 | 34 | Chronology with primary-source quotes |
| Ireland (1652–1688) | 3,284 | 0 | 0 | 1 | Prose |
| O'Neil's Rebellion: The Nine Years' War | 2,829 | 0 | 0 | 0 | Prose |
| Dumbarton's Regiment | 2,682 | 2 | 137 | 13 | Chronology with quotes; sections on pipers, recruitment, organisation |
| Williamite War (1688–1691) | 2,587 | 4 | 0 | 0 | Order of battle: army → arm (horse, dragoons, foot) → regiment → engagements. Needs a design |
| The Battle of the Severn River, 1655 | 2,115 | 1 | 0 | 3 | Prose with quotes |
| MacKay's Regiment of Foote, 1626–1634 | 1,667 | 2 | 49 | 13 | Chronology with quotes |
| The Irish Military Establishment, 1660– | 1,548 | 1 | 0 | 2 | Prose |
| The Dutch Military Presence in New Netherland | 1,187 | 2 | 17 | 0 | Numbers and garrison lists |
| The Kent County Militia, 1660–1707 | 754 | 1 | 0 | 0 | Short; equipment sections |
| The Czechoslovak Legion, 1914–1920 | 543 | 9 (slider) | 0 | 1 | Book announcement plus research sources; images from Lee's personal collection |

## Other pages

| Page | Words | Notes |
|---|---|---|
| Home ("What is History?", "Why History Reconsidered?") | 325 | Lee's own framing of the site; worth reusing on About or Home |
| About | 89 | Short |
| Book (America's First Marines) | 390 | 3 interior screenshots (`book-ss1–3.png`), likely the preview pages |

## Notes for the migration

- **Most content converts automatically.** The markup follows a few consistent patterns: paragraphs, headings, blockquote followed by an attribution line (`<h6>`), bold date at the start of a line, source lists (`<li>`). An importer can turn these into the site's blocks: quotes with citations, timeline events, lists and sources.
- **Needs design work:** Williamite War's order of battle; British Military Presence's unit lists with coat and facing colours; Maryland's unit and commander lists. These are the "love, thought and problem solving" articles.
- **Mock articles that don't exist on the old site:** "Gooch's American Regiment" (that's the book, not an article) and "Scottish Military Traditions" (the old site has three Scottish articles instead: Stuart, Dumbarton's, MacKay's). The mock data's topics came from the home page design, not the real archive.
- **Images: check rights before publishing.** Only the Czechoslovak Legion images are marked as Lee's own ("from my personal collection"). The rest (portraits, battle scenes, flags, de Gheyn engravings) have no recorded source. Many are probably public domain (old paintings and engravings), but each needs a source and credit, and anything from a modern book or website needs permission.
