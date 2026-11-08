import type { RichText } from '@app-types/content'

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

const blockText = (block: RichText[number]): string => ('text' in block ? block.text : '')

export function countWords(body: RichText = []): number {
    return body.reduce((total, block) => total + blockText(block).split(/\s+/).filter(Boolean).length, 0)
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

// Gives every heading a unique id, so the contents list always has something to link to
export function withHeadingIds(body: RichText = []): RichText {
    const used = new Set<string>()
    return body.map((block) => {
        if (block.type !== 'heading') return block
        const base = block.id || slugify(block.text) || 'section'
        let id = base
        for (let n = 2; used.has(id); n++) id = `${base}-${n}`
        used.add(id)
        return { ...block, id }
    })
}

export function tableOfContents(body: RichText = []): TocItem[] {
    return body.flatMap((block) =>
        block.type === 'heading' && block.id ? [{ id: block.id, text: block.text, level: block.level }] : []
    )
}
