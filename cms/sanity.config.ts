import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {publishBatchWithScenariosAction} from './actions/publishBatchAction'

export default defineConfig({
  name: 'default',
  title: 'nlp-cms',

  projectId: 'v8udsf47',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'batch') {
        // Add our custom action alongside the default actions
        return [...prev, publishBatchWithScenariosAction]
      }
      return prev
    },
  },
})
