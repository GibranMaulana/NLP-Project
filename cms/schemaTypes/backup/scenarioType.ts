import {defineField, defineType} from 'sanity'

export const scenario = defineType({
  name: 'scenario',
  title: 'Scenario',
  type: 'document',
  fields: [
    defineField({
      name: 'batch',
      title: 'Batch',
      description: 'The batch this scenario belongs to',
      type: 'reference',
      to: [{type: 'batch'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'prologue',
      title: 'Prologue',
      description: 'Introductory story or context for this scenario',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'stages',
      title: 'Stages (Babak)',
      description: 'The linear progression of the conversation',
      type: 'array',
      of: [{type: 'stage'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'diagnoses',
      title: 'Diagnoses / End Screens',
      description: 'The possible outcomes for this scenario. Add all relevant diagnosis documents here.',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'diagnosis'}]
      }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
})