import {defineType, defineField} from 'sanity'

export const bookPreviewSection = defineType({
  name: 'bookPreviewSection',
  title: 'Book Preview Section',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Section Label',
      description: 'e.g. "Upcoming Book"',
      type: 'string',
    }),
    defineField({
      name: 'coverLabel',
      title: 'Cover Label',
      description: 'Text on the book cover (e.g. "Forthcoming")',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Book Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Book Subtitle',
      description: 'Shown on the cover below the title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      description: 'e.g. "Learn More"',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Book Preview', subtitle: 'Book'}
    },
  },
})
