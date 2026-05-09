import { defineType, defineField } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const book = defineType({
    name: 'books',
    title: 'Books',
    type: 'document',
    icon: BookIcon,
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
            name: 'author',
            title: 'Author',
            type: 'string',
        }),
        defineField({
            name: 'coverLabel',
            title: 'Cover Label',
            description: 'Text badge on the cover (e.g. "Forthcoming", "Available Now")',
            type: 'string',
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'richImage',
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            description: 'Short summary shown on the books listing page',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'Full description shown on the book detail page',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'publishedYear',
            title: 'Published Year',
            type: 'string',
        }),
        defineField({
            name: 'cta',
            title: 'Call to Action',
            description: 'e.g. "Pre-order", "Buy Now"',
            type: 'cta',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'subtitle',
            media: 'coverImage',
        },
        prepare({ title, subtitle, media }) {
            return { title, subtitle, media }
        },
    },
})
