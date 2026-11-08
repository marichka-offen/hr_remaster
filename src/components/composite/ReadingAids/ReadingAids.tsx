import { useEffect, useState } from 'react'
import './ReadingAids.scss'

interface Props {
    // The element whose length the progress bar measures, usually the article body
    targetId: string
    // Where keyboard focus goes after "Back to top", usually the article title
    focusId: string
}

// A reading-progress bar under the header and a back-to-top button that appears after one screen of scrolling
export default function ReadingAids({ targetId, focusId }: Props) {
    const [progress, setProgress] = useState(0)
    const [showTop, setShowTop] = useState(false)

    useEffect(() => {
        const target = document.getElementById(targetId)
        if (!target) return
        let frame = 0

        const update = () => {
            frame = 0
            const rect = target.getBoundingClientRect()
            const total = rect.height - window.innerHeight
            const read = total > 0 ? -rect.top / total : rect.top <= 0 ? 1 : 0
            setProgress(Math.min(1, Math.max(0, read)))
            setShowTop(window.scrollY > window.innerHeight)
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
    }, [targetId])

    const backToTop = () => {
        const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
        const title = document.getElementById(focusId)
        if (title) {
            title.setAttribute('tabindex', '-1')
            title.focus({ preventScroll: true })
        }
    }

    return (
        <>
            {/* Decorative: the scroll position already tells assistive tech where the reader is */}
            <div className="reading-progress" aria-hidden="true">
                <div className="reading-progress__bar" style={{ transform: `scaleX(${progress})` }} />
            </div>

            <button
                type="button"
                className={`back-to-top ${showTop ? 'back-to-top--visible' : ''}`}
                onClick={backToTop}
                tabIndex={showTop ? 0 : -1}
                aria-hidden={!showTop}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span className="back-to-top__label">Back to top</span>
            </button>
        </>
    )
}
