// The only module pages import content from. It serves mock data today; the Storyblok
// adapter will replace these bodies later without the signatures changing.

import type { Article, ArticleMeta } from '@app-types/article'
import type { Book, BookMeta } from '@app-types/book'
import type { ContactPage, Page, SiteSettings } from '@app-types/content'
import { articles } from '../../mocks/articles'
import { books } from '../../mocks/books'
import * as pages from '../../mocks/pages'

const toArticleMeta = ({ body: _body, author: _author, ...meta }: Article): ArticleMeta => meta
const toBookMeta = ({ description: _d, cta: _c, ...meta }: Book): BookMeta => meta

export async function getSiteSettings(): Promise<SiteSettings> {
    return pages.siteSettings
}

export async function getPage(name: 'home' | 'about' | 'articlesPage' | 'booksPage'): Promise<Page> {
    return pages[name]
}

export async function getContactPage(): Promise<ContactPage> {
    return pages.contact
}

export async function getArticles(): Promise<ArticleMeta[]> {
    return articles.map(toArticleMeta)
}

export async function getArticle(slug: string): Promise<Article | undefined> {
    return articles.find((a) => a.slug === slug)
}

export async function getBooks(): Promise<BookMeta[]> {
    return books.map(toBookMeta)
}

export async function getBook(slug: string): Promise<Book | undefined> {
    return books.find((b) => b.slug === slug)
}
