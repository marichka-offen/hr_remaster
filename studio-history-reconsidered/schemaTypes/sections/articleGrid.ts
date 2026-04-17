import { defineType, defineField } from 'sanity'

export const articleGrid = defineType({
    name: 'articleGrid',
    title: 'Articles Grid',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Section Label',
            description: 'Small text above heading (e.g. "Archive")',
            type: 'string',
        }),
        defineField({
            name: 'heading',
            title: 'Section Heading',
            description: 'e.g. "History Articles"',
            type: 'string',
        }),
        defineField({
            name: 'showCategoryFilter',
            title: 'Show Category Filter',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'articles',
            title: 'Articles',
            description: 'Select which articles to display. Leave empty to show all.',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'articles' }] }],
        }),
        defineField({
            name: 'cta',
            title: 'Call to Action',
            type: 'cta',
        }),
    ],
    preview: {
        select: { articleCount: 'articles' },
        prepare({ articleCount }) {
            const count = articleCount?.length ?? 0
            return {
                title: 'Articles Grid',
                subtitle: count > 0 ? `${count} selected` : 'All articles',
            }
        },
    },
})
