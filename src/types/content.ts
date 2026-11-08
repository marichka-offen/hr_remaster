// CMS-agnostic content shapes. Mock data and (later) the Storyblok adapter both produce these,
// so components never see a CMS-specific format.

import type { ArticleMeta } from './article'
import type { CTA } from './cta'

export type RichTextBlock =
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; level: 2 | 3; text: string; id?: string }
    | { type: 'quote'; text: string; cite?: string }

export type RichText = RichTextBlock[]

export interface NavItem {
    label: string
    href: string
}

export interface SiteSettings {
    header: {
        logoTitle: string
        logoSubtitle: string
        navigation: NavItem[]
    }
    footer: {
        description: string
        topicsTitle: string
        topics: NavItem[]
        copyright: string
        copyrightNote?: string
    }
}

export type CredentialIcon = 'star' | 'graduation-cap' | 'book-open' | 'shield' | 'medal' | 'pen'

export type Section =
    | {
          _type: 'hero'
          label?: string
          title: string
          quote?: string
          quoteAuthor?: string
          imageUrl?: string
          imageAlt?: string
          cta?: CTA
      }
    | { _type: 'featured'; label?: string; heading?: string; article: ArticleMeta }
    | {
          _type: 'articleGrid'
          label?: string
          heading?: string
          showCategoryFilter?: boolean
          articles?: ArticleMeta[]
          cta?: CTA
      }
    | {
          _type: 'authorCard'
          name: string
          role?: string
          bio?: RichText
          imageUrl?: string
          imageAlt?: string
          initials?: string
          cta?: CTA
      }
    | {
          _type: 'bookPromo'
          label?: string
          coverLabel?: string
          title: string
          subtitle?: string
          coverImageUrl?: string
          coverImageAlt?: string
          description?: string
          cta?: CTA
      }
    | {
          _type: 'authorBio'
          label?: string
          name: string
          role?: string
          bio?: RichText
          imageUrl?: string
          imageAlt?: string
          initials?: string
          credentials?: { icon: CredentialIcon; label: string; title: string; description?: string }[]
      }
    | { _type: 'philosophyBlock'; quote: string; body?: RichText }
    | { _type: 'pageCta'; label?: string; heading: string; subtext?: string; cta?: CTA }

export interface Page {
    title: string
    description: string
    sections: Section[]
}

export interface ContactPage {
    title: string
    description: string
    label: string
    heading: string
    subheading: string
}
