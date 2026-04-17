export const pageBySlugQuery = `
  *[_type == "pages" && slug.current == $slug][0] {
    title,
    description,
    sections[] {
      _type,
      _key,

      // hero
      _type == "hero" => {
        label,
        title,
        quote,
        quoteAuthor,
        "imageUrl": image.asset.asset->url,
        "imageAlt": image.alt,
        cta
      },

      // featured
      _type == "featured" => {
        label,
        heading,
        article-> {
          title,
          "slug": slug.current,
          subtitle,
          period,
          "imageUrl": image.asset.asset->url,
          "imageAlt": image.alt,
          excerpt,
          readTime,
          "category": topic->name,
          "topicSlug": topic->slug.current,
          "gradientFrom": topic->gradientFrom,
          "gradientTo": topic->gradientTo
        }
      },

      // articleGrid
      _type == "articleGrid" => {
        label,
        heading,
        showCategoryFilter,
        articles[]-> {
          title,
          "slug": slug.current,
          subtitle,
          period,
          "imageUrl": image.asset.asset->url,
          "imageAlt": image.alt,
          "category": topic->name,
          "topicSlug": topic->slug.current,
          "gradientFrom": topic->gradientFrom,
          "gradientTo": topic->gradientTo,
          tags,
          excerpt,
          readTime
        },
        cta
      },

      // authorCard
      _type == "authorCard" => {
        name,
        role,
        bio,
        "imageUrl": image.asset.asset->url,
        "imageAlt": image.alt,
        "imageCaption": image.caption,
        initials,
        cta
      },

      // bookPromo
      _type == "bookPromo" => {
        label,
        coverLabel,
        title,
        subtitle,
        "coverImageUrl": coverImage.asset.asset->url,
        "coverImageAlt": coverImage.alt,
        description,
        cta
      }
    }
  }
`

export const siteSettingsQuery = `
  *[_id == "siteSettings"][0] {
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
        "href": "/articles?topic=" + topic->slug.current
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
    "topicSlug": topic->slug.current,
    tags,
    "imageUrl": image.asset.asset->url,
    "imageAlt": image.alt,
    excerpt,
    readTime,
    "gradientFrom": topic->gradientFrom,
    "gradientTo": topic->gradientTo
  }
`
