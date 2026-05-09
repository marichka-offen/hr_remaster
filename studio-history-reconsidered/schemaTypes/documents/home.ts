import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const home = defineType({
    name: 'home',
    title: 'Home',
    type: 'document',
    icon: HomeIcon,
    __experimental_actions: ['update', 'publish'],
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title (SEO)',
            type: 'string',
            initialValue: 'History Reconsidered',
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
                { type: 'featured' },
                { type: 'articleGrid' },
                { type: 'authorCard' },
                { type: 'bookPromo' },
            ],
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Home' }
        },
    },
})
