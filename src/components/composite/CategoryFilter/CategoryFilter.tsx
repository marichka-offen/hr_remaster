import './CategoryFilter.scss'

interface Props {
    categories: string[]
    activeCategory: string
    onChange: (category: string) => void
}

// Toggle buttons: aria-pressed tells screen readers which topic is selected
export default function CategoryFilter({ categories, activeCategory, onChange }: Props) {
    return (
        <div className="category-filter" role="group" aria-label="Filter by topic">
            {categories.map((category) => {
                const active = activeCategory === category
                return (
                    <button
                        key={category}
                        type="button"
                        className={`category-filter__pill ${active ? 'category-filter__pill--active' : ''}`}
                        aria-pressed={active}
                        onClick={() => onChange(category)}
                    >
                        {category}
                    </button>
                )
            })}
        </div>
    )
}
