import {definePlugin} from 'sanity'
import {BranchEditorTool} from './BranchEditorTool'

export const branchEditorTool = definePlugin({
  name: 'branch-editor',
  tools: (prev) => {
    return [
      ...prev,
      {
        name: 'branch-editor',
        title: 'Branch Editor',
        component: BranchEditorTool,
      },
    ]
  },
})
