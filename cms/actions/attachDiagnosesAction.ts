import { useState } from 'react'
import { useClient } from 'sanity'

export function attachAllDiagnosesAction(props: any) {
  const [isAttaching, setIsAttaching] = useState(false)
  const client = useClient({ apiVersion: '2024-01-01' })

  return {
    label: isAttaching ? 'Koppelen...' : 'Alle Diagnoses Koppelen',
    disabled: isAttaching,
    tone: 'positive' as const,
    onHandle: async () => {
      setIsAttaching(true)
      try {
        // Fetch all non-draft diagnosis documents
        const diagnoses: { _id: string }[] = await client.fetch(
          `*[_type == "diagnosis" && !(_id in path("drafts.**"))]{ _id }`
        )

        if (!diagnoses || diagnoses.length === 0) {
          alert('Geen diagnose-documenten gevonden in Sanity CMS. Maak eerst diagnose-documenten aan.')
          return
        }

        const diagnosisRefs = diagnoses.map((d) => ({
          _type: 'reference',
          _ref: d._id,
          _key: d._id.replace(/^drafts\./, ''),
        }))

        // Patch current scenario document with all diagnosis references
        await client.patch(props.id).set({ diagnoses: diagnosisRefs }).commit()

        props.onComplete()
      } catch (err) {
        console.error('Failed to attach diagnoses to scenario:', err)
        props.onComplete()
      } finally {
        setIsAttaching(false)
      }
    },
  }
}
