import {defineField, defineType} from 'sanity'

export const batch = defineType({
  name: 'batch',
  title: 'Batch',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. Batch 1',
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
  ],
})