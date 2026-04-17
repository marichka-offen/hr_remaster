export interface ArticleMeta {
    title: string
    slug: string
    subtitle?: string
    period?: string
    category: string
    topicSlug?: string
    tags?: string[]
    imageUrl?: string
    imageAlt?: string
    gradientFrom?: string
    gradientTo?: string
    layoutType?: 'prose' | 'timeline'
    excerpt?: string
    readTime?: string
}
