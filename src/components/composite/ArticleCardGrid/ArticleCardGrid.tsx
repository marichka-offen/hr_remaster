import { useEffect, useState } from 'react'
import ArticleCard from '@components/composite/ArticleCard/ArticleCard'
import CategoryFilter from '@components/composite/CategoryFilter/CategoryFilter'
import './ArticleCardGrid.scss'
import type { ArticleMeta } from '@app-types/article'

type Sort = 'newest' | 'period'

interface Props {
    articles: ArticleMeta[]
    showCategoryFilter?: boolean
    // Result count and a sort menu, for the full archive page
    showToolbar?: boolean
    cardTitleAs?: 'h2' | 'h3'
}

const ALL = 'All'

// Articles arrive newest first. "Period" orders by the first year covered; articles without one go last
function sortArticles(articles: ArticleMeta[], sort: Sort): ArticleMeta[] {
    if (sort === 'newest') return articles
    return [...articles].sort((a, b) => (a.startYear ?? Infinity) - (b.startYear ?? Infinity))
}

export default function ArticleCardGrid({ articles, showCategoryFilter = false, showToolbar = false, cardTitleAs = 'h3' }: Props) {
    const [activeCategory, setActiveCategory] = useState(ALL)
    const [sort, setSort] = useState<Sort>('newest')

    // The topic and sort can come from the address bar, e.g. footer links to /articles?topic=medieval
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const match = articles.find((a) => a.topicSlug === params.get('topic'))
        if (match) setActiveCategory(match.category)
        if (params.get('sort') === 'period') setSort('period')
    }, [])

    const updateUrl = (category: string, nextSort: Sort) => {
        const url = new URL(window.location.href)
        const topicSlug = articles.find((a) => a.category === category)?.topicSlug
        if (category === ALL || !topicSlug) url.searchParams.delete('topic')
        else url.searchParams.set('topic', topicSlug)
        if (nextSort === 'newest') url.searchParams.delete('sort')
        else url.searchParams.set('sort', nextSort)
        window.history.replaceState({}, '', url)
    }

    const changeCategory = (category: string) => {
        setActiveCategory(category)
        updateUrl(category, sort)
    }

    const changeSort = (nextSort: Sort) => {
        setSort(nextSort)
        updateUrl(activeCategory, nextSort)
    }

    const categories = [ALL, ...Array.from(new Set(articles.map((a) => a.category)))]
    const filtered = activeCategory === ALL ? articles : articles.filter((a) => a.category === activeCategory)
    const visible = sortArticles(filtered, sort)

    const count = `${visible.length} ${visible.length === 1 ? 'article' : 'articles'}${activeCategory === ALL ? '' : ` in ${activeCategory}`}`

    return (
        <>
            {showCategoryFilter && (
                <CategoryFilter categories={categories} activeCategory={activeCategory} onChange={changeCategory} />
            )}

            {showToolbar && (
                <div className="articles__toolbar">
                    {/* Announced to screen readers when the filter changes */}
                    <p className="articles__count" aria-live="polite">{count}</p>
                    <label className="articles__sort">
                        <span>Sort by</span>
                        <select value={sort} onChange={(event) => changeSort(event.target.value as Sort)}>
                            <option value="newest">Newest first</option>
                            <option value="period">Period, earliest first</option>
                        </select>
                    </label>
                </div>
            )}

            {visible.length > 0 ? (
                <div className="articles__grid">
                    {visible.map((article) => (
                        <ArticleCard key={article.slug} article={article} titleAs={cardTitleAs} />
                    ))}
                </div>
            ) : (
                <div className="articles__empty">
                    <p>No articles in {activeCategory} yet.</p>
                    <button type="button" className="articles__empty-reset" onClick={() => changeCategory(ALL)}>
                        Show all articles
                    </button>
                </div>
            )}
        </>
    )
}
