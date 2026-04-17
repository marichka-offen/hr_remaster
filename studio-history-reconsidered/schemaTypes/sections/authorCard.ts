import { defineType, defineField } from 'sanity'

export const authorCard = defineType({
    name: 'authorCard',
    title: 'Author Preview',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role',
            description: 'e.g. "Military Historian & Retired Soldier"',
            type: 'string',
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            description: 'Short bio paragraphs for the preview',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'image',
            title: 'Portrait Image',
            type: 'richImage',
        }),
        defineField({
            name: 'initials',
            title: 'Initials',
            description: 'Fallback when no image is provided (e.g. "LGO")',
            type: 'string',
        }),
        defineField({
            name: 'cta',
            title: 'Call to Action',
            type: 'cta',
        }),
    ],
    preview: {
        select: { title: 'name' },
        prepare({ title }) {
            return { title: title || 'Author Preview', subtitle: 'Author' }
        },
    },
})
