import { defineType, defineField } from 'sanity'

export const featured = defineType({
    name: 'featured',
    title: 'Featured Article',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Section Label',
            description: 'Small text above heading (e.g. "Featured")',
            type: 'string',
        }),
        defineField({
            name: 'heading',
            title: 'Section Heading',
            description: 'e.g. "Latest Research"',
            type: 'string',
        }),
        defineField({
            name: 'article',
            title: 'Featured Article',
            type: 'reference',
            to: [{ type: 'articles' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: { articleTitle: 'article.title' },
        prepare({ articleTitle }) {
            return {
                title: 'Featured Article',
                subtitle: articleTitle || 'No article selected',
            }
        },
    },
})
