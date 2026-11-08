// Translates Storyblok stories into the site's content types (src/types). Components never see Storyblok's
// format: if the CMS changed, only this file and client.ts would.

import type { Article, ArticleMeta } from '@app-types/article'
import type { Book } from '@app-types/book'
import type { ContactPage, Page, RichText, RichTextBlock, Section, SiteSettings, TimelineEventKind } from '@app-types/content'
import type { CTA } from '@app-types/cta'
import { allStories, storiesOfType, storyBySlug, type Story } from './client'
import { toRichText, type RichTextNode } from './richtext'

type Fields = Record<string, any>

// ---------------------------------------------------------------- Field helpers

interface Asset {
    filename?: string | null
    alt?: string | null
}

interface Link {
    linktype?: 'url' | 'story' | 'email' | 'asset'
    url?: string
    cached_url?: string
    email?: string
    target?: string
}

const str = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined)
const imageUrl = (asset?: Asset | null) => str(asset?.filename)
const imageAlt = (asset?: Asset | null) => str(asset?.alt)

// Storyblok links are objects (story, external URL or email); components want a plain href
function href(link?: Link | null): string | undefined {
    if (!link) return undefined
    if (link.linktype === 'email') return link.email ? `mailto:${link.email}` : undefined
    if (link.linktype === 'story') {
        const slug = str(link.cached_url)
        if (!slug) return undefined
        return slug === 'home' ? '/' : `/${slug.replace(/^\/|\/$/g, '')}`
    }
    return str(link.url) ?? str(link.cached_url)
}

function cta(textValue: unknown, link?: Link | null): CTA | undefined {
    const label = str(textValue)
    const target = href(link)
    if (!label || !target) return undefined
    return { text: label, link: target, openInNewTab: link?.target === '_blank' }
}

const richText = (doc: unknown): RichText => toRichText(doc as RichTextNode, contentBlock)

// ---------------------------------------------------------------- Content blocks (inside rich text)

function contentBlock(blok: Fields): RichTextBlock[] {
    switch (blok.component) {
        case 'quote':
            return blok.text ? [{ type: 'quote', text: blok.text, cite: str(blok.cite) }] : []
        case 'figure':
            return [
                {
                    type: 'figure',
                    src: imageUrl(blok.image),
                    alt: str(blok.alt) ?? imageAlt(blok.image) ?? '',
                    caption: str(blok.caption),
                    credit: str(blok.credit),
                    aspect: blok.aspect || 'landscape',
                },
            ]
        case 'callout':
            return blok.text ? [{ type: 'callout', variant: blok.variant || 'note', title: str(blok.title), text: blok.text }] : []
        case 'collapsible':
            return [{ type: 'collapsible', title: blok.title ?? '', blocks: richText(blok.body), open: !!blok.open }]
        case 'timeline':
            return [
                {
                    type: 'timeline',
                    groups: (blok.periods ?? []).map((period: Fields) => ({
                        label: period.label ?? '',
                        title: str(period.title),
                        collapsed: !!period.collapsed,
                        events: (period.events ?? []).map((event: Fields) =>
                            event.component === 'timelineQuote'
                                ? { kind: 'quote' as const, text: event.text ?? '', cite: str(event.cite) }
                                : {
                                      kind: (event.kind || 'event') as TimelineEventKind,
                                      date: str(event.date),
                                      title: str(event.title),
                                      text: event.text ?? '',
                                  }
                        ),
                    })),
                },
            ]
        case 'factCards':
            return [
                {
                    type: 'factCards',
                    cards: (blok.cards ?? []).map((card: Fields) => ({
                        title: card.title ?? '',
                        badge: str(card.badge),
                        meta: str(card.meta),
                        rows: (card.rows ?? []).map((row: Fields) => ({ label: row.label ?? '', value: row.value ?? '' })),
                        text: str(card.text),
                    })),
                },
            ]
        case 'dataList': {
            // Values that are plain numbers become numbers, so bars can be drawn to scale
            const value = (raw: string) => (/^\d[\d,]*$/.test(raw.trim()) ? Number(raw.replace(/,/g, '')) : raw)
            return [
                {
                    type: 'dataList',
                    title: blok.title ?? '',
                    note: str(blok.note),
                    bars: !!blok.bars,
                    rows: (blok.rows ?? []).map((row: Fields) => ({ label: row.label ?? '', value: value(row.value ?? ''), detail: str(row.detail) })),
                    total: str(blok.totalLabel) && str(blok.totalValue) ? { label: blok.totalLabel, value: value(blok.totalValue) } : undefined,
                },
            ]
        }
        case 'dataTable': {
            const columns: string[] = (blok.table?.thead ?? []).map((cell: Fields) => cell.value ?? '')
            const rows: string[][] = (blok.table?.tbody ?? []).map((row: Fields) => (row.body ?? []).map((cell: Fields) => cell.value ?? ''))
            return columns.length ? [{ type: 'table', caption: blok.caption ?? '', columns, rows, note: str(blok.note) }] : []
        }
        default:
            return []
    }
}

// ---------------------------------------------------------------- Topics, articles, books

interface Topic {
    category: string
    topicSlug: string
    gradientFrom?: string
    gradientTo?: string
}

async function topicsByUuid(): Promise<Map<string, Topic>> {
    const topics = await storiesOfType<Fields>('topic')
    return new Map(
        topics.map((story) => [
            story.uuid,
            { category: story.content.name ?? story.slug, topicSlug: story.slug, gradientFrom: str(story.content.gradientFrom), gradientTo: str(story.content.gradientTo) },
        ])
    )
}

async function author(): Promise<Article['author']> {
    const settings = await storyBySlug<Fields>('settings')
    const c = settings?.content
    if (!c || !str(c.authorName)) return undefined
    return { name: c.authorName, role: str(c.authorRole), bio: richText(c.authorBio), imageUrl: imageUrl(c.authorImage), initials: str(c.authorInitials) }
}

// Newest first: by first publish date, or creation date for drafts
const newestFirst = (a: Story, b: Story) =>
    (b.first_published_at ?? b.created_at).localeCompare(a.first_published_at ?? a.created_at)

function toArticle(story: Story<Fields>, topics: Map<string, Topic>, articleAuthor: Article['author']): Article {
    const c = story.content
    const topic = topics.get(c.topic) ?? { category: 'Uncategorised', topicSlug: 'uncategorised' }
    return {
        title: c.title ?? story.slug,
        slug: story.slug,
        subtitle: str(c.subtitle),
        period: str(c.period),
        startYear: Number(c.startYear) || undefined,
        ...topic,
        tags: str(c.tags)?.split(',').map((tag: string) => tag.trim()).filter(Boolean),
        imageUrl: imageUrl(c.image),
        imageAlt: imageAlt(c.image),
        excerpt: str(c.excerpt),
        seoDescription: str(c.seoDescription),
        readTime: str(c.readTime),
        body: richText(c.body),
        sources: (c.sources ?? []).map((source: Fields) => source.text).filter(Boolean),
        author: articleAuthor,
    }
}

export async function articles(): Promise<Article[]> {
    const [stories, topics, articleAuthor] = await Promise.all([storiesOfType<Fields>('article'), topicsByUuid(), author()])
    return stories.sort(newestFirst).map((story) => toArticle(story, topics, articleAuthor))
}

function toBook(story: Story<Fields>): Book {
    const c = story.content
    return {
        title: c.title ?? story.slug,
        slug: story.slug,
        subtitle: str(c.subtitle),
        author: str(c.author),
        coverLabel: str(c.coverLabel),
        status: str(c.status),
        coverImageUrl: imageUrl(c.coverImage),
        coverImageAlt: imageAlt(c.coverImage),
        excerpt: str(c.excerpt),
        seoDescription: str(c.seoDescription),
        description: richText(c.description),
        details: (c.details ?? []).map((row: Fields) => ({ label: row.label ?? '', value: row.value ?? '' })),
        previewPages: (c.previewPages ?? []).map((asset: Asset) => ({ src: imageUrl(asset), alt: imageAlt(asset) ?? '' })),
        cta: cta(c.ctaText, c.ctaLink) as Book['cta'],
        secondaryCta: cta(c.secondaryCtaText, c.secondaryCtaLink) as Book['secondaryCta'],
    }
}

export async function books(): Promise<Book[]> {
    return (await storiesOfType<Fields>('book')).sort(newestFirst).map(toBook)
}

// ---------------------------------------------------------------- Pages and sections

function stripArticle({ body: _b, author: _a, sources: _s, ...meta }: Article): ArticleMeta {
    return meta
}

async function toSection(blok: Fields, context: { articles: Article[]; books: Book[]; uuidToSlug: Map<string, string> }): Promise<Section | undefined> {
    const articleByUuid = (uuid: string) => {
        const slug = context.uuidToSlug.get(uuid)
        return context.articles.find((article) => article.slug === slug)
    }
    switch (blok.component) {
        case 'hero':
            return {
                _type: 'hero',
                label: str(blok.label),
                title: blok.title ?? '',
                quote: str(blok.quote),
                quoteAuthor: str(blok.quoteAuthor),
                imageUrl: imageUrl(blok.image),
                imageAlt: imageAlt(blok.image),
                cta: cta(blok.ctaText, blok.ctaLink),
            }
        case 'featured': {
            const article = articleByUuid(blok.article)
            return article ? { _type: 'featured', label: str(blok.label), heading: str(blok.heading), article: stripArticle(article) } : undefined
        }
        case 'articleGrid': {
            const picked: Article[] = (blok.articles ?? []).map(articleByUuid).filter(Boolean)
            const limit = Number(blok.limit) || undefined
            const list = picked.length ? picked : context.articles.slice(0, limit)
            return {
                _type: 'articleGrid',
                label: str(blok.label),
                heading: str(blok.heading),
                showCategoryFilter: !!blok.showCategoryFilter,
                articles: list.map(stripArticle),
                cta: cta(blok.ctaText, blok.ctaLink),
            }
        }
        case 'authorCard':
            return {
                _type: 'authorCard',
                name: blok.name ?? '',
                role: str(blok.role),
                bio: richText(blok.bio),
                imageUrl: imageUrl(blok.image),
                imageAlt: imageAlt(blok.image),
                initials: str(blok.initials),
                cta: cta(blok.ctaText, blok.ctaLink),
            }
        case 'bookPromo': {
            const slug = context.uuidToSlug.get(blok.book)
            const book = context.books.find((candidate) => candidate.slug === slug)
            if (!book) return undefined
            return {
                _type: 'bookPromo',
                label: str(blok.label),
                coverLabel: book.coverLabel,
                title: book.title,
                subtitle: book.subtitle,
                coverImageUrl: book.coverImageUrl,
                coverImageAlt: book.coverImageAlt,
                description: book.excerpt,
                cta: { text: str(blok.ctaText) ?? 'Learn More', link: `/books/${book.slug}` },
            }
        }
        case 'authorBio':
            return {
                _type: 'authorBio',
                label: str(blok.label),
                name: blok.name ?? '',
                role: str(blok.role),
                bio: richText(blok.bio),
                imageUrl: imageUrl(blok.image),
                imageAlt: imageAlt(blok.image),
                initials: str(blok.initials),
                credentials: (blok.credentials ?? []).map((credential: Fields) => ({
                    icon: credential.icon || 'medal',
                    label: credential.label ?? '',
                    title: credential.title ?? '',
                    description: str(credential.description),
                })),
            }
        case 'philosophyBlock':
            return { _type: 'philosophyBlock', quote: blok.quote ?? '', body: richText(blok.body) }
        case 'pageCta':
            return { _type: 'pageCta', label: str(blok.label), heading: blok.heading ?? '', subtext: str(blok.subtext), cta: cta(blok.ctaText, blok.ctaLink) }
        case 'contentSection':
            return { _type: 'content', label: str(blok.label), heading: str(blok.heading), blocks: richText(blok.body) }
        default:
            return undefined
    }
}

// Story slugs for the site's fixed pages. Listing pages can't use "articles" or "books", which are folders
const PAGE_SLUGS = { home: 'home', about: 'about', articlesPage: 'articles-page', booksPage: 'books-page' } as const

export async function page(name: keyof typeof PAGE_SLUGS): Promise<Page> {
    const [story, articleList, bookList, stories] = await Promise.all([
        storyBySlug<Fields>(PAGE_SLUGS[name]),
        articles(),
        books(),
        allStories(),
    ])
    const uuidToSlug = new Map(stories.map((s) => [s.uuid, s.slug]))
    const sections = (
        await Promise.all((story?.content.sections ?? []).map((blok: Fields) => toSection(blok, { articles: articleList, books: bookList, uuidToSlug })))
    ).filter((section): section is Section => !!section)
    // Fallback titles keep the browser tab sensible while a page is unpublished or untitled
    const fallbackTitle = { home: 'History Reconsidered', about: 'About', articlesPage: 'Articles', booksPage: 'Books' }[name]
    return { title: str(story?.content.title) ?? fallbackTitle, description: story?.content.description ?? '', sections }
}

export async function contactPage(): Promise<ContactPage> {
    const c: Fields = (await storyBySlug<Fields>('contact'))?.content ?? {}
    return {
        title: c.title ?? 'Contact',
        description: c.description ?? '',
        label: c.label ?? 'Contact',
        heading: c.heading ?? 'Get in Touch',
        subheading: c.subheading ?? '',
        email: str(c.email),
    }
}

export async function siteSettings(): Promise<SiteSettings> {
    const c: Fields = (await storyBySlug<Fields>('settings'))?.content ?? {}
    const topics = await topicsByUuid()
    const year = String(new Date().getFullYear())
    return {
        header: {
            logoTitle: c.logoTitle ?? 'History Reconsidered',
            logoSubtitle: c.logoSubtitle ?? '',
            navigation: (c.navigation ?? []).map((item: Fields) => ({ label: item.label ?? '', href: href(item.link) ?? '/' })),
        },
        footer: {
            description: c.footerDescription ?? '',
            topicsTitle: c.topicsTitle ?? 'Topics',
            topics: (c.footerTopics ?? [])
                .map((uuid: string) => topics.get(uuid))
                .filter(Boolean)
                .map((topic: Topic) => ({ label: topic.category, href: `/articles?topic=${topic.topicSlug}` })),
            copyright: (c.copyright ?? '').replace('{year}', year),
            copyrightNote: str(c.copyrightNote),
        },
    }
}
