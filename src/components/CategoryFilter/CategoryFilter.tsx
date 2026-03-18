import { useCallback } from 'react'
import './CategoryFilter.scss'

interface Props {
    categories: string[]
    activeCategory: string
    onChange: (category: string) => void
}

export default function CategoryFilter({ categories, activeCategory, onChange }: Props) {
    const handleClick = useCallback(
        (category: string) => () => onChange(category),
        [onChange]
    )

    return (
        <div className="category-filter">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`category-filter__pill ${activeCategory === category ? 'category-filter__pill--active' : ''}`}
                    onClick={handleClick(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}
