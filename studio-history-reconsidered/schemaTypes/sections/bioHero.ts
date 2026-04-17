import { defineType, defineField } from 'sanity'

export const bioHero = defineType({
    name: 'bioHero',
    title: 'Bio Banner',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            description: 'Small text above the title (e.g. "About Author")',
            type: 'string',
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
            description: 'Subtle text under the the title (e.g. "Retired U.S. Army Major · Military Historian · Reenactor")'
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            description: 'Short bio paragraphs for the preview',
            type: 'array',
            of: [{ type: 'block' }],
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
            return { title: title || 'Bio Banner', subtitle: 'Banner' }
        },
    },
})
