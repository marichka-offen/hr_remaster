import './PlaceholderImage.scss'

interface Props {
    gradient: string
    code: string
    category?: string
    aspect?: 'square' | 'portrait' | 'landscape' | 'card'
}

export default function PlaceholderImage({ gradient, code, category, aspect = 'landscape' }: Props) {
    return (
        <div className={`placeholder placeholder--${aspect}`} style={{ background: gradient }}>
            <span className="placeholder__code">{code}</span>
            {category && <div className="placeholder__category">{category}</div>}
        </div>
    )
}
