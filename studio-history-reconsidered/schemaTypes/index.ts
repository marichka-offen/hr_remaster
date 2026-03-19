// Documents
import {page} from './documents/page'
import {siteSettings} from './documents/siteSettings'
import {article} from './documents/article'
import {topic} from './documents/topic'

// Sections
import {heroSection} from './sections/heroSection'
import {featuredArticleSection} from './sections/featuredArticleSection'
import {articlesGridSection} from './sections/articlesGridSection'
import {aboutPreviewSection} from './sections/aboutPreviewSection'
import {bookPreviewSection} from './sections/bookPreviewSection'

export const schemaTypes = [
  // Documents
  page,
  siteSettings,
  article,
  topic,

  // Sections (object types used within page sections arrays)
  heroSection,
  featuredArticleSection,
  articlesGridSection,
  aboutPreviewSection,
  bookPreviewSection,
]
