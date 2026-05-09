export const homeQuery = `
  *[_id == "home"][0] {
    title,
    description,
    sections[] {
      _type,
      _key,

      _type == "hero" => {
        label,
        title,
        quote,
        quoteAuthor,
        "imageUrl": image.asset.asset->url,
        "imageAlt": image.alt,
        cta
      },

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

      _type == "authorCard" => {
        name,
        role,
        bio,
        "imageUrl": image.asset.asset->url,
        "imageAlt": image.alt,
        initials,
        cta
      },

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

export const aboutQuery = `
  *[_id == "about"][0] {
    title,
    description,
    sections[] {
      _type,
      _key,

      _type == "authorBio" => {
        label,
        name,
        role,
        bio,
        "imageUrl": image.asset.asset->url,
        "imageAlt": image.alt,
        initials,
        credentials[] {
          icon,
          label,
          title,
          description
        }
      },

      _type == "philosophyBlock" => {
        quote,
        body
      },

      _type == "pageCta" => {
        label,
        heading,
        subtext,
        cta
      },

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
      }
    }
  }
`

export const contactQuery = `
  *[_id == "contact"][0] {
    title,
    description,
    label,
    heading,
    subheading,
    email
  }
`

export const articlesPageQuery = `
  *[_id == "articlesPage"][0] {
    title,
    description,
    sections[] {
      _type,
      _key,

      _type == "hero" => {
        label,
        title,
        quote,
        quoteAuthor,
        "imageUrl": image.asset.asset->url,
        "imageAlt": image.alt,
        cta
      },

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
      }
    }
  }
`

export const booksPageQuery = `
  *[_id == "booksPage"][0] {
    title,
    description,
    sections[] {
      _type,
      _key,

      _type == "hero" => {
        label,
        title,
        quote,
        quoteAuthor,
        "imageUrl": image.asset.asset->url,
        "imageAlt": image.alt,
        cta
      },

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

export const allBooksQuery = `
  *[_type == "books"] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    subtitle,
    author,
    coverLabel,
    "coverImageUrl": coverImage.asset.asset->url,
    "coverImageAlt": coverImage.alt,
    excerpt,
    publishedYear
  }
`

export const bookBySlugQuery = `
  *[_type == "books" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    subtitle,
    author,
    coverLabel,
    "coverImageUrl": coverImage.asset.asset->url,
    "coverImageAlt": coverImage.alt,
    excerpt,
    description,
    publishedYear,
    cta
  }
`

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

export const articleBySlugQuery = `
  *[_type == "articles" && slug.current == $slug][0] {
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
    "gradientTo": topic->gradientTo,
    layoutType,
    body,
    "author": author-> {
      name,
      role,
      bio,
      "imageUrl": image.asset.asset->url,
      initials
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
