import { useState, useMemo, useCallback, memo } from 'react'
import type { ArticleMeta } from '@types/article'
import CategoryFilter from '@components/CategoryFilter/CategoryFilter'
import './ArticleCardGrid.scss'

const GRADIENT_MAP: Record<string, string> = {
    war: 'card-img-1',
    colony: 'card-img-2',
    politics: 'card-img-3',
    trade: 'card-img-4',
    default: 'card-img-5',
}

interface ArticleCardProps {
    article: ArticleMeta
}

const ArticleCard = memo(function ArticleCard({ article }: ArticleCardProps) {
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
                    {article.tags[0] && <span>{article.tags[0]}</span>}
                </div>
            </div>
        </a>
    )
})

interface Props {
    articles: ArticleMeta[]
    label?: string
    heading?: string
}

export default function ArticleCardGrid({ articles, label, heading }: Props) {
    const [activeCategory, setActiveCategory] = useState('All')

    const categories = useMemo(() => {
        const unique = Array.from(new Set(articles.map((a) => a.category)))
        return ['All', ...unique]
    }, [articles])

    const filtered = useMemo(() => {
        if (activeCategory === 'All') return articles
        return articles.filter((a) => a.category === activeCategory)
    }, [articles, activeCategory])

    const handleCategoryChange = useCallback((category: string) => {
        setActiveCategory(category)
    }, [])

    return (
        <section id="articles">
            <div className="articles__container">
                <div className="articles__header">
                    <div className="articles__label">{label ?? 'Archive'}</div>
                    <h2 className="articles__heading">{heading ?? 'History Articles'}</h2>
                    <div className="articles__line"></div>
                </div>

                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onChange={handleCategoryChange}
                />

                <div className="articles__grid">
                    {filtered.map((article) => (
                        <ArticleCard key={article.slug} article={article} />
                    ))}
                </div>
            </div>
        </section>
    )
}
