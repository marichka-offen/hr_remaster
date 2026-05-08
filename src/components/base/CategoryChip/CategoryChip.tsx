import './CategoryChip.scss'

interface Props {
    label: string
    variant?: 'overlay' | 'tag'
}

export default function CategoryChip({ label, variant = 'overlay' }: Props) {
    return <div className={`category-chip category-chip--${variant}`}>{label}</div>
}
