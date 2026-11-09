import './SectionTitle.scss'
import type { ReactNode } from 'react'

interface Props {
    tone?: 'light' | 'dark'
    // h1 when the title is the page's main heading, h2 for sections within a page
    as?: 'h1' | 'h2'
    children: ReactNode
}

export default function SectionTitle({ tone = 'light', as: Tag = 'h2', children }: Props) {
    return <Tag className={`section-title section-title--${tone}`}>{children}</Tag>
}
