import './ArticleCard.scss'
import PlaceholderImage from '@components/base/PlaceholderImage/PlaceholderImage'
import CategoryChip from '@components/base/CategoryChip/CategoryChip'
import type { ArticleMeta as ArticleMetaType } from '@app-types/article'

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #3a3040 0%, #2a4a52 100%)'

interface Props {
    article: ArticleMetaType
}

export default function ArticleCard({ article }: Props) {
    const code = article.period ?? article.title.slice(0, 3).toUpperCase()

    const gradient = article.gradientFrom && article.gradientTo
        ? `linear-gradient(135deg, ${article.gradientFrom} 0%, ${article.gradientTo} 100%)`
        : DEFAULT_GRADIENT

    return (
        <a href={`/articles/${article.slug}`} className="card">
            <div className="card__image">
                {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.imageAlt ?? article.title} className="card__image-inner" />
                ) : (
                    <PlaceholderImage gradient={gradient} code={code} aspect="card" />
                )}
                {article.tags?.[0] && (
                    <div className="card__chip">
                        <CategoryChip label={article.tags[0]} variant="overlay" />
                    </div>
                )}
            </div>
            <div className="card__body">
                <h3 className="card__title">{article.title}</h3>
                {article.excerpt && (
                    <p className="card__excerpt">{article.excerpt}</p>
                )}
                <div className="card__meta">
                    {article.readTime && <span className="card__read-time">{article.readTime}</span>}
                    {article.category && <span className="card__category-label">{article.category}</span>}
                </div>
            </div>
        </a>
    )
}
