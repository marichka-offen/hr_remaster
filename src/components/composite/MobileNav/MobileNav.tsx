import { useEffect, useState } from 'react'
import './MobileNav.scss'
import { useScrollLock } from '@hooks/useScrollLock'

interface NavLink {
    label: string
    href: string
}

interface Props {
    navLinks: NavLink[]
}

export default function MobileNav({ navLinks }: Props) {

    const [menuOpen, setMenuOpen] = useState(false)
    const { lock, unlock } = useScrollLock()

    useEffect(() => {
        const toggleHandler = () => setMenuOpen(state => !state)
        document.addEventListener('toggle-mobile-nav', toggleHandler)
        return () => {
            document.removeEventListener('toggle-mobile-nav', toggleHandler)
        }
    }, [])

    useEffect(() => {
        menuOpen ? lock() : unlock()
    }, [menuOpen])

    return (
        <div className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`} id='mobileNav'>
            {navLinks.map((link) => (
                <a key={link.href} className='mobile-nav__link' href={link.href}>{link.label}</a>
            ))}
        </div>
    )
}