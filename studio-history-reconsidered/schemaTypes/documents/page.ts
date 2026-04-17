import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const page = defineType({
  name: 'pages',
  title: 'Pages',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title (SEO)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 2,
    }),
defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {type: 'hero'},
        {type: 'bioHero'},
        {type: 'featured'},
        {type: 'articleGrid'},
        {type: 'authorCard'},
        {type: 'bookPromo'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {title, subtitle: `/${slug ?? ''}`}
    },
  },
})
