import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {publishBatchWithScenariosAction} from './actions/publishBatchAction'
import {attachAllDiagnosesAction} from './actions/attachDiagnosesAction'
import {branchEditorTool} from './plugins/branchEditor'

export default defineConfig({
  name: 'default',
  title: 'nlp-cms',

  projectId: 'v8udsf47',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Settings')
              .child(S.document().schemaType('settings').documentId('settings')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !['settings'].includes(listItem.getId() as string)
            ),
          ]),
    }),
    visionTool(),
    branchEditorTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'batch') {
        return [...prev, publishBatchWithScenariosAction]
      }
      if (context.schemaType === 'scenario') {
        return [...prev, attachAllDiagnosesAction]
      }
      return prev
    },
  },
})

