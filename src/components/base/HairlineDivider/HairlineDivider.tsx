import './HairlineDivider.scss'

interface Props {
    width?: 40 | 60
    color?: 'gold' | 'white'
    align?: 'left' | 'center' | 'right'
}

export default function HairlineDivider({ width = 40, color = 'gold', align = 'center' }: Props) {
    return (
        <div
            className={`hairline hairline--${color} hairline--${align}`}
            style={{ width: `${width}px` }}
        />
    )
}
