import './DropCap.scss'
import type { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function DropCap({ children }: Props) {
    return <span className="drop-cap">{children}</span>
}
