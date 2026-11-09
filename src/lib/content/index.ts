// The only module pages import content from. It reads either the mock files or Storyblok, chosen with
// CONTENT_SOURCE in .env (or Cloudflare's build variables): "storyblok", or anything else for the mocks.
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

// Read time is calculated from the body when there is enough text, so it can't drift from the content
const withDerivedFields = (article: Article): Article => ({
    ...article,
    body: withHeadingIds(article.body),
    readTime: readingTime(article.body, article.readTime),
})

const toArticleMeta = ({ body: _body, author: _author, sources: _sources, _editable: _e, ...meta }: Article): ArticleMeta => meta
const toBookMeta = ({ description: _d, cta: _c, secondaryCta: _s, status: _st, details: _de, previewPages: _p, _editable: _e, ...meta }: Book): BookMeta => meta

// The same functions for any source: the site uses CONTENT_SOURCE, the Visual Editor preview always uses Storyblok
function contentApi(source: Source) {
    const getArticles = async (): Promise<ArticleMeta[]> => (await source.articles()).map((a) => toArticleMeta(withDerivedFields(a)))

    return {
        getSiteSettings: (): Promise<SiteSettings> => source.siteSettings(),
        getPage: (name: PageName): Promise<Page> => source.page(name),
        getContactPage: (): Promise<ContactPage> => source.contactPage(),

        // Newest first
        getArticles,

        async getArticle(slug: string): Promise<Article | undefined> {
            const article = (await source.articles()).find((a) => a.slug === slug)
            return article && withDerivedFields(article)
        },

        // Same topic first, then the most recent of the rest
        async getRelatedArticles(slug: string, limit = 3): Promise<ArticleMeta[]> {
            const all = await getArticles()
            const current = all.find((a) => a.slug === slug)
            const others = all.filter((a) => a.slug !== slug)
            const sameTopic = others.filter((a) => current?.topicSlug && a.topicSlug === current.topicSlug)
            const rest = others.filter((a) => !sameTopic.includes(a))
            return [...sameTopic, ...rest].slice(0, limit)
        },

        getBooks: async (): Promise<BookMeta[]> => (await source.books()).map(toBookMeta),
        getBook: async (slug: string): Promise<Book | undefined> => (await source.books()).find((b) => b.slug === slug),
    }
}

export type ContentApi = ReturnType<typeof contentApi>

export const storyblokContent = contentApi(storyblokSource)

export const { getSiteSettings, getPage, getContactPage, getArticles, getArticle, getRelatedArticles, getBooks, getBook } = contentApi(
    import.meta.env.CONTENT_SOURCE === 'storyblok' ? storyblokSource : mocks
)
