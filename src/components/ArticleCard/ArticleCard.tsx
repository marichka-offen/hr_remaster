import './ArticleCard.scss'
import type { ArticleMeta } from '@app-types/article'

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #3a3040 0%, #2a4a52 100%)'

interface Props {
    article: ArticleMeta
}

export default function ArticleCard({ article }: Props) {
    const abbreviation = article.period ?? article.title.slice(0, 3).toUpperCase()

    const gradient = article.gradientFrom && article.gradientTo
        ? `linear-gradient(135deg, ${article.gradientFrom} 0%, ${article.gradientTo} 100%)`
        : DEFAULT_GRADIENT

    return (
        <a href={`/articles/${article.slug}`} className="card">
            <div className="card__image">
                {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.imageAlt ?? article.title} className="card__image-inner" />
                ) : (
                    <div className="card__image-inner" style={{ background: gradient }}>
                        <span>{abbreviation}</span>
                    </div>
                )}
                <div className="card__category">{article.category}</div>
            </div>
            <div className="card__body">
                <h3 className="card__title">{article.title}</h3>
                {article.excerpt && (
                    <p className="card__excerpt">{article.excerpt}</p>
                )}
                <div className="card__meta">
                    {article.readTime && <span>{article.readTime}</span>}
                    {article.tags && <span>{article.tags[0]}</span>}
                </div>
            </div>
        </a>
    )
}
