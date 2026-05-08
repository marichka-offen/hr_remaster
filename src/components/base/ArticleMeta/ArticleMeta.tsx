import './ArticleMeta.scss'

interface Props {
    readTime?: string
    tag?: string
    tone?: 'light' | 'dark'
}

export default function ArticleMeta({ readTime, tag, tone = 'light' }: Props) {
    const items = [readTime, tag].filter(Boolean) as string[]
    if (!items.length) return null

    return (
        <div className={`article-meta article-meta--${tone}`}>
            {items.map((item, i) => (
                <>
                    {i > 0 && <span className="article-meta__dot" aria-hidden="true">·</span>}
                    <span key={item}>{item}</span>
                </>
            ))}
        </div>
    )
}
