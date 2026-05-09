import { defineType, defineField } from 'sanity'

export const authorBio = defineType({
    name: 'authorBio',
    title: 'Author Bio',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            description: 'Small eyebrow text e.g. "About the Author"',
            type: 'string',
        }),
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Role',
            description: 'e.g. "Retired U.S. Army Major · Military Historian · Reenactor"',
            type: 'string',
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
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
            name: 'credentials',
            title: 'Credential Cards',
            type: 'array',
            of: [{ type: 'credentialCard' }],
            validation: (rule) => rule.max(3),
        }),
    ],
    preview: {
        select: { title: 'name', subtitle: 'role', media: 'image' },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Author Bio',
                subtitle: subtitle || 'Author Bio section',
                media,
            }
        },
    },
})
