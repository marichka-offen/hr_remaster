// The only module pages import content from. It reads either the mock files or Storyblok, chosen with
// CONTENT_SOURCE in .env (or Netlify's environment): "storyblok", or anything else for the mocks.
// Both sources return the same types, and the derived fields below are applied to both.

import type { Article, ArticleMeta } from '@app-types/article'
import type { Book, BookMeta } from '@app-types/book'
import type { ContactPage, Page, SiteSettings } from '@app-types/content'
import { articles as mockArticles } from '../../mocks/articles'
import { books as mockBooks } from '../../mocks/books'
import * as mockPages from '../../mocks/pages'
import * as storyblok from '../storyblok/adapter'
import { readingTime, withHeadingIds } from './article-utils'

export { tableOfContents, type TocItem } from './article-utils'

type PageName = 'home' | 'about' | 'articlesPage' | 'booksPage'

interface Source {
    articles(): Promise<Article[]>
    books(): Promise<Book[]>
    page(name: PageName): Promise<Page>
    contactPage(): Promise<ContactPage>
    siteSettings(): Promise<SiteSettings>
}

const mocks: Source = {
    articles: async () => mockArticles,
    books: async () => mockBooks,
    page: async (name) => mockPages[name],
    contactPage: async () => mockPages.contact,
    siteSettings: async () => mockPages.siteSettings,
}

const storyblokSource: Source = {
    articles: storyblok.articles,
    books: storyblok.books,
    page: storyblok.page,
    contactPage: storyblok.contactPage,
    siteSettings: storyblok.siteSettings,
}

const source: Source = import.meta.env.CONTENT_SOURCE === 'storyblok' ? storyblokSource : mocks

// Read time is calculated from the body when there is enough text, so it can't drift from the content
const withDerivedFields = (article: Article): Article => ({
    ...article,
    body: withHeadingIds(article.body),
    readTime: readingTime(article.body, article.readTime),
})

const toArticleMeta = ({ body: _body, author: _author, sources: _sources, ...meta }: Article): ArticleMeta => meta
const toBookMeta = ({ description: _d, cta: _c, secondaryCta: _s, status: _st, details: _de, previewPages: _p, ...meta }: Book): BookMeta => meta

export const getSiteSettings = (): Promise<SiteSettings> => source.siteSettings()
export const getPage = (name: PageName): Promise<Page> => source.page(name)
export const getContactPage = (): Promise<ContactPage> => source.contactPage()

// Newest first
export async function getArticles(): Promise<ArticleMeta[]> {
    return (await source.articles()).map((a) => toArticleMeta(withDerivedFields(a)))
}

export async function getArticle(slug: string): Promise<Article | undefined> {
    const article = (await source.articles()).find((a) => a.slug === slug)
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
    return (await source.books()).map(toBookMeta)
}

export async function getBook(slug: string): Promise<Book | undefined> {
    return (await source.books()).find((b) => b.slug === slug)
}
