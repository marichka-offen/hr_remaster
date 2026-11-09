import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useFocusTrap } from '@hooks/useFocusTrap'
import { useScrollLock } from '@hooks/useScrollLock'
import type { TocItem } from '@lib/content/article-utils'
import './TableOfContents.scss'

interface Props {
    items: TocItem[]
}

// Distance from the top of the window at which a heading counts as "being read": the fixed header plus a little air
function readingLine(): number {
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')) || 4.5
    return header * 16 + 24
}

function useActiveSection(ids: string[]): string | null {
    const [active, setActive] = useState<string | null>(ids[0] ?? null)

    useEffect(() => {
        const headings = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
        let frame = 0

        const update = () => {
            frame = 0
            const line = readingLine()
            let current = headings[0]?.id ?? null
            for (const heading of headings) {
                if (heading.getBoundingClientRect().top - line <= 1) current = heading.id
                else break
            }
            setActive(current)
        }
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }

        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            cancelAnimationFrame(frame)
        }
    }, [ids.join('|')])

    return active
}

export default function TableOfContents({ items }: Props) {
    const [open, setOpen] = useState(false)
    const drawerRef = useRef<HTMLDivElement>(null)
    const { lock, unlock } = useScrollLock()
    const active = useActiveSection(items.map((item) => item.id))

    useFocusTrap(drawerRef, open, () => setOpen(false))

    useEffect(() => {
        open ? lock() : unlock()
    }, [open])

    if (items.length < 2) return null

    // Jump to the section and move keyboard focus to its heading, so Tab continues from there
    const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        const target = document.getElementById(id)
        if (!target) return
        event.preventDefault()
        setOpen(false)
        history.pushState(null, '', `#${id}`)
        setTimeout(() => {
            const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
            target.setAttribute('tabindex', '-1')
            target.focus({ preventScroll: true })
        }, 0)
    }

    const list = (
        <ol className="toc__list">
            {items.map((item) => (
                <li key={item.id} className={`toc__item toc__item--level-${item.level}`}>
                    <a
                        href={`#${item.id}`}
                        className="toc__link"
                        aria-current={active === item.id ? 'location' : undefined}
                        onClick={(event) => goTo(event, item.id)}
                    >
                        {item.text}
                    </a>
                </li>
            ))}
        </ol>
    )

    return (
        <>
            <nav className="toc toc--sidebar" aria-label="Contents">
                <p className="toc__label">Contents</p>
                {list}
            </nav>

            <button
                type="button"
                className="toc__toggle"
                aria-expanded={open}
                aria-controls="toc-drawer"
                onClick={() => setOpen(true)}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                </svg>
                Contents
            </button>

            <div className={`toc__overlay ${open ? 'toc__overlay--open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
            <div
                ref={drawerRef}
                id="toc-drawer"
                className={`toc toc--drawer ${open ? 'toc--open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="toc-drawer-title"
                hidden={!open}
            >
                <div className="toc__drawer-head">
                    <p className="toc__label" id="toc-drawer-title">Contents</p>
                    <button type="button" className="toc__close" onClick={() => setOpen(false)} aria-label="Close contents">
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>
                <nav aria-label="Contents">{list}</nav>
            </div>
        </>
    )
}
