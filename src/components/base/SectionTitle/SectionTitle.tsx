import './SectionTitle.scss'
import type { ReactNode } from 'react'

interface Props {
    tone?: 'light' | 'dark'
    children: ReactNode
}

export default function SectionTitle({ tone = 'light', children }: Props) {
    return <h2 className={`section-title section-title--${tone}`}>{children}</h2>
}
