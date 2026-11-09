import './ArticleCard.scss'
import { cardMeta, eraColor, years } from '@lib/period'
import type { ArticleMeta } from '@app-types/article'

interface Props {
    article: ArticleMeta
    // h3 under a section heading, h2 when the grid sits directly under the page's h1
    titleAs?: 'h2' | 'h3'
}

// An article card: the article's image, or its years printed on a band in the period's colour
export default function ArticleCard({ article, titleAs: Title = 'h3' }: Props) {
    const span = years(article)
    const meta = cardMeta(article)

    return (
        <a href={`/articles/${article.slug}`} className="card">
            {article.imageUrl ? (
                <div className="card__image">
                    <img src={article.imageUrl} alt="" className="card__image-inner" loading="lazy" />
                </div>
            ) : (
                <div className="card__band" style={{ background: eraColor(article.startYear) }} aria-hidden="true">
                    <span className="card__band-years">{span}</span>
                </div>
            )}
            <div className="card__body">
                <p className="card__topic">
                    {article.category}
                    {span && ` · ${span}`}
                </p>
                <Title className="card__title">{article.title}</Title>
                {article.excerpt && <p className="card__excerpt">{article.excerpt}</p>}
                {meta && <p className="card__meta">{meta}</p>}
            </div>
        </a>
    )
}
