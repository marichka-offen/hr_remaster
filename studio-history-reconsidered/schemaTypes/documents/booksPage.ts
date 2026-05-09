import { defineType, defineField } from 'sanity'
import { StackIcon } from '@sanity/icons'

export const booksPage = defineType({
    name: 'booksPage',
    title: 'Books Page',
    type: 'document',
    icon: StackIcon,
    __experimental_actions: ['update', 'publish'],
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title (SEO)',
            type: 'string',
            initialValue: 'Books',
        }),
        defineField({
            name: 'description',
            title: 'Meta Description (SEO)',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'sections',
            title: 'Sections',
            type: 'array',
            of: [
                { type: 'hero' },
                { type: 'bookPromo' },
            ],
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Books Page' }
        },
    },
})
