import './ArticleCard.scss'
import type { ArticleMeta } from '@app-types/article'

const GRADIENT_MAP: Record<string, string> = {
    default: 'card-img-default',
}

interface Props {
    article: ArticleMeta
}

export default function ArticleCard({ article }: Props) {
    const gradientClass = GRADIENT_MAP[article.heroGradient ?? ''] ?? GRADIENT_MAP['default']
    const abbreviation = article.period ?? article.title.slice(0, 3).toUpperCase()

    return (
        <a href={`/articles/${article.slug}`} className="card">
            <div className="card__image">
                <div className={`card__image-inner ${gradientClass}`}>
                    <span>{abbreviation}</span>
                </div>
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
