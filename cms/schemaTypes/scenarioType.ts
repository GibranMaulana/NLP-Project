import { defineField, defineType } from 'sanity'
import { ScenarioUrlDisplay } from '../components/UrlDisplay'

export const scenario = defineType({
  name: 'scenario',
  title: 'Scenario',
  type: 'document',
  initialValue: async (_params, { getClient }) => {
    try {
      const client = getClient({ apiVersion: '2024-01-01' })
      const diagnoses = await client.fetch<Array<{ _id: string }>>(
        `*[_type == "diagnosis" && !(_id in path("drafts.**"))]{ _id }`
      )
      if (diagnoses && diagnoses.length > 0) {
        return { 
          diagnoses: diagnoses.map((d) => ({
            _type: 'reference',
            _ref: d._id,
            _key: d._id.replace(/^drafts\./, ''),
          })),
        }
      }
    } catch (e) {
      console.error('Failed to fetch initial diagnoses:', e)
    }
    return {}
  },
  fields: [
    defineField({
      name: 'batch',
      title: 'Batch',
      description: 'De batch waartoe dit scenario behoort',
      type: 'reference',
      to: [{ type: 'batch' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fullUrl',
      title: 'Deelbare URL',
      description: 'Stuur deze link naar deelnemers',
      type: 'string',
      components: {
        input: ScenarioUrlDisplay,
      },
    }),
    defineField({
      name: 'prologue',
      title: 'Proloog',
      description: 'Inleidend verhaal of context voor dit scenario',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'mainQuest',
      title: 'Hoofddoel / Main Quest (Objektif Utama Pemain)',
      description: 'Misi atau target utama yang harus dicapai pemain dalam percakapan ini berdasarkan latar belakang cerita di Proloog. Ditampilkan sebagai panduan misi sebelum dan saat simulasi berlangsung.',
      type: 'text',
      rows: 3,
      placeholder: 'Contoh: Redam kemarahan Rina dan arahkan percakapan agar menyetujui penundaan tenggat waktu tanpa eskalasi emosi.',
      validation: (rule) => rule.max(400).required(),
    }),
    defineField({
      name: 'initialTension',
      title: 'Tensi Awal (Starting Tension)',
      description: 'Tensi awal karakter saat percakapan dimulai (0 = Tenang, 1 = Mulai Tegang, 2 = Sangat Panas). Rekomendasi: 1.',
      type: 'number',
      initialValue: 1,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'maxTension',
      title: 'Maximale Spanning (Max Tension)',
      description: 'Batas toleransi ketegangan sebelum karakter memutus percakapan (Game Over). Rekomendasi: 3.',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'stages',
      title: 'Fasen',
      description: 'De lineaire voortgang van het gesprek',
      type: 'array',
      of: [{ type: 'stage' }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'diagnoses',
      title: 'Diagnoses / Eindschermen',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'diagnosis' }]
      }],
      validation: (rule) =>
        rule.required().min(1).max(7).custom((diagnoses: any[] | undefined) => {
          if (!diagnoses || diagnoses.length === 0) return true
          const refs = diagnoses.map((d: any) => d._ref).filter(Boolean)
          const uniqueRefs = new Set(refs)
          if (uniqueRefs.size !== diagnoses.length) {
            return 'Geen dubbele diagnose-referenties toegestaan.'
          }
          return true
        }),
    }),
  ],
})