import './BookCard.scss'
import PlaceholderImage from '@components/base/PlaceholderImage/PlaceholderImage'
import type { BookMeta } from '@app-types/book'

const DEFAULT_GRADIENT = 'linear-gradient(160deg, #1a2332 0%, #8b2635 100%)'

interface Props {
    book: BookMeta
}

export default function BookCard({ book }: Props) {
    const code = book.title.slice(0, 3).toUpperCase()

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
                    <PlaceholderImage gradient={DEFAULT_GRADIENT} code={code} aspect="portrait" />
                )}
                {book.coverLabel && (
                    <span className="book-card__badge">{book.coverLabel}</span>
                )}
            </div>
            <div className="book-card__body">
                {book.publishedYear && (
                    <span className="book-card__year">{book.publishedYear}</span>
                )}
                <h3 className="book-card__title">{book.title}</h3>
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
