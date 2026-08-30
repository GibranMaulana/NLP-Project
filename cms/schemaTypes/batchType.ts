import {defineField, defineType} from 'sanity'
import {BatchUrlDisplay} from '../components/UrlDisplay'

export const batch = defineType({
  name: 'batch',
  title: 'Batch',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      description: 'bijv. Batch 1',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: () => Math.random().toString(36).slice(2, 10),
        slugify: (source) => source,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fullUrl',
      title: 'Deelbare URL',
      description: 'Stuur deze link naar deelnemers',
      type: 'string',
      components: {
        input: BatchUrlDisplay,
      },
    }),
  ],
})