import {defineField, defineType} from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'isPrivate',
      title: 'Private Landing Page',
      description: 'If turned on, the landing page will not display batches to the public.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
