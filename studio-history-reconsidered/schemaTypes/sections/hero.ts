import { defineType, defineField } from 'sanity'

export const hero = defineType({
    name: 'hero',
    title: 'Page Banner',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            description: 'Small text above the title (e.g. "Est. 2010 · Military History Journal")',
            type: 'string',
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'quote',
            title: 'Quote',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'quoteAuthor',
            title: 'Quote Author',
            type: 'string',
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
            return { title: title || 'Page Banner', subtitle: 'Banner' }
        },
    },
})
