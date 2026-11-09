import { useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '@hooks/useFocusTrap'
import { useScrollLock } from '@hooks/useScrollLock'
import './MobileNav.scss'

interface NavLink {
    label: string
    href: string
}

interface Props {
    navLinks: NavLink[]
    // The href of the section the current page belongs to, for highlighting
    activeHref?: string
    currentPath?: string
}

// Menu button plus full-screen menu for small screens. Focus stays inside while open,
// Escape closes it, and focus goes back to the button afterwards
export default function MobileNav({ navLinks, activeHref, currentPath }: Props) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const { lock, unlock } = useScrollLock()

    useFocusTrap(containerRef, open, () => setOpen(false))

    useEffect(() => {
        open ? lock() : unlock()
    }, [open])

    return (
        <div ref={containerRef} className="mobile-nav">
            <button
                type="button"
                className={`mobile-nav__toggle ${open ? 'mobile-nav__toggle--open' : ''}`}
                aria-expanded={open}
                aria-controls="mobile-nav-panel"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((state) => !state)}
            >
                <span />
                <span />
                <span />
            </button>

            <nav
                id="mobile-nav-panel"
                className={`mobile-nav__panel ${open ? 'mobile-nav__panel--open' : ''}`}
                aria-label="Main"
                hidden={!open}
            >
                {navLinks.map((link) => {
                    const active = link.href === activeHref
                    return (
                        <a
                            key={link.href}
                            className={`mobile-nav__link ${active ? 'mobile-nav__link--active' : ''}`}
                            href={link.href}
                            aria-current={active ? (currentPath === link.href ? 'page' : 'true') : undefined}
                        >
                            {link.label}
                        </a>
                    )
                })}
            </nav>
        </div>
    )
}
