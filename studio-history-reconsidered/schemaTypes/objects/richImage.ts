import {defineType, defineField} from 'sanity'

export const richImage = defineType({
  name: 'richImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: 'Image File',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      description: 'Describes the image for screen readers and SEO',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      description: 'Optional visible caption below the image',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      imageUrl: 'asset.asset.url',
      title: 'alt',
    },
    prepare({title}) {
      return {title: title || 'No alt text'}
    },
  },
})
