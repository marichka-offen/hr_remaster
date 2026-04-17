import { useState, useEffect } from 'react'
import ArticleCard from '@components/ArticleCard/ArticleCard'
import CategoryFilter from '@components/CategoryFilter/CategoryFilter'
import './ArticleCardGrid.scss'
import type { ArticleMeta } from '@app-types/article'

interface Props {
    articles: ArticleMeta[]
    showCategoryFilter?: boolean
}

export default function ArticleCardGrid({ articles, showCategoryFilter = false }: Props) {
    const [activeCategory, setActiveCategory] = useState('All')

    useEffect(() => {
        const topicSlug = new URLSearchParams(window.location.search).get('topic')
        if (!topicSlug) return

        const match = articles.find((a) => a.topicSlug === topicSlug)
        if (match) setActiveCategory(match.category)
    }, [])

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category)

        const url = new URL(window.location.href)
        if (category === 'All') {
            url.searchParams.delete('topic')
        } else {
            const match = articles.find((a) => a.category === category)
            if (match?.topicSlug) {
                url.searchParams.set('topic', match.topicSlug)
            }
        }
        window.history.replaceState({}, '', url)
    }

    const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))]
    const filtered = activeCategory === 'All' ? articles : articles.filter((a) => a.category === activeCategory)

    return (
        <>
            {showCategoryFilter && (
                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onChange={handleCategoryChange}
                />
            )}
            <div className="articles__grid">
                {filtered.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                ))}
            </div>
        </>
    )
}
