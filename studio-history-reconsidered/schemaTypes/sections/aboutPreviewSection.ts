import {defineType, defineField} from 'sanity'

export const aboutPreviewSection = defineType({
  name: 'aboutPreviewSection',
  title: 'About Preview Section',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      description: 'e.g. "Military Historian & Retired Soldier"',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      description: 'Short bio paragraphs for the preview',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'initials',
      title: 'Initials',
      description: 'Shown as placeholder in the portrait area (e.g. "LO")',
      type: 'string',
    }),
    defineField({
      name: 'linkText',
      title: 'Link Text',
      description: 'e.g. "Read Full Bio"',
      type: 'string',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'name'},
    prepare({title}) {
      return {title: title || 'About Preview', subtitle: 'About'}
    },
  },
})
