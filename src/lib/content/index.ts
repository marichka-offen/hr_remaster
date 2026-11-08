// The only module pages import content from. It serves mock data today; the Storyblok
// adapter will replace these bodies later without the signatures changing.

import type { Article, ArticleMeta } from '@app-types/article'
import type { Book, BookMeta } from '@app-types/book'
import type { ContactPage, Page, SiteSettings } from '@app-types/content'
import { articles } from '../../mocks/articles'
import { books } from '../../mocks/books'
import * as pages from '../../mocks/pages'
import { readingTime, withHeadingIds } from './article-utils'

export { tableOfContents, type TocItem } from './article-utils'

// Read time is calculated from the body when there is enough text, so it can't drift from the content
const withDerivedFields = (article: Article): Article => ({
    ...article,
    body: withHeadingIds(article.body),
    readTime: readingTime(article.body, article.readTime),
})

const toArticleMeta = ({ body: _body, author: _author, sources: _sources, ...meta }: Article): ArticleMeta => meta
const toBookMeta = ({ description: _d, cta: _c, secondaryCta: _s, status: _st, details: _de, previewPages: _p, ...meta }: Book): BookMeta => meta

export async function getSiteSettings(): Promise<SiteSettings> {
    return pages.siteSettings
}

export async function getPage(name: 'home' | 'about' | 'articlesPage' | 'booksPage'): Promise<Page> {
    return pages[name]
}

export async function getContactPage(): Promise<ContactPage> {
    return pages.contact
}

// Newest first
export async function getArticles(): Promise<ArticleMeta[]> {
    return articles.map((a) => toArticleMeta(withDerivedFields(a)))
}

export async function getArticle(slug: string): Promise<Article | undefined> {
    const article = articles.find((a) => a.slug === slug)
    return article && withDerivedFields(article)
}

// Same topic first, then the most recent of the rest
export async function getRelatedArticles(slug: string, limit = 3): Promise<ArticleMeta[]> {
    const all = await getArticles()
    const current = all.find((a) => a.slug === slug)
    const others = all.filter((a) => a.slug !== slug)
    const sameTopic = others.filter((a) => current?.topicSlug && a.topicSlug === current.topicSlug)
    const rest = others.filter((a) => !sameTopic.includes(a))
    return [...sameTopic, ...rest].slice(0, limit)
}

export async function getBooks(): Promise<BookMeta[]> {
    return books.map(toBookMeta)
}

export async function getBook(slug: string): Promise<Book | undefined> {
    return books.find((b) => b.slug === slug)
}
