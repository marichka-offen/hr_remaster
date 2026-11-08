import type { CSSProperties } from 'react'
import '../CoverFrame/CoverFrame.scss'
import '../BookCover/BookCover.scss'
import './BookCard.scss'
import type { BookMeta } from '@app-types/book'

interface Props {
    book: BookMeta
    titleAs?: 'h2' | 'h3'
}

export default function BookCard({ book, titleAs: Title = 'h3' }: Props) {
    return (
        <a href={`/books/${book.slug}`} className="book-card">
            <div className="book-card__cover">
                {book.coverImageUrl ? (
                    <img
                        src={book.coverImageUrl}
                        alt={book.coverImageAlt ?? book.title}
                        className="book-card__cover-img"
                    />
                ) : (
                    // Same typographic cover as BookCover (an Astro component, so it can't be used inside React).
                    // Hidden from screen readers: the title is in the card text below
                    <div className="cover-frame book-cover book-card__typeset" style={{ '--inset': '10px' } as CSSProperties} aria-hidden="true">
                        <div className="book-cover__inner">
                            <span className="book-cover__title">{book.title}</span>
                            {book.subtitle && <span className="book-cover__subtitle">{book.subtitle}</span>}
                            {book.author && <span className="book-cover__author">{book.author}</span>}
                        </div>
                    </div>
                )}
                {book.coverLabel && (
                    <span className="book-card__badge">{book.coverLabel}</span>
                )}
            </div>
            <div className="book-card__body">
                {book.publishedYear && (
                    <span className="book-card__year">{book.publishedYear}</span>
                )}
                <Title className="book-card__title">{book.title}</Title>
                {book.subtitle && (
                    <p className="book-card__subtitle">{book.subtitle}</p>
                )}
                {book.excerpt && (
                    <p className="book-card__excerpt">{book.excerpt}</p>
                )}
                <span className="book-card__cta">Read more →</span>
            </div>
        </a>
    )
}
