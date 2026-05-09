import Clock from '@icons/clock'
import Pen from '@icons/pen'
import './ArticleMeta.scss'

interface Props {
    readTime?: string
    tag?: string
    tone?: 'light' | 'dark'
}

export default function ArticleMeta({ readTime, tag, tone = 'light' }: Props) {
    if (!readTime && !tag) return null

    return (
        <div className={`article-meta article-meta--${tone}`}>
            {readTime && (
                <span className="article-meta__item">
                    <Clock />
                    {readTime}
                </span>
            )}
            {readTime && tag && <span className="article-meta__dot" aria-hidden="true">·</span>}
            {tag && (
                <span className="article-meta__item">
                    <Pen />
                    {tag}
                </span>
            )}
        </div>
    )
}
