import './PlaceholderImage.scss'

interface Props {
    gradient: string
    code: string
    aspect?: 'square' | 'portrait' | 'landscape' | 'card'
}

export default function PlaceholderImage({ gradient, code, aspect = 'landscape' }: Props) {
    return (
        <div className={`placeholder placeholder--${aspect}`} style={{ background: gradient }}>
            <span className="placeholder__code">{code}</span>
        </div>
    )
}
