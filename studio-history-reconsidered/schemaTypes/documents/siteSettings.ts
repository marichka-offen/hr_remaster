import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'header',
      title: 'Header',
      type: 'object',
      fields: [
        defineField({
          name: 'logoTitle',
          title: 'Logo Title',
          type: 'string',
          initialValue: 'History Reconsidered',
        }),
        defineField({
          name: 'logoSubtitle',
          title: 'Logo Subtitle',
          type: 'string',
          initialValue: 'Military History & Research',
        }),
        defineField({
          name: 'navigation',
          title: 'Navigation',
          description: 'Drag to reorder',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'navItem',
              fields: [
                defineField({
                  name: 'page',
                  title: 'Page',
                  type: 'reference',
                  to: [{type: 'pages'}],
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'labelOverride',
                  title: 'Label Override',
                  description: 'Leave empty to use the page title',
                  type: 'string',
                }),
              ],
              preview: {
                select: {
                  pageTitle: 'page.title',
                  label: 'labelOverride',
                  slug: 'page.slug.current',
                },
                prepare({pageTitle, label, slug}) {
                  return {
                    title: label || pageTitle || 'Untitled',
                    subtitle: slug === 'home' ? '/' : `/${slug ?? ''}`,
                  }
                },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({
          name: 'description',
          title: 'Brand Description',
          type: 'text',
          rows: 3,
          initialValue:
            'Reconsidering significant historical decisions and actions with rigorous research and source-supported analysis.',
        }),
        defineField({
          name: 'topicsTitle',
          title: 'Topics Column Title',
          type: 'string',
          initialValue: 'Topics',
        }),
        defineField({
          name: 'topics',
          title: 'Topics',
          description: 'Links shown in the Topics column',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'topicLink',
              fields: [
                defineField({
                  name: 'topic',
                  title: 'Topic',
                  type: 'reference',
                  to: [{type: 'topics'}],
                }),
                defineField({
                  name: 'label',
                  title: 'Label',
                  description: 'Leave empty to use the topic name',
                  type: 'string',
                }),
              ],
              preview: {
                select: {
                  topicName: 'topic.name',
                  label: 'label',
                },
                prepare({topicName, label}) {
                  return {title: label || topicName || 'Untitled'}
                },
              },
            },
          ],
        }),
        defineField({
          name: 'copyright',
          title: 'Copyright',
          type: 'string',
          initialValue: '© 2010–2026 History Reconsidered, LLC',
        }),
        defineField({
          name: 'copyrightNote',
          title: 'Copyright Note',
          type: 'string',
          initialValue: 'All rights reserved',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
