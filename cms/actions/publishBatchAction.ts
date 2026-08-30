import {useState} from 'react'
import {useClient} from 'sanity'

export function publishBatchWithScenariosAction(props: any) {
  const [isPublishing, setIsPublishing] = useState(false)
  const client = useClient({apiVersion: '2024-01-01'})

  // Strip "drafts." prefix to get the canonical batch ID
  const batchId = props.id.replace(/^drafts\./, '')

  return {
    label: isPublishing ? 'Publiceren...' : 'Batch & Scenario\'s publiceren',
    disabled: isPublishing,
    tone: 'positive' as const,
    onHandle: async () => {
      setIsPublishing(true)
      try {
        // 1. Find all scenarios (published or draft) referencing this batch
        //    Reference can point to published OR draft batch ID
        const scenarios: {_id: string}[] = await client.fetch(
          `*[_type == "scenario" && (batch._ref == $batchId || batch._ref == $draftBatchId)]{_id}`,
          {batchId, draftBatchId: `drafts.${batchId}`},
        )

        const transaction = client.transaction()

        // 2. For each scenario, publish its draft if one exists
        for (const {_id} of scenarios) {
          const publishedId = _id.replace(/^drafts\./, '')
          const draftId = `drafts.${publishedId}`

          const draft = await client.getDocument(draftId)
          if (draft) {
            const {_id: _unused, ...rest} = draft
            transaction.createOrReplace({...rest, _id: publishedId})
            transaction.delete(draftId)
          }
        }

        // 3. Publish the batch itself
        const batchDraft = await client.getDocument(`drafts.${batchId}`)
        if (batchDraft) {
          const {_id: _unused, ...rest} = batchDraft
          transaction.createOrReplace({...rest, _id: batchId})
          transaction.delete(`drafts.${batchId}`)
        }

        await transaction.commit()
        props.onComplete()
      } catch (err) {
        console.error('Failed to publish batch and scenarios:', err)
        props.onComplete()
      } finally {
        setIsPublishing(false)
      }
    },
  }
}
