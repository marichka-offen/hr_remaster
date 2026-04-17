export const pageBySlugQuery = `
  *[_type == "pages" && slug.current == $slug][0] {
    title,
    description,
    sections[] {
      _type,
      _key,

      // heroSection
      _type == "heroSection" => {
        label,
        title,
        quote,
        quoteAuthor,
        ctaText,
        ctaLink
      },

      // featuredArticleSection
      _type == "featuredArticleSection" => {
        label,
        heading,
        article-> {
          title,
          "slug": slug.current,
          subtitle,
          period,
          excerpt,
          readTime,
          heroGradient,
          "category": topic->name
        }
      },

      // articlesGridSection
      _type == "articlesGridSection" => {
        label,
        heading,
        showCategoryFilter,
        articles[]-> {
          title,
          "slug": slug.current,
          subtitle,
          period,
          "category": topic->name,
          tags,
          excerpt,
          readTime,
          heroGradient
        },
        cta
      },

      // aboutPreviewSection
      _type == "aboutPreviewSection" => {
        name,
        role,
        bio,
        initials,
        linkText,
        linkUrl
      },

      // bookPreviewSection
      _type == "bookPreviewSection" => {
        label,
        coverLabel,
        title,
        subtitle,
        description,
        ctaText,
        ctaLink
      }
    }
  }
`

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    header {
      logoTitle,
      logoSubtitle,
      navigation[] {
        "label": coalesce(labelOverride, page->title),
        "href": select(
          page->slug.current == "home" => "/",
          "/" + page->slug.current
        )
      }
    },
    footer {
      description,
      topicsTitle,
      topics[] {
        "label": coalesce(label, topic->name),
        "href": "/" + topic->slug.current
      },
      copyright,
      copyrightNote
    }
  }
`

export const allArticlesQuery = `
  *[_type == "articles"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    subtitle,
    period,
    "category": topic->name,
    tags,
    excerpt,
    readTime,
    heroGradient
  }
`
