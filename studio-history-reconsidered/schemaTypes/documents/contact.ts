import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export const contact = defineType({
    name: 'contact',
    title: 'Contact',
    type: 'document',
    icon: EnvelopeIcon,
    __experimental_actions: ['update', 'publish'],
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title (SEO)',
            type: 'string',
            initialValue: 'Contact',
        }),
        defineField({
            name: 'description',
            title: 'Meta Description (SEO)',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Get in Touch',
        }),
        defineField({
            name: 'subheading',
            title: 'Subheading',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'email',
            title: 'Email Address',
            type: 'string',
        }),
        defineField({
            name: 'label',
            title: 'Section Label',
            description: 'Small eyebrow text above the heading (e.g. "Contact")',
            type: 'string',
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Contact' }
        },
    },
})
