import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {CogIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'

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
            ...S.documentTypeListItems().filter(
              (item) => !['siteSettings'].includes(item.getId()!),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
