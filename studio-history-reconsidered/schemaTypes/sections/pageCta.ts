import { defineType, defineField } from 'sanity'

export const pageCta = defineType({
    name: 'pageCta',
    title: 'Page CTA',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            description: 'Small eyebrow text e.g. "Start Reading"',
            type: 'string',
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'subtext',
            title: 'Subtext',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'cta',
            title: 'Call to Action',
            type: 'cta',
        }),
    ],
    preview: {
        select: { title: 'heading', subtitle: 'label' },
        prepare({ title, subtitle }) {
            return { title: title || 'Page CTA', subtitle: subtitle || 'CTA section' }
        },
    },
})
