import type { RichText } from './content'

export interface ArticleMeta {
    title: string
    slug: string
    subtitle?: string
    period?: string
    // First year the article covers, for sorting by period (e.g. 1677 for 1677–1682)
    startYear?: number
    category: string
    topicSlug?: string
    tags?: string[]
    imageUrl?: string
    imageAlt?: string
    gradientFrom?: string
    gradientTo?: string
    layoutType?: 'prose' | 'timeline'
    excerpt?: string
    // Optional shorter text for search results (Google shows about 155 characters); falls back to the excerpt
    seoDescription?: string
    readTime?: string
}

export interface Article extends ArticleMeta {
    _editable?: string
    body?: RichText
    // Bibliography entries, shown in a collapsible Sources section
    sources?: string[]
    author?: {
        name: string
        role?: string
        bio?: RichText
        imageUrl?: string
        initials?: string
    }
}
