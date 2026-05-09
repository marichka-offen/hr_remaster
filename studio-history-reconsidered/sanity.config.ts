import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { CogIcon, HomeIcon, UserIcon, EnvelopeIcon, BookIcon, ComposeIcon, TagIcon, DocumentsIcon, StackIcon } from '@sanity/icons'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
    name: 'default',
    title: 'History reconsidered',

    projectId: '4mqy66ba',
    dataset: 'production',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.listItem()
                            .title('Site Settings')
                            .icon(CogIcon)
                            .child(
                                S.document()
                                    .schemaType('siteSettings')
                                    .documentId('siteSettings'),
                            ),

                        S.divider(),

                        S.listItem()
                            .title('Home Page')
                            .icon(HomeIcon)
                            .child(
                                S.document()
                                    .schemaType('home')
                                    .documentId('home'),
                            ),
                        S.listItem()
                            .title('Articles Page')
                            .icon(DocumentsIcon)
                            .child(
                                S.document()
                                    .schemaType('articlesPage')
                                    .documentId('articlesPage'),
                            ),
                        S.listItem()
                            .title('Books Page')
                            .icon(StackIcon)
                            .child(
                                S.document()
                                    .schemaType('booksPage')
                                    .documentId('booksPage'),
                            ),
                        S.listItem()
                            .title('About Page')
                            .icon(UserIcon)
                            .child(
                                S.document()
                                    .schemaType('about')
                                    .documentId('about'),
                            ),
                        S.listItem()
                            .title('Contact Page')
                            .icon(EnvelopeIcon)
                            .child(
                                S.document()
                                    .schemaType('contact')
                                    .documentId('contact'),
                            ),

                        S.divider(),

                        S.listItem()
                            .title('Articles')
                            .icon(ComposeIcon)
                            .child(S.documentTypeList('articles')),
                        S.listItem()
                            .title('Books')
                            .icon(BookIcon)
                            .child(S.documentTypeList('books')),
                        S.listItem()
                            .title('Topics')
                            .icon(TagIcon)
                            .child(S.documentTypeList('topics')),
                    ]),
        }),
        visionTool(),
    ],

    schema: {
        types: schemaTypes,
    },
})
