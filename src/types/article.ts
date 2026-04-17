export interface ArticleMeta {
    title: string
    slug: string
    subtitle?: string
    period?: string
    category: string
    tags?: string[]
    heroGradient?: string
    layoutType?: 'prose' | 'timeline'
    excerpt?: string
    readTime?: string
}
