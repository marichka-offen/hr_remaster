import type { RichText } from './content'
import type { CTA } from './cta'

export interface BookMeta {
    title: string
    slug: string
    subtitle?: string
    author?: string
    // Short badge on cards and covers, e.g. "Available Now" or "Forthcoming"
    coverLabel?: string
    coverImageUrl?: string
    coverImageAlt?: string
    excerpt?: string
    // Optional shorter text for search results; falls back to the excerpt
    seoDescription?: string
    publishedYear?: string
}

export interface Book extends BookMeta {
    _editable?: string
    // Longer status line in the book page hero, e.g. "Published · Available Now"
    status?: string
    description?: RichText
    // Label/value pairs in the Book Details list: author, publisher, format...
    details?: { label: string; value: string }[]
    // Sample pages; without src each shows a labelled placeholder
    previewPages?: { src?: string; alt: string }[]
    cta?: CTA & { text: string }
    secondaryCta?: CTA & { text: string }
}
