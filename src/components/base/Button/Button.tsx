import './Button.scss'
import type { ReactNode } from 'react'

interface Props {
    variant: 'outline-gold' | 'outline-navy' | 'solid-gold' | 'solid-navy' | 'text'
    size?: 'sm' | 'md' | 'lg'
    icon?: boolean
    onTone: 'light' | 'dark'
    href?: string
    text?: string
    openInNewTab?: boolean
    children?: ReactNode
}

export default function Button({ variant, size = 'md', icon = true, onTone, href, text, openInNewTab, children }: Props) {
    const className = `button button__variant--${variant} button__size--${size} button__tone--${onTone}`
    const extraProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    const content = (
        <>
            {text && <span>{text}</span>}
            {children}
            {icon && (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            )}
        </>
    )

    if (href) {
        return <a className={className} href={href} {...extraProps}>{content}</a>
    }
    return <div className={className}>{content}</div>
}
