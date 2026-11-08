import type { Article } from '@app-types/article'
import type { RichText } from '@app-types/content'
import imported from './imported/articles.json'

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

// The old site's own article groups. Colours are for cards without an image
export const topics: Record<string, { category: string; topicSlug: string; gradientFrom: string; gradientTo: string }> = {
    'colonial-history': { category: 'Colonial History', topicSlug: 'colonial-history', gradientFrom: '#243044', gradientTo: '#5a1520' },
    'irish-history': { category: 'Irish History', topicSlug: 'irish-history', gradientFrom: '#243044', gradientTo: '#8b2635' },
    'dutch-history': { category: 'Dutch History', topicSlug: 'dutch-history', gradientFrom: '#1a2332', gradientTo: '#7d5c17' },
    'scottish-history': { category: 'Scottish History', topicSlug: 'scottish-history', gradientFrom: '#1a2332', gradientTo: '#5a1520' },
    medieval: { category: 'Medieval', topicSlug: 'medieval', gradientFrom: '#5a1520', gradientTo: '#1a2332' },
    'world-war-i': { category: 'World War I', topicSlug: 'world-war-i', gradientFrom: '#1a2332', gradientTo: '#8b2635' },
}

// Hand-written details that override the imported ones
const curated: Record<string, Partial<Article>> = {
    // From the designs/ mocks
    'czechoslovak-legion': {
        title: 'The Czechoslovak Legion, 1914–1920',
        subtitle: 'European Military History · WWI Era',
        tags: ['WWI'],
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
        title: 'The Eighty Years War',
        subtitle: 'Early Modern Europe',
        excerpt:
            'The Dutch revolt against Hapsburg Spain — a conflict spanning eight decades that birthed a nation, transformed European warfare, and reshaped the balance of power across the continent.',
    },
    'the-hussites': {
        subtitle: '15th Century Bohemia',
        startYear: 1419,
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
        excerpt: 'An order of battle for the Williamite War: the regiments of both armies and the engagements each one fought.',
    },
    'maryland-forces-1754-1764': {
        excerpt: "A chronology of Maryland's provincial forces from 1754 to 1764, with quotations from contemporary sources.",
    },
    'dumbartons-regiment': { title: "Dumbarton's Regiment" },
}

// Old titles use hyphens for ranges ("1677-82"); use an en dash, as elsewhere on the site
const tidyTitle = (title: string) => title.replace(/(\d{4})\s*-\s*(\d{2,4})/g, '$1–$2').replace(/\s+/g, ' ').trim()

// Articles without a year in the title sort by the earliest year in their chronology
function earliestYear(body: RichText): number | undefined {
    const years = body.flatMap((block) =>
        block.type === 'timeline' ? block.groups.flatMap((g) => g.events.flatMap((e) => ('date' in e && e.date?.match(/\b1\d{3}\b/g)) || [])) : []
    )
    return years.length ? Math.min(...years.map(Number)) : undefined
}

export const articles: Article[] = (imported as ImportedArticle[]).map((item) => {
    const topic = topics[item.topicSlug]
    const base: Article = {
        title: tidyTitle(item.title),
        slug: item.slug,
        startYear: item.startYear ?? earliestYear(item.body),
        ...topic,
        excerpt: item.excerpt,
        body: item.body,
        sources: item.sources,
        author,
    }
    const article = { ...base, ...curated[item.slug] }
    return { ...article, period: article.period ?? (article.startYear ? String(article.startYear) : undefined) }
})

// Old URL -> new slug, for redirects (public/_redirects)
export const oldPaths = (imported as ImportedArticle[]).map(({ oldPath, slug }) => ({ oldPath, slug }))
