// Documents
import { page } from './documents/page'
import { siteSettings } from './documents/siteSettings'
import { article } from './documents/article'
import { topic } from './documents/topic'

// Objects
import { cta } from './objects/cta'
import { richImage } from './objects/richImage'

// Sections
import { hero } from './sections/hero'
import { bioHero } from './sections/bioHero'
import { featured } from './sections/featured'
import { articleGrid } from './sections/articleGrid'
import { authorCard } from './sections/authorCard'
import { bookPromo } from './sections/bookPromo'

export const schemaTypes = [
    // Documents
    page,
    siteSettings,
    article,
    topic,

    // Objects
    cta,
    richImage,

    // Sections
    hero,
    bioHero,
    featured,
    articleGrid,
    authorCard,
    bookPromo,
]
