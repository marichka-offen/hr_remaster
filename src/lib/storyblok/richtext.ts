// Converts Storyblok rich text (a ProseMirror/TipTap JSON tree) into the site's RichText blocks.
// Inline formatting becomes a small, escaped HTML string; embedded blocks (timeline, figure...) are
// handed to mapBlock, which the adapter provides.

import type { RichText, RichTextBlock } from '@app-types/content'

export interface RichTextNode {
    type: string
    text?: string
    attrs?: Record<string, any>
    marks?: { type: string; attrs?: Record<string, any> }[]
    content?: RichTextNode[]
}

export type BlockMapper = (blok: Record<string, any>) => RichTextBlock[]

const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Only web, mail and on-site links; anything else (javascript: and so on) is dropped
function safeHref(href: unknown): string | undefined {
    if (typeof href !== 'string' || !href) return undefined
    return /^(https?:|mailto:|\/|#)/i.test(href) ? href : undefined
}

function linkHref(attrs: Record<string, any> = {}): string | undefined {
    if (attrs.linktype === 'story') return safeHref(attrs.href?.startsWith('/') ? attrs.href : `/${attrs.href ?? ''}`)
    if (attrs.linktype === 'email') return safeHref(`mailto:${attrs.href}`)
    return safeHref(attrs.href)
}

function inlineHtml(nodes: RichTextNode[] = []): string {
    return nodes
        .map((node) => {
            if (node.type === 'hard_break') return '<br>'
            if (node.type !== 'text' || !node.text) return ''
            let html = escapeHtml(node.text)
            for (const mark of node.marks ?? []) {
                if (mark.type === 'bold') html = `<strong>${html}</strong>`
                else if (mark.type === 'italic') html = `<em>${html}</em>`
                else if (mark.type === 'strike') html = `<s>${html}</s>`
                else if (mark.type === 'superscript') html = `<sup>${html}</sup>`
                else if (mark.type === 'subscript') html = `<sub>${html}</sub>`
                else if (mark.type === 'link') {
                    const href = linkHref(mark.attrs)
                    const external = href?.startsWith('http')
                    if (href) html = `<a href="${escapeHtml(href)}"${external ? ' rel="noopener"' : ''}>${html}</a>`
                }
            }
            return html
        })
        .join('')
}

function inlineText(nodes: RichTextNode[] = []): string {
    return nodes.map((node) => (node.type === 'hard_break' ? '\n' : (node.text ?? ''))).join('')
}

// Paragraph with plain text and, only when it has formatting, the html version
function textBlock(nodes: RichTextNode[] = []) {
    const text = inlineText(nodes).trim()
    const html = inlineHtml(nodes).trim()
    return { text, html: html !== escapeHtml(text) ? html : undefined }
}

export function toRichText(doc: RichTextNode | undefined | null, mapBlock: BlockMapper): RichText {
    if (!doc?.content) return []
    const blocks: RichText = []

    for (const node of doc.content) {
        switch (node.type) {
            case 'paragraph': {
                const block = textBlock(node.content)
                if (block.text) blocks.push({ type: 'paragraph', ...block })
                break
            }
            case 'heading': {
                // The page title is the only h1, so h1 becomes h2 and anything below h3 becomes h3
                const level = Math.min(3, Math.max(2, Number(node.attrs?.level ?? 2))) as 2 | 3
                const text = inlineText(node.content).trim()
                if (text) blocks.push({ type: 'heading', level, text })
                break
            }
            case 'blockquote': {
                // A last paragraph starting with a dash ("— Charles V") becomes the citation, as written in Word
                const paragraphs = (node.content ?? []).filter((child) => child.type === 'paragraph')
                const last = paragraphs.at(-1)
                const lastText = last ? inlineText(last.content).trim() : ''
                const hasCite = paragraphs.length > 1 && /^[—–-]\s*/.test(lastText)
                const quoteParagraphs = hasCite ? paragraphs.slice(0, -1) : paragraphs
                const parts = quoteParagraphs.map((paragraph) => textBlock(paragraph.content))
                blocks.push({
                    type: 'quote',
                    text: parts.map((part) => part.text).join('\n'),
                    html: parts.some((part) => part.html) ? parts.map((part) => part.html ?? escapeHtml(part.text)).join('<br>') : undefined,
                    cite: hasCite ? lastText.replace(/^[—–-]\s*/, '') : undefined,
                })
                break
            }
            case 'bullet_list':
            case 'ordered_list': {
                const items = (node.content ?? []).map((item) =>
                    textBlock((item.content ?? []).flatMap((child) => (child.type === 'paragraph' ? (child.content ?? []) : [])))
                )
                blocks.push({ type: 'list', ordered: node.type === 'ordered_list', items: items.filter((item) => item.text) })
                break
            }
            case 'image': {
                if (node.attrs?.src) blocks.push({ type: 'figure', src: node.attrs.src, alt: node.attrs.alt ?? '', caption: node.attrs.title || undefined })
                break
            }
            case 'blok': {
                for (const blok of node.attrs?.body ?? []) blocks.push(...mapBlock(blok))
                break
            }
            // horizontal_rule, code_block and anything unknown are skipped
        }
    }
    return blocks
}
