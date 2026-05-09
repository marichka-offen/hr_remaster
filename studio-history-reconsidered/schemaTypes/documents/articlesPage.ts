import { defineType, defineField } from 'sanity'
import { ComposeIcon } from '@sanity/icons'

export const articlesPage = defineType({
    name: 'articlesPage',
    title: 'Articles Page',
    type: 'document',
    icon: ComposeIcon,
    __experimental_actions: ['update', 'publish'],
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title (SEO)',
            type: 'string',
            initialValue: 'Articles',
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
                { type: 'articleGrid' },
            ],
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Articles Page' }
        },
    },
})
