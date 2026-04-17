import {defineType, defineField} from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
