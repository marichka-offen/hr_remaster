import { defineType, defineField } from 'sanity'

export const bookPromo = defineType({
    name: 'bookPromo',
    title: 'Book Promotion',
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
            name: 'cta',
            title: 'Call to Action',
            type: 'cta',
        }),
    ],
    preview: {
        select: { title: 'title' },
        prepare({ title }) {
            return { title: title || 'Book Promotion', subtitle: 'Book' }
        },
    },
})
