import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const about = defineType({
    name: 'about',
    title: 'About',
    type: 'document',
    icon: UserIcon,
    __experimental_actions: ['update', 'publish'],
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title (SEO)',
            type: 'string',
            initialValue: 'About',
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
                { type: 'authorBio' },
                { type: 'philosophyBlock' },
                { type: 'pageCta' },
                { type: 'articleGrid' },
            ],
        }),
    ],
    preview: {
        prepare() {
            return { title: 'About' }
        },
    },
})
