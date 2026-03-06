import { useEffect, useState } from 'react'
import './MobileNav.scss'
import { useScrollLock } from '@hooks/useScrollLock'

export default function MobileNav() {

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
            <a className='mobile-nav__link' href="#">Home</a>
            <a className='mobile-nav__link' href="#">Articles</a>
            <a className='mobile-nav__link' href="#">Book</a>
            <a className='mobile-nav__link' href="#">About</a>
            <a className='mobile-nav__link' href="#">Contact</a>
        </div>

    )
}