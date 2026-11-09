// CMS-agnostic content shapes. Mock data and (later) the Storyblok adapter both produce these,
// so components never see a CMS-specific format.

import type { ArticleMeta } from './article'
import type { BookMeta } from './book'
import type { CTA } from './cta'

// Set only in Storyblok draft content: lets the Visual Editor outline a block and open it on click
export interface Editable {
    _editable?: string
}

export type RichTextBlock = Editable & (
    // text is always plain (for word counts and search). html, when present, is the same text with
    // inline formatting (em, strong, a, sup, sub, s, br) and is what gets rendered
    | { type: 'paragraph'; text: string; html?: string }
    | { type: 'heading'; level: 2 | 3; text: string; id?: string }
    // Also used for primary sources: the citation names the document and date
    | { type: 'quote'; text: string; html?: string; cite?: string }
    | { type: 'list'; ordered?: boolean; items: { text: string; html?: string }[] }
    | FigureBlock
    | CalloutBlock
    | CollapsibleBlock
    | TimelineBlock
    | FactCardsBlock
    | DataListBlock
    | TableBlock
)

// An image with caption. Without src it renders a labelled placeholder until the image exists
export interface FigureBlock {
    type: 'figure'
    src?: string
    alt: string
    caption?: string
    credit?: string
    aspect?: 'landscape' | 'portrait' | 'square'
}

// A boxed aside. note: neutral; insight: an argument or open question; reading: how to read this article
export interface CalloutBlock {
    type: 'callout'
    variant: 'note' | 'insight' | 'reading'
    title?: string
    text: string
}

// Detail most readers can skip, closed by default
export interface CollapsibleBlock {
    type: 'collapsible'
    title: string
    blocks: RichText
    open?: boolean
}

// Event kinds set the marker colour and the legend label
export type TimelineEventKind = 'battle' | 'political' | 'treaty' | 'event'

export type TimelineEvent =
    | { kind?: TimelineEventKind; date?: string; title?: string; text: string }
    | { kind: 'quote'; text: string; cite?: string }

// Events grouped into periods. Each group is collapsible and appears in the contents list
export interface TimelineBlock {
    type: 'timeline'
    groups: {
        id?: string
        label: string
        title?: string
        collapsed?: boolean
        events: TimelineEvent[]
    }[]
}

// Cards for sieges, garrisons, regiments, weapons, factions: a title, an optional badge,
// label/value rows and a short text
export interface FactCardsBlock {
    type: 'factCards'
    cards: {
        title: string
        badge?: string
        meta?: string
        rows?: { label: string; value: string }[]
        text?: string
    }[]
}

// Label/value rows such as manifests and strengths. With bars, numeric values are drawn to scale
export interface DataListBlock {
    type: 'dataList'
    title: string
    note?: string
    bars?: boolean
    rows: { label: string; value: string | number; detail?: string }[]
    total?: { label: string; value: string | number }
}

// A real table, for rosters and other data with several columns
export interface TableBlock {
    type: 'table'
    caption: string
    columns: string[]
    rows: string[][]
    note?: string
}

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

export type Section = Editable & (
    | {
          _type: 'hero'
          // Short line above the title, e.g. "Military history from the sources"
          label?: string
          title: string
          text?: string
          imageUrl?: string
          imageAlt?: string
          imageCaption?: string
          cta?: CTA
          secondaryCta?: CTA
      }
    // Groups of articles that follow one story across decades, each read in date order
    | { _type: 'readingPaths'; heading?: string; intro?: string; paths: { title: string; articles: ArticleMeta[] }[] }
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
          label?: string
          name: string
          role?: string
          bio?: RichText
          imageUrl?: string
          imageAlt?: string
          initials?: string
          imageCaption?: string
          // Short lines such as "Retired U.S. Army Major", shown as a list
          credentials?: string[]
          cta?: CTA
      }
    // The forthcoming book as a feature, then the published books
    | { _type: 'books'; heading?: string; cta?: CTA; books: BookMeta[] }
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
    // Any article content blocks on a page: text, timeline, figure, callout, cards, tables
    | { _type: 'content'; label?: string; heading?: string; blocks: RichText }
)

export interface Page extends Editable {
    title: string
    description: string
    sections: Section[]
}

export interface ContactPage extends Editable {
    title: string
    description: string
    label: string
    heading: string
    subheading: string
    // Shown under the form as an alternative way to get in touch
    email?: string
}
