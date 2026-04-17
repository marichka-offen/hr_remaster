import { useState } from 'react'
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

    const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))]
    const filtered = activeCategory === 'All' ? articles : articles.filter((a) => a.category === activeCategory)

    return (
        <>
            {showCategoryFilter && (
                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onChange={setActiveCategory}
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
