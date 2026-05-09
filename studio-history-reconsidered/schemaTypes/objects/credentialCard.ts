import { defineType, defineField } from 'sanity'

export const credentialCard = defineType({
    name: 'credentialCard',
    title: 'Credential Card',
    type: 'object',
    fields: [
        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string',
            options: {
                list: [
                    { title: 'Star', value: 'star' },
                    { title: 'Graduation Cap', value: 'graduation-cap' },
                    { title: 'Book', value: 'book-open' },
                    { title: 'Shield', value: 'shield' },
                    { title: 'Medal', value: 'medal' },
                    { title: 'Pen', value: 'pen' },
                ],
                layout: 'radio',
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'label',
            title: 'Label',
            description: 'Small uppercase label e.g. "Military Service"',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'label' },
        prepare({ title, subtitle }) {
            return { title, subtitle }
        },
    },
})
