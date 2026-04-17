import { defineMigration, at, setIfMissing, set } from 'sanity/migrate'

const TYPE_MAP: Record<string, string> = {
    heroSection: 'hero',
    bioHeroSection: 'bioHero',
    featuredArticleSection: 'featured',
    articlesGridSection: 'articleGrid',
    aboutPreviewSection: 'authorCard',
    bookPreviewSection: 'bookPromo',
}

export default defineMigration({
    title: 'Rename section types',
    documentTypes: ['pages'],
    migrate: {
        document(doc, context) {
            const sections = (doc as any).sections as any[] | undefined
            if (!sections?.length) return

            const updated = sections.map((section) => {
                const newType = TYPE_MAP[section._type]
                if (newType) {
                    return { ...section, _type: newType }
                }
                return section
            })

            const hasChanges = updated.some(
                (s, i) => s._type !== sections[i]._type
            )

            if (hasChanges) {
                return [at('sections', set(updated))]
            }
        },
    },
})
