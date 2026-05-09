import './Eyebrow.scss'
import type { ReactNode } from 'react'

interface Props {
    align?: 'left' | 'center' | 'right'
    color?: 'gold' | 'white'
    size?: 'sm' | 'md'
    children: ReactNode
}

export default function Eyebrow({ align = 'center', color = 'gold', size = 'sm', children }: Props) {
    return (
        <div className={`eyebrow eyebrow--${color} eyebrow--${align} eyebrow--${size}`}>
            {children}
        </div>
    )
}
