// Structured data (schema.org JSON-LD) for search engines. Each function returns a plain object that
// BaseLayout writes into a <script type="application/ld+json"> tag. Test pages with
// https://search.google.com/test/rich-results once the site is live.

import type { Article } from '@app-types/article'
import type { Book } from '@app-types/book'

const SITE_NAME = 'History Reconsidered'

const absolute = (path: string, site: URL | undefined) => new URL(path, site).href

const organization = (site: URL | undefined) => ({
    '@type': 'Organization',
    name: SITE_NAME,
    url: absolute('/', site),
    logo: absolute('/favicon.svg', site),
})

// The author, described once on the About page. Articles and books refer to this same @id, which ties
// all of his work to one identified person. Facts are taken from the About page text
const AUTHOR_ID = '/about/#lee-offen'

const authorRef = (name: string, site: URL | undefined) => ({
    '@type': 'Person',
    '@id': absolute(AUTHOR_ID, site),
    name,
    url: absolute('/about/', site),
})

// Organizations named on the About page. url is the official site; sameAs points to a well-known
// reference page, which tells search engines exactly which organization is meant
const org = (type: string, name: string, url: string, sameAs?: string) => ({
    '@type': type,
    name,
    url,
    ...(sameAs ? { sameAs } : {}),
})

const campbell = org('CollegeOrUniversity', 'Campbell University', 'https://www.campbell.edu/', 'https://en.wikipedia.org/wiki/Campbell_University')
const georgetown = org('CollegeOrUniversity', 'Georgetown University', 'https://www.georgetown.edu/', 'https://en.wikipedia.org/wiki/Georgetown_University')
const georgeMason = org('CollegeOrUniversity', 'George Mason University', 'https://www.gmu.edu/', 'https://en.wikipedia.org/wiki/George_Mason_University')
const usArmy = org('GovernmentOrganization', 'United States Army', 'https://www.army.mil/', 'https://en.wikipedia.org/wiki/United_States_Army')
const westholme = org('Organization', 'Westholme Publishing', 'https://www.westholmepublishing.com/')

// A past position. schema.org's Role wraps an organization with a role name, without implying it's current
const pastRole = (organization: Record<string, unknown>, roleName: string) => ({ '@type': 'Role', roleName, affiliation: organization })

export function authorSchema(site: URL | undefined) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': absolute(AUTHOR_ID, site),
        name: 'Lee G. Offen',
        url: absolute('/about/', site),
        jobTitle: 'Military historian',
        description:
            'Retired U.S. Army Major, Armored Cavalry combat veteran and Bronze Star recipient, former Assistant Professor of Military Science at Georgetown University and George Mason University, and author of America\'s First Marines.',
        award: 'Bronze Star Medal',
        alumniOf: campbell,
        affiliation: [
            pastRole(usArmy, 'Major (retired), Armored Cavalry'),
            pastRole(georgetown, 'Assistant Professor of Military Science'),
            pastRole(georgeMason, 'Assistant Professor of Military Science'),
        ],
        knowsAbout: ['Military history', 'Colonial American military history', 'Early modern European warfare'],
        worksFor: { '@type': 'Organization', name: SITE_NAME, url: absolute('/', site) },
    }
}

export function websiteSchema(site: URL | undefined) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: absolute('/', site),
        publisher: organization(site),
    }
}

// Articles have no publish dates yet; add datePublished/dateModified when the CMS provides them,
// since Google recommends both
export function articleSchema(article: Article, site: URL | undefined) {
    const url = absolute(`/articles/${article.slug}/`, site)
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            url,
            mainEntityOfPage: url,
            image: absolute(article.imageUrl ?? '/og-default.png', site),
            about: article.category,
            keywords: article.tags?.join(', '),
            // The article's sources as written; not used by Google's rich results, but describes the page accurately
            citation: article.sources?.length ? article.sources : undefined,
            author: article.author ? authorRef(article.author.name, site) : undefined,
            publisher: organization(site),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: absolute('/', site) },
                { '@type': 'ListItem', position: 2, name: 'Articles', item: absolute('/articles/', site) },
                ...(article.topicSlug
                    ? [{ '@type': 'ListItem', position: 3, name: article.category, item: absolute(`/articles/?topic=${article.topicSlug}`, site) }]
                    : []),
                { '@type': 'ListItem', position: article.topicSlug ? 4 : 3, name: article.title, item: url },
            ],
        },
    ]
}

export function bookSchema(book: Book, site: URL | undefined) {
    const detail = (label: string) => book.details?.find((d) => d.label.toLowerCase() === label)?.value
    const publisher = detail('publisher')
    return {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: book.title,
        alternativeHeadline: book.subtitle,
        description: book.excerpt,
        url: absolute(`/books/${book.slug}/`, site),
        image: book.coverImageUrl ? absolute(book.coverImageUrl, site) : undefined,
        author: book.author ? authorRef(book.author, site) : undefined,
        publisher: publisher === westholme.name ? westholme : publisher ? { '@type': 'Organization', name: publisher } : undefined,
    }
}
