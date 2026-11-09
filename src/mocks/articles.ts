import type { Article } from '@app-types/article'
import type { RichText } from '@app-types/content'
import imported from './imported/articles.json'
import severnRevision from './imported/word/battle-of-the-severn.json'
import marylandForcesRevision from './imported/word/maryland-forces-1754-1764.json'

// Articles come from the old site (src/mocks/imported/articles.json, written by scripts/import-old-site.py).
// Summaries, subtitles and tags for the five redesigned articles come from the designs/ mocks; the rest
// are generated from the first paragraph and marked for Lee to review (see TODO.md).

interface ImportedArticle {
    slug: string
    oldPath: string
    title: string
    topicSlug: string
    startYear: number | null
    excerpt: string
    body: RichText
    sources: string[]
}

const author: Article['author'] = {
    name: 'Lee G. Offen',
    role: 'Military Historian & Retired Soldier',
    initials: 'LO',
    bio: [
        {
            type: 'paragraph',
            text: 'A lifelong student of military history and a retired soldier, Lee brings both academic rigor and personal experience to his writing. Every article is thoroughly sourced, respecting the intelligence of the reader.',
        },
    ],
}

// Article groups, in the order of Lee's index (his "History Reconsidered website reorganization" document).
// Colours are for cards without an image. British History and Bohemian History name the three
// articles his index lists on their own; World War I is the Czechoslovak Legion article, which his
// index lists only as a book (both still to confirm with Lee)
export const topics: Record<string, { category: string; topicSlug: string; gradientFrom: string; gradientTo: string }> = {
    'maryland-colonial-history': { category: 'Maryland Colonial History', topicSlug: 'maryland-colonial-history', gradientFrom: '#243044', gradientTo: '#5a1520' },
    'virginia-colonial-history': { category: 'Virginia Colonial History', topicSlug: 'virginia-colonial-history', gradientFrom: '#243044', gradientTo: '#7d5c17' },
    'irish-history': { category: 'Irish History', topicSlug: 'irish-history', gradientFrom: '#243044', gradientTo: '#8b2635' },
    'dutch-history': { category: 'Dutch History', topicSlug: 'dutch-history', gradientFrom: '#1a2332', gradientTo: '#7d5c17' },
    'scottish-history': { category: 'Scottish History', topicSlug: 'scottish-history', gradientFrom: '#1a2332', gradientTo: '#5a1520' },
    'british-history': { category: 'British History', topicSlug: 'british-history', gradientFrom: '#5a1520', gradientTo: '#243044' },
    'bohemian-history': { category: 'Bohemian History', topicSlug: 'bohemian-history', gradientFrom: '#5a1520', gradientTo: '#1a2332' },
    'world-war-i': { category: 'World War I', topicSlug: 'world-war-i', gradientFrom: '#1a2332', gradientTo: '#8b2635' },
}

// Lee's index: each article's group, in his order within the group
export const indexOrder: Record<string, string[]> = {
    'maryland-colonial-history': ['battle-of-the-severn', 'military-history-of-maryland', 'maryland-forces-1754-1764'],
    'virginia-colonial-history': ['virginia-ranger-companies', 'british-regulars-virginia'],
    'irish-history': ['oneils-rebellion', 'war-of-three-kingdoms-ireland', 'ireland-1652-1688', 'irish-military-establishment', 'williamite-war'],
    'dutch-history': ['eighty-years-war', 'dutch-military-new-netherland'],
    'scottish-history': ['mackays-regiment', 'dumbartons-regiment'],
    'british-history': ['british-military-presence-america', 'house-of-stuart'],
    'bohemian-history': ['the-hussites'],
    'world-war-i': ['czechoslovak-legion'],
}
const topicOf = (slug: string) => Object.keys(indexOrder).find((topic) => indexOrder[topic].includes(slug))

// Articles Lee has revised in Word since the old site, converted by scripts/import-word.py. Their text
// replaces the old-site import
const revisions: Record<string, { title: string; body: RichText; sources: string[] }> = {
    'battle-of-the-severn': severnRevision as { title: string; body: RichText; sources: string[] },
    'maryland-forces-1754-1764': marylandForcesRevision as { title: string; body: RichText; sources: string[] },
}

// Old-site images (rights still to check) and public-domain images from Wikimedia Commons, for cards
const OLD = 'https://raw.githubusercontent.com/marichka-offen/history-reconsidered/master/src/assets/images/'
const JENA_CODEX_ZIZKA = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Jensky_kodex_Zizka.jpg/960px-Jensky_kodex_Zizka.jpg'
const WHITE_MOUNTAIN = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/The_Battle_of_White_Mountain_%28by_Peter_Snayers%29.jpg/1280px-The_Battle_of_White_Mountain_%28by_Peter_Snayers%29.jpg'

// Hand-written details that override the imported ones
const curated: Record<string, Partial<Article>> = {
    // From the designs/ mocks
    // Titles as in Lee's index, written out in full
    'oneils-rebellion': { title: 'O’Neill’s Rebellion: The Nine Years’ War, 1593–1603' },
    'mackays-regiment': { title: 'MacKay’s Regiment of Foot, 1626–1634' },
    'ireland-1652-1688': { title: 'Ireland, 1652–1688' },
    'czechoslovak-legion': {
        title: 'The Czechoslovak Legion, 1914–1920',
        subtitle: 'European Military History · WWI Era',
        tags: ['WWI'],
        imageUrl: `${OLD}CzechoslovakLegion/img1.jpg`,
        imageAlt: 'Czechoslovak legionnaires beside a railway carriage, from Lee’s collection',
        excerpt:
            'The extraordinary story of Czech and Slovak immigrants who formed a military organization under Russian officers — and earned nationhood for the Czechoslovak people through an epic 4,000-mile journey across Russia.',
    },
    'british-regulars-virginia': {
        title: 'British Regulars in Virginia, 1677–1682',
        subtitle: 'Primary Source Research',
        tags: ['Virginia', 'British Army'],
        excerpt: "The formation, deployment and dissolution of Jeffreys' Regiment of Foot — one of the first British regular army units sent to colonial America.",
    },
    'war-of-three-kingdoms-ireland': {
        title: 'The War of Three Kingdoms in Ireland, 1641–1648',
        subtitle: '17th Century',
        excerpt: 'The Irish rebellion, the Scottish Army of Ulster, and the tangled web of Catholic, Protestant, Royalist, and Parliamentary factions that tore Ireland apart.',
    },
    'eighty-years-war': {
        title: 'The Eighty Years War, 1568–1648',
        endYear: 1648,
        imageUrl: `${OLD}DutchHistory/william.jpg`,
        imageAlt: 'William of Orange, portrait by Adriaen Thomasz. Key, c. 1579',
        subtitle: 'Early Modern Europe',
        excerpt:
            'The Dutch revolt against Hapsburg Spain — a conflict spanning eight decades that birthed a nation, transformed European warfare, and reshaped the balance of power across the continent.',
    },
    'the-hussites': {
        subtitle: '15th Century Bohemia',
        startYear: 1419,
        endYear: 1434,
        imageUrl: JENA_CODEX_ZIZKA,
        imageAlt: 'Jan Žižka leading a Hussite army, from the Jena Codex',
        excerpt: 'The revolutionary military tactics and religious fervor of the Hussite Wars in 15th century Bohemia.',
    },
    'british-military-presence-america': {
        subtitle: 'British Army · Caribbean',
        tags: ['British Army'],
        excerpt:
            "Regular regiments, independent companies, and militia forces across the North American colonies and the Caribbean — a comprehensive survey of Britain's early military footprint.",
    },
    // Placeholders: these articles open without a usable first paragraph. To be rewritten by Lee
    'williamite-war': {
        title: 'Williamite War, 1688–1691',
        excerpt: 'An order of battle for the Williamite War: the regiments of both armies and the engagements each one fought.',
        imageUrl: `${OLD}IrishHistory/boyne.jpg`,
        imageAlt: 'The Battle of the Boyne',
    },
    'maryland-forces-1754-1764': {
        endYear: 1764,
        excerpt: "A chronology of Maryland's provincial forces from 1754 to 1764, with quotations from contemporary sources.",
    },
    'dumbartons-regiment': {
        title: 'Dumbarton’s Regiment, 1660–1685',
        startYear: 1660,
        endYear: 1685,
        imageUrl: WHITE_MOUNTAIN,
        imageAlt: 'The Battle of White Mountain, 1620, painted by Peter Snayers',
    },
    'battle-of-the-severn': {
        imageUrl: '/images/articles/battle-of-the-severn/figure-2.jpeg',
        imageAlt: 'Hand-drawn map of the Battle of the Severn by Kathleen McLaughlin',
    },
    'dutch-military-new-netherland': { endYear: 1664 },
}

// Old titles use hyphens for ranges ("1677-82"); use an en dash, as elsewhere on the site
const tidyTitle = (title: string) => title.replace(/(\d{4})\s*-\s*(\d{2,4})/g, '$1–$2').replace(/\s+/g, ' ').trim()

// Last year in a title: "1660-1720" gives 1720, "1641-48" gives 1648; undefined when the title has no range
function endYearFromTitle(title: string): number | undefined {
    const range = title.match(/(\d{4})\s*[-–]\s*(\d{2,4})/)
    if (!range) return undefined
    const [, start, end] = range
    return Number(end.length === 2 ? start.slice(0, 2) + end : end)
}

// Articles without a year in the title sort by the earliest year in their chronology
function earliestYear(body: RichText): number | undefined {
    const years = body.flatMap((block) =>
        block.type === 'timeline' ? block.groups.flatMap((g) => g.events.flatMap((e) => ('date' in e && e.date?.match(/\b1\d{3}\b/g)) || [])) : []
    )
    return years.length ? Math.min(...years.map(Number)) : undefined
}

// The Legion book's working title on the old site; the cover has the current one
const renameBook = (blocks: RichText): RichText =>
    JSON.parse(JSON.stringify(blocks).replaceAll('None Shall Pass Us by in Silence', 'They Shall Not Pass By Us in Silence'))

export const articles: Article[] = (imported as ImportedArticle[]).map((item) => {
    const topic = topics[topicOf(item.slug) ?? item.topicSlug]
    const revision = revisions[item.slug]
    const title = revision?.title ?? item.title
    const body = renameBook(revision?.body ?? item.body)
    const base: Article = {
        title: tidyTitle(title),
        slug: item.slug,
        startYear: item.startYear ?? earliestYear(body),
        endYear: endYearFromTitle(title),
        ...topic,
        excerpt: item.excerpt.replaceAll('None Shall Pass Us by in Silence', 'They Shall Not Pass By Us in Silence'),
        body,
        sources: revision?.sources ?? item.sources,
        author,
    }
    const article = { ...base, ...curated[item.slug] }
    return { ...article, period: article.period ?? (article.startYear ? String(article.startYear) : undefined) }
})

// Old URL -> new slug, for redirects (public/_redirects)
export const oldPaths = (imported as ImportedArticle[]).map(({ oldPath, slug }) => ({ oldPath, slug }))
