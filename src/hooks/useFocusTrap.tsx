import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

// While active: moves focus into the container, keeps Tab and Shift+Tab inside it, closes on Escape,
// and returns focus to whatever was focused before (usually the button that opened it)
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean, onEscape?: () => void) {
    useEffect(() => {
        const container = containerRef.current
        if (!active || !container) return

        const previous = document.activeElement as HTMLElement | null
        const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
        focusables()[0]?.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscape?.()
                return
            }
            if (event.key !== 'Tab') return
            const items = focusables()
            if (items.length === 0) return
            const first = items[0]
            const last = items[items.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            previous?.focus()
        }
    }, [active])
}
