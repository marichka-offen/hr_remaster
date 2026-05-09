import { defineType, defineField } from 'sanity'

export const philosophyBlock = defineType({
    name: 'philosophyBlock',
    title: 'Philosophy',
    type: 'object',
    fields: [
        defineField({
            name: 'quote',
            title: 'Quote',
            description: 'Large italic statement displayed prominently',
            type: 'text',
            rows: 3,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'body',
            title: 'Body Text',
            description: 'Supporting paragraphs below the quote',
            type: 'array',
            of: [{ type: 'block' }],
        }),
    ],
    preview: {
        select: { title: 'quote' },
        prepare({ title }) {
            return { title: title ? `"${title.slice(0, 60)}…"` : 'Philosophy', subtitle: 'Philosophy section' }
        },
    },
})
