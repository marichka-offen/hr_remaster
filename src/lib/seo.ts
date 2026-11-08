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
            author: article.author ? { '@type': 'Person', name: article.author.name } : undefined,
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
        author: book.author ? { '@type': 'Person', name: book.author } : undefined,
        publisher: publisher ? { '@type': 'Organization', name: publisher } : undefined,
    }
}
