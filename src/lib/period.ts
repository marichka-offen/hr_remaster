// Period helpers shared by cards, reading paths and article headers.

import type { ArticleMeta } from '@app-types/article'

// The period colour token for a start year (see --era-* in tokens.css)
export function eraColor(startYear?: number): string {
    if (!startYear) return 'var(--era-1900)'
    if (startYear >= 1900) return 'var(--era-1900)'
    if (startYear >= 1700) return 'var(--era-1700)'
    if (startYear >= 1650) return 'var(--era-1650)'
    if (startYear >= 1600) return 'var(--era-1600)'
    if (startYear >= 1500) return 'var(--era-1500)'
    return 'var(--era-1400)'
}

// "1677–1682", or one year when the article covers a single year or has no end year
export function years(article: Pick<ArticleMeta, 'startYear' | 'endYear' | 'period'>): string {
    const { startYear, endYear } = article
    if (!startYear) return article.period ?? ''
    return endYear && endYear !== startYear ? `${startYear}–${endYear}` : String(startYear)
}

// The span a group of articles covers, e.g. "1593–1691"
export function span(articles: ArticleMeta[]): string {
    const starts = articles.map((a) => a.startYear).filter((y): y is number => !!y)
    const ends = articles.map((a) => a.endYear ?? a.startYear).filter((y): y is number => !!y)
    if (!starts.length) return ''
    const from = Math.min(...starts)
    const to = Math.max(...ends)
    return from === to ? String(from) : `${from}–${to}`
}

// "32 min read · 27 sources"
export function cardMeta(article: Pick<ArticleMeta, 'readTime' | 'sourceCount'>): string {
    const parts = [article.readTime, article.sourceCount ? `${article.sourceCount} sources` : undefined]
    return parts.filter(Boolean).join(' · ')
}
