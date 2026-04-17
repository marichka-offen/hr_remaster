import { defineType, defineField } from 'sanity'
import { ComposeIcon } from '@sanity/icons'

export const article = defineType({
    name: 'articles',
    title: 'Articles',
    type: 'document',
    icon: ComposeIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'period',
            title: 'Period',
            description: 'Short label shown on the card image (e.g. "1745", "NL", "SCT")',
            type: 'string',
        }),
        defineField({
            name: 'topic',
            title: 'Topic',
            type: 'reference',
            to: [{ type: 'topics' }],
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        }),
        defineField({
            name: 'image',
            title: 'Card Image',
            type: 'richImage',
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            description: 'Short summary shown on article cards',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'readTime',
            title: 'Read Time',
            description: 'e.g. "12 min read"',
            type: 'string',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
        },
    },
})
