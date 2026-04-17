import {defineType, defineField} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

export const sections = defineType({
  name: 'sections',
  title: 'Sections',
  type: 'document',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Sections',
      description: 'Dev tool — test sections here before adding to pages',
      type: 'array',
      of: [
        {type: 'heroSection'},
        {type: 'featuredArticleSection'},
        {type: 'articlesGridSection'},
        {type: 'aboutPreviewSection'},
        {type: 'bookPreviewSection'},
      ],
    }),
  ],
})
