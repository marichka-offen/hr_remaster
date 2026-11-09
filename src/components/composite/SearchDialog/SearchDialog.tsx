import { useEffect, useRef, useState } from 'react'
import './SearchDialog.scss'

interface Result {
    url: string
    title: string
    type?: string
    excerpt: string
}

interface Pagefind {
    search: (term: string) => Promise<{ results: { data: () => Promise<PagefindData> }[] }>
}

interface PagefindData {
    url: string
    excerpt: string
    meta: { title?: string; type?: string }
}

// The index is written to /pagefind/ by `pagefind --site dist` after each build, so it only exists
// on the built site (npm run build, then npm run preview), not in npm run dev
const PAGEFIND_PATH = '/pagefind/pagefind.js'

export default function SearchDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const pagefindRef = useRef<Pagefind | null>(null)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Result[]>([])
    const [status, setStatus] = useState<'idle' | 'searching' | 'done' | 'unavailable'>('idle')

    const loadPagefind = async () => {
        if (pagefindRef.current) return pagefindRef.current
        try {
            pagefindRef.current = await import(/* @vite-ignore */ PAGEFIND_PATH)
            return pagefindRef.current
        } catch {
            setStatus('unavailable')
            return null
        }
    }

    const open = () => {
        dialogRef.current?.showModal()
        inputRef.current?.focus()
        loadPagefind()
    }

    // "/" or Ctrl/Cmd+K opens search from anywhere, the usual shortcuts on content sites.
    // "/" is ignored while typing in a field, so it can still be typed
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement
            const typing = target.closest('input, textarea, select, [contenteditable="true"]')
            const slash = event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey
            if (slash || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
                event.preventDefault()
                open()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    useEffect(() => {
        const term = query.trim()
        if (!term) {
            setResults([])
            setStatus((current) => (current === 'unavailable' ? current : 'idle'))
            return
        }
        let cancelled = false
        // Wait until typing pauses, so each keystroke doesn't start its own search
        const timer = setTimeout(async () => {
            const pagefind = await loadPagefind()
            if (!pagefind || cancelled) return
            setStatus('searching')
            const search = await pagefind.search(term)
            if (cancelled) return
            const data = await Promise.all(search.results.slice(0, 8).map((result) => result.data()))
            if (cancelled) return
            setResults(
                data.map((item) => ({
                    url: item.url,
                    title: item.meta.title ?? item.url,
                    type: item.meta.type,
                    excerpt: item.excerpt,
                }))
            )
            setStatus('done')
        }, 250)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [query])

    // Up and down arrows move between the search field and the results, as in most site searches
    const onDialogKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
        const items = [inputRef.current, ...Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('.search-dialog__result') ?? [])].filter(Boolean) as HTMLElement[]
        if (items.length < 2) return
        event.preventDefault()
        const index = items.indexOf(document.activeElement as HTMLElement)
        const next = event.key === 'ArrowDown' ? Math.min(index + 1, items.length - 1) : Math.max(index - 1, 0)
        items[next].focus()
    }

    const examples = ['Hussites', 'Virginia', 'Benburb']

    // Clicking the dimmed area outside the panel closes the dialog
    const onDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
    }

    const message =
        status === 'unavailable'
            ? 'Search works on the built site: run npm run build, then npm run preview.'
            : status === 'done' && results.length === 0
              ? `No articles or books match “${query.trim()}”.`
              : status === 'done'
                ? `${results.length} ${results.length === 1 ? 'result' : 'results'}`
                : status === 'searching'
                  ? 'Searching…'
                  : ''

    return (
        <>
            <button type="button" className="search-trigger" onClick={open} aria-haspopup="dialog">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="M16 16l4.5 4.5" />
                </svg>
                {/* Visible on wide screens; on phones the icon stands alone and this text is read out */}
                <span className="search-trigger__label">Search the archive</span>
            </button>

            {/* Native <dialog>: the browser keeps focus inside, closes on Escape and returns focus to the button */}
            <dialog ref={dialogRef} className="search-dialog" aria-label="Search" onClick={onDialogClick} onKeyDown={onDialogKeyDown}>
                <div className="search-dialog__panel">
                    <form className="search-dialog__form" role="search" onSubmit={(event) => event.preventDefault()}>
                        <div className="search-dialog__top">
                            <label htmlFor="site-search" className="search-dialog__label">Search the archive</label>
                            <button type="button" className="search-dialog__close" onClick={() => dialogRef.current?.close()}>
                                Close
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M7 7l10 10M17 7L7 17" />
                                </svg>
                            </button>
                        </div>
                        <div className="search-dialog__field">
                            <svg className="search-dialog__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                                <circle cx="11" cy="11" r="6.5" />
                                <path d="M16 16l4.5 4.5" />
                            </svg>
                            <input
                                ref={inputRef}
                                id="site-search"
                                type="search"
                                className="search-dialog__input"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search battles, regiments, campaigns…"
                                autoComplete="off"
                                spellCheck={false}
                            />
                            {query && (
                                <button
                                    type="button"
                                    className="search-dialog__clear"
                                    aria-label="Clear search"
                                    onClick={() => {
                                        setQuery('')
                                        inputRef.current?.focus()
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M7 7l10 10M17 7L7 17" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="search-dialog__hint">
                        {/* Always rendered, so screen readers reliably announce changes to it */}
                        <p className="search-dialog__status" aria-live="polite">
                            {message ||
                                (status !== 'unavailable' && (
                                    <>
                                        Try:{' '}
                                        {examples.map((example, i) => (
                                            <span key={example}>
                                                <button type="button" className="search-dialog__example" onClick={() => setQuery(example)}>
                                                    {example}
                                                </button>
                                                {i < examples.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </>
                                ))}
                        </p>
                        <p className="search-dialog__shortcut" aria-hidden="true">
                            <kbd>Esc</kbd> to close
                        </p>
                    </div>

                    {results.length > 0 && (
                        <ul className="search-dialog__results">
                            {results.map((result) => (
                                <li key={result.url}>
                                    <a className="search-dialog__result" href={result.url}>
                                        <span className="search-dialog__result-text">
                                            {result.type && <span className="search-dialog__type">{result.type}</span>}
                                            <span className="search-dialog__title">{result.title}</span>
                                            {/* Pagefind returns the excerpt as HTML with <mark> around the matched words */}
                                            <span className="search-dialog__excerpt" dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                                        </span>
                                        <svg className="search-dialog__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </dialog>
        </>
    )
}
