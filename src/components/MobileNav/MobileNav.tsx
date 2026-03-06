import { useEffect, useState } from 'react'
import './MobileNav.scss'

export default function MobileNav() {

    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const toggleHandler = () => setMenuOpen(state => !state)
        document.addEventListener('toggle-mobile-nav', toggleHandler)
        console.log('Listening')

        return () => {
            document.removeEventListener('toggle-mobile-nav', toggleHandler)
        }
    }, [])

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