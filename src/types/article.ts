export interface ArticleMeta {
    title: string
    slug: string
    subtitle?: string
    period?: string
    category: string
    tags?: string[]
    imageUrl?: string
    imageAlt?: string
    heroGradient?: string
    layoutType?: 'prose' | 'timeline'
    excerpt?: string
    readTime?: string
}
