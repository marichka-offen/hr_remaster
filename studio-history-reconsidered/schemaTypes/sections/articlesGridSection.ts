import {defineType, defineField} from 'sanity'

export const articlesGridSection = defineType({
  name: 'articlesGridSection',
  title: 'Articles Grid Section',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Section Label',
      description: 'Small text above heading (e.g. "Archive")',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      description: 'e.g. "History Articles"',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Articles Grid', subtitle: 'All articles with category filter'}
    },
  },
})
