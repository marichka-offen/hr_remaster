import {defineType, defineField} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const topic = defineType({
  name: 'topics',
  title: 'Topics',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'gradientFrom',
      title: 'Card Gradient — Start Color',
      type: 'string',
      description: 'Hex color for the left side of the card gradient (e.g. #4a3828)',
      validation: (rule) => rule.regex(/^#[0-9a-fA-F]{6}$/).error('Must be a hex color like #4a3828'),
    }),
    defineField({
      name: 'gradientTo',
      title: 'Card Gradient — End Color',
      type: 'string',
      description: 'Hex color for the right side of the card gradient (e.g. #6b4c30)',
      validation: (rule) => rule.regex(/^#[0-9a-fA-F]{6}$/).error('Must be a hex color like #6b4c30'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
})
