export interface BookMeta {
    title: string
    slug: string
    subtitle?: string
    author?: string
    coverLabel?: string
    coverImageUrl?: string
    coverImageAlt?: string
    excerpt?: string
    publishedYear?: string
}

export interface Book extends BookMeta {
    description?: any[]
    cta?: {
        text: string
        link?: string
        openInNewTab?: boolean
    }
}
