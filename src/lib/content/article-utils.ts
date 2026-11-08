import type { RichText, RichTextBlock } from '@app-types/content'

// Average silent reading speed for non-fiction in English, from Brysbaert (2019), "How many words do
// we read per minute? A review and meta-analysis of reading rate", Journal of Memory and Language 109.
const WORDS_PER_MINUTE = 238

// Below this, a body is a placeholder and the hand-entered read time is more truthful
const MIN_WORDS_FOR_ESTIMATE = 200

export interface TocItem {
    id: string
    text: string
    level: 2 | 3
}

// All the readable text in a block, including nested blocks, timeline events, cards and tables
function blockText(block: RichTextBlock): string[] {
    switch (block.type) {
        case 'paragraph':
        case 'heading':
            return [block.text]
        case 'quote':
            return [block.text, block.cite ?? '']
        case 'list':
            return block.items.map((item) => item.text)
        case 'figure':
            return [block.caption ?? '']
        case 'callout':
            return [block.title ?? '', block.text]
        case 'collapsible':
            return [block.title, ...block.blocks.flatMap(blockText)]
        case 'timeline':
            return block.groups.flatMap((group) => [
                group.label,
                group.title ?? '',
                ...group.events.flatMap((event) =>
                    event.kind === 'quote' ? [event.text, event.cite ?? ''] : [event.date ?? '', event.title ?? '', event.text]
                ),
            ])
        case 'factCards':
            return block.cards.flatMap((card) => [
                card.title,
                card.badge ?? '',
                card.meta ?? '',
                card.text ?? '',
                ...(card.rows ?? []).flatMap((row) => [row.label, row.value]),
            ])
        case 'dataList':
            return [block.title, block.note ?? '', ...block.rows.flatMap((row) => [row.label, String(row.value), row.detail ?? ''])]
        case 'table':
            return [block.caption, ...block.columns, ...block.rows.flat(), block.note ?? '']
    }
}

export function countWords(body: RichText = []): number {
    return body.flatMap(blockText).join(' ').split(/\s+/).filter(Boolean).length
}

// Returns e.g. "6 min read", or the fallback when the body is too short to estimate from
export function readingTime(body: RichText | undefined, fallback?: string): string | undefined {
    const words = countWords(body)
    if (words < MIN_WORDS_FOR_ESTIMATE) return fallback
    return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`
}

export function slugify(text: string): string {
    return text
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// Gives every heading and timeline period a unique id, so the contents list always has something to link to
export function withHeadingIds(body: RichText = []): RichText {
    const used = new Set<string>()
    const unique = (wanted: string | undefined, text: string) => {
        const base = wanted || slugify(text) || 'section'
        let id = base
        for (let n = 2; used.has(id); n++) id = `${base}-${n}`
        used.add(id)
        return id
    }
    return body.map((block) => {
        if (block.type === 'heading') return { ...block, id: unique(block.id, block.text) }
        if (block.type === 'timeline') {
            return { ...block, groups: block.groups.map((group) => ({ ...group, id: unique(group.id, group.label) })) }
        }
        return block
    })
}

// Headings, plus timeline periods nested under the heading before them
export function tableOfContents(body: RichText = []): TocItem[] {
    return body.flatMap((block): TocItem[] => {
        if (block.type === 'heading' && block.id) return [{ id: block.id, text: block.text, level: block.level }]
        if (block.type === 'timeline') {
            return block.groups.flatMap((group) => (group.id ? [{ id: group.id, text: group.label, level: 3 as const }] : []))
        }
        return []
    })
}
