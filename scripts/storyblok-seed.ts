// Copies the mock content (src/mocks) into Storyblok, so the space starts with real articles, books and
// pages. Creates stories that don't exist and updates the ones that do (matched by slug), then publishes.
// Run once after `npm run storyblok:push`:  npm run storyblok:seed
// Needs STORYBLOK_PERSONAL_ACCESS_TOKEN and STORYBLOK_SPACE_ID in .env.

import { randomUUID } from 'node:crypto'
import type { RichText, RichTextBlock, Section } from '../src/types/content'
import { articles } from '../src/mocks/articles'
import { books } from '../src/mocks/books'
import * as pages from '../src/mocks/pages'
import { managementApi } from './storyblok-mapi.mjs'
import { collectImageUrls, prepareAssets } from './storyblok-assets'

const api = managementApi()
const uid = () => randomUUID()

// Images first: upload any the asset library doesn't have yet, then image fields point at Storyblok's copies
const assetField = await prepareAssets(api, collectImageUrls(articles, books, pages))

// ---------------------------------------------------------------- Rich text: our blocks -> Storyblok

const textNodes = (text: string) => (text ? [{ type: 'text', text }] : [])
const paragraph = (text: string) => ({ type: 'paragraph', content: textNodes(text) })

// The importer keeps inline formatting as a small HTML string (em, strong, a, sup, sub, s, br).
// Storyblok rich text stores the same thing as text nodes with "marks", so convert one to the other
const MARKS: Record<string, string> = { em: 'italic', i: 'italic', strong: 'bold', b: 'bold', sup: 'superscript', sub: 'subscript', s: 'strike' }
const decode = (value: string) =>
    value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')

function inlineNodes(html: string) {
    const nodes: Record<string, unknown>[] = []
    const active: { type: string; attrs?: Record<string, unknown> }[] = []
    for (const token of html.split(/(<[^>]+>)/).filter(Boolean)) {
        const tag = token.match(/^<(\/?)([a-z]+)([^>]*)>$/i)
        if (!tag) {
            nodes.push({ type: 'text', text: decode(token), ...(active.length ? { marks: active.map((m) => ({ ...m })) } : {}) })
            continue
        }
        const [, closing, rawName, rest] = tag
        const name = rawName.toLowerCase()
        if (name === 'br') {
            nodes.push({ type: 'hard_break' })
        } else if (closing) {
            const type = name === 'a' ? 'link' : MARKS[name]
            const index = active.map((m) => m.type).lastIndexOf(type)
            if (index >= 0) active.splice(index, 1)
        } else if (name === 'a') {
            const href = decode(rest.match(/href="([^"]*)"/)?.[1] ?? '')
            active.push({ type: 'link', attrs: { href, linktype: 'url', target: '_blank' } })
        } else if (MARKS[name]) {
            active.push({ type: MARKS[name] })
        }
    }
    return nodes.filter((node) => node.type !== 'text' || (node.text as string).length > 0)
}

// A paragraph from plain text, or from its formatted version when there is one
const richParagraph = (text: string, html?: string) => (html ? { type: 'paragraph', content: inlineNodes(html) } : paragraph(text))
const blok = (component: string, fields: Record<string, unknown>) => ({
    type: 'blok',
    attrs: { id: uid(), body: [{ _uid: uid(), component, ...fields }] },
})

function toStoryblokRichText(blocks: RichText = []) {
    return { type: 'doc', content: blocks.flatMap(toNode) }
}

function toNode(block: RichTextBlock): unknown[] {
    switch (block.type) {
        case 'paragraph':
            return [richParagraph(block.text, block.html)]
        case 'heading':
            return [{ type: 'heading', attrs: { level: block.level }, content: textNodes(block.text) }]
        case 'quote':
            // Written the way it would be in Word: the quote, then the source on its own line after a dash
            return [{ type: 'blockquote', content: [richParagraph(block.text, block.html), ...(block.cite ? [paragraph(`— ${block.cite}`)] : [])] }]
        case 'list':
            return [
                {
                    type: block.ordered ? 'ordered_list' : 'bullet_list',
                    content: block.items.map((item) => ({ type: 'list_item', content: [richParagraph(item.text, item.html)] })),
                },
            ]
        case 'figure':
            return [blok('figure', { image: assetField(block.src, block.alt), alt: block.alt, caption: block.caption ?? '', credit: block.credit ?? '', aspect: block.aspect ?? 'landscape' })]
        case 'callout':
            return [blok('callout', { variant: block.variant, title: block.title ?? '', text: block.text })]
        case 'collapsible':
            return [blok('collapsible', { title: block.title, open: !!block.open, body: toStoryblokRichText(block.blocks) })]
        case 'timeline':
            return [
                blok('timeline', {
                    periods: block.groups.map((group) => ({
                        _uid: uid(),
                        component: 'timelinePeriod',
                        label: group.label,
                        title: group.title ?? '',
                        collapsed: !!group.collapsed,
                        events: group.events.map((event) =>
                            event.kind === 'quote'
                                ? { _uid: uid(), component: 'timelineQuote', text: event.text, cite: event.cite ?? '' }
                                : { _uid: uid(), component: 'timelineEvent', kind: event.kind ?? 'event', date: event.date ?? '', title: event.title ?? '', text: event.text }
                        ),
                    })),
                }),
            ]
        case 'factCards':
            return [
                blok('factCards', {
                    cards: block.cards.map((card) => ({
                        _uid: uid(),
                        component: 'factCard',
                        title: card.title,
                        badge: card.badge ?? '',
                        meta: card.meta ?? '',
                        text: card.text ?? '',
                        rows: (card.rows ?? []).map((row) => ({ _uid: uid(), component: 'detailRow', label: row.label, value: row.value })),
                    })),
                }),
            ]
        case 'dataList':
            return [
                blok('dataList', {
                    title: block.title,
                    note: block.note ?? '',
                    bars: !!block.bars,
                    totalLabel: block.total?.label ?? '',
                    totalValue: block.total ? String(block.total.value) : '',
                    rows: block.rows.map((row) => ({ _uid: uid(), component: 'dataRow', label: row.label, value: String(row.value), detail: row.detail ?? '' })),
                }),
            ]
        case 'table':
            return [
                blok('dataTable', {
                    caption: block.caption,
                    note: block.note ?? '',
                    table: {
                        thead: block.columns.map((value) => ({ _uid: uid(), value, component: '_table_head' })),
                        tbody: block.rows.map((row) => ({ _uid: uid(), component: '_table_row', body: row.map((value) => ({ _uid: uid(), value, component: '_table_col' })) })),
                    },
                }),
            ]
    }
}

// ---------------------------------------------------------------- Stories

const urlLink = (url?: string) => ({ linktype: 'url', url: url ?? '', cached_url: url ?? '', fieldtype: 'multilink' })

async function findBySlug(fullSlug: string) {
    const result = await api.get(`/stories/?with_slug=${encodeURIComponent(fullSlug)}`)
    return result.stories[0]
}

async function folder(slug: string, name: string): Promise<number> {
    const found = await findBySlug(slug)
    if (found) return found.id
    const created = await api.post('/stories/', { story: { name, slug, is_folder: true } })
    return created.story.id
}

// Creates or updates a story and publishes it; returns its uuid for references
async function upsert(fullSlug: string, name: string, content: Record<string, unknown>, parentId = 0): Promise<string> {
    const slug = fullSlug.split('/').pop()!
    const found = await findBySlug(fullSlug)
    const story = { name, slug, parent_id: parentId, content }
    const result = found
        ? await api.put(`/stories/${found.id}`, { story, publish: 1 })
        : await api.post('/stories/', { story, publish: 1 })
    console.log(`${found ? 'updated' : 'created'}  ${fullSlug}`)
    return result.story.uuid
}

// Topics come from the articles' topic fields
const topicsFolder = await folder('topics', 'Topics')
const topicUuids = new Map<string, string>()
for (const article of articles) {
    if (!article.topicSlug || topicUuids.has(article.topicSlug)) continue
    const uuid = await upsert(`topics/${article.topicSlug}`, article.category, {
        component: 'topic',
        name: article.category,
        gradientFrom: article.gradientFrom ?? '',
        gradientTo: article.gradientTo ?? '',
    }, topicsFolder)
    topicUuids.set(article.topicSlug, uuid)
}

const articlesFolder = await folder('articles', 'Articles')
const articleUuids = new Map<string, string>()
// Mocks are newest first; create oldest first so Storyblok's dates keep the same order
for (const article of [...articles].reverse()) {
    const uuid = await upsert(`articles/${article.slug}`, article.title, {
        component: 'article',
        title: article.title,
        subtitle: article.subtitle ?? '',
        topic: topicUuids.get(article.topicSlug ?? '') ?? '',
        tags: (article.tags ?? []).join(', '),
        period: article.period ?? '',
        startYear: article.startYear ? String(article.startYear) : '',
        endYear: article.endYear ? String(article.endYear) : '',
        image: assetField(article.imageUrl, article.imageAlt),
        excerpt: article.excerpt ?? '',
        seoDescription: article.seoDescription ?? '',
        readTime: article.readTime ?? '',
        body: toStoryblokRichText(article.body),
        sources: (article.sources ?? []).map((text) => ({ _uid: uid(), component: 'source', text, link: urlLink() })),
    }, articlesFolder)
    articleUuids.set(article.slug, uuid)
}

const booksFolder = await folder('books', 'Books')
const bookUuids = new Map<string, string>()
for (const book of [...books].reverse()) {
    const uuid = await upsert(`books/${book.slug}`, book.title, {
        component: 'book',
        title: book.title,
        subtitle: book.subtitle ?? '',
        author: book.author ?? '',
        coverLabel: book.coverLabel ?? '',
        coverImage: assetField(book.coverImageUrl, book.title),
        previewPages: (book.previewPages ?? []).map((p) => assetField(p.src, p.alt)).filter((a) => 'id' in a),
        status: book.status ?? '',
        excerpt: book.excerpt ?? '',
        description: toStoryblokRichText(book.description),
        details: (book.details ?? []).map((row) => ({ _uid: uid(), component: 'detailRow', label: row.label, value: row.value })),
        ctaText: book.cta?.text ?? '',
        ctaLink: urlLink(book.cta?.link === '#' ? '' : book.cta?.link),
        secondaryCtaText: book.secondaryCta?.text ?? '',
        secondaryCtaLink: urlLink(book.secondaryCta?.link === '#' ? '' : book.secondaryCta?.link),
    }, booksFolder)
    bookUuids.set(book.slug, uuid)
}

// ---------------------------------------------------------------- Pages

function toBlok(section: Section): Record<string, unknown> | undefined {
    const base = { _uid: uid() }
    const ctaFields = (cta?: { text?: string; link?: string }) => ({ ctaText: cta?.text ?? '', ctaLink: cta?.link?.startsWith('/') ? urlLink(cta.link) : urlLink(cta?.link) })
    switch (section._type) {
        case 'hero':
            return {
                ...base,
                component: 'hero',
                label: section.label ?? '',
                title: section.title,
                text: section.text ?? '',
                image: assetField(section.imageUrl, section.imageAlt),
                imageCaption: section.imageCaption ?? '',
                ...ctaFields(section.cta),
                secondaryCtaText: section.secondaryCta?.text ?? '',
                secondaryCtaLink: urlLink(section.secondaryCta?.link),
            }
        case 'readingPaths':
            return {
                ...base,
                component: 'readingPaths',
                heading: section.heading ?? '',
                intro: section.intro ?? '',
                paths: section.paths.map((path) => ({ _uid: uid(), component: 'readingPath', title: path.title, articles: path.articles.map((a) => articleUuids.get(a.slug)).filter(Boolean) })),
            }
        case 'books':
            return { ...base, component: 'booksSection', heading: section.heading ?? '', ...ctaFields(section.cta) }
        case 'featured':
            return { ...base, component: 'featured', label: section.label ?? '', heading: section.heading ?? '', article: articleUuids.get(section.article.slug) ?? '' }
        case 'articleGrid':
            return {
                ...base,
                component: 'articleGrid',
                label: section.label ?? '',
                heading: section.heading ?? '',
                showCategoryFilter: !!section.showCategoryFilter,
                articles: (section.articles ?? []).map((a) => articleUuids.get(a.slug)).filter(Boolean),
                ...ctaFields(section.cta),
            }
        case 'authorCard':
            return {
                ...base,
                component: 'authorCard',
                label: section.label ?? '',
                name: section.name,
                initials: section.initials ?? '',
                image: assetField(section.imageUrl, section.imageAlt),
                imageCaption: section.imageCaption ?? '',
                credentials: (section.credentials ?? []).join('\n'),
                bio: toStoryblokRichText(section.bio),
                ...ctaFields(section.cta),
            }
        case 'bookPromo': {
            const slug = books.find((b) => b.title === section.title)?.slug ?? ''
            return { ...base, component: 'bookPromo', label: section.label ?? '', book: bookUuids.get(slug) ?? '', ctaText: section.cta?.text ?? 'Learn More' }
        }
        case 'authorBio':
            return {
                ...base,
                component: 'authorBio',
                label: section.label ?? '',
                name: section.name,
                role: section.role ?? '',
                initials: section.initials ?? '',
                image: assetField(section.imageUrl, section.imageAlt),
                bio: toStoryblokRichText(section.bio),
                credentials: (section.credentials ?? []).map((c) => ({ _uid: uid(), component: 'credential', icon: c.icon, label: c.label, title: c.title, description: c.description ?? '' })),
            }
        case 'philosophyBlock':
            return { ...base, component: 'philosophyBlock', quote: section.quote, body: toStoryblokRichText(section.body) }
        case 'pageCta':
            return { ...base, component: 'pageCta', label: section.label ?? '', heading: section.heading, subtext: section.subtext ?? '', ...ctaFields(section.cta) }
        case 'content':
            return { ...base, component: 'contentSection', label: section.label ?? '', heading: section.heading ?? '', body: toStoryblokRichText(section.blocks) }
    }
}

const pageSlugs = { home: 'home', about: 'about', articlesPage: 'articles-page', booksPage: 'books-page' } as const
for (const [key, slug] of Object.entries(pageSlugs)) {
    const page = pages[key as keyof typeof pageSlugs]
    await upsert(slug, page.title, {
        component: 'page',
        title: page.title,
        description: page.description,
        sections: page.sections.map(toBlok).filter(Boolean),
    })
}

await upsert('contact', 'Contact', { component: 'contactPage', ...pages.contact, email: pages.contact.email ?? '' })

const { header, footer } = pages.siteSettings
const authorSource = articles.find((a) => a.author)?.author
await upsert('settings', 'Site settings', {
    component: 'settings',
    logoTitle: header.logoTitle,
    logoSubtitle: header.logoSubtitle,
    navigation: header.navigation.map((item) => ({ _uid: uid(), component: 'navItem', label: item.label, link: urlLink(item.href) })),
    footerDescription: footer.description,
    topicsTitle: footer.topicsTitle,
    footerTopics: footer.topics.map((t) => topicUuids.get(new URL(t.href, 'https://x').searchParams.get('topic') ?? '')).filter(Boolean),
    copyright: footer.copyright.replace(String(new Date().getFullYear()), '{year}'),
    copyrightNote: footer.copyrightNote ?? '',
    authorName: authorSource?.name ?? '',
    authorRole: authorSource?.role ?? '',
    authorInitials: authorSource?.initials ?? '',
    authorImage: assetField(authorSource?.imageUrl, authorSource?.name),
    authorBio: toStoryblokRichText(authorSource?.bio),
})

console.log('\nDone. Set CONTENT_SOURCE=storyblok in .env to build the site from Storyblok.')
