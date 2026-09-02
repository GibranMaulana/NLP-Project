import { defineField, defineType } from "sanity";

export const stage = defineType({
  name: "stage",
  title: "Fase",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Fasetitel",
      type: "string",
      description: "bijv., 'Fase 1: Jebakan Generalisasi'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "x",
      title: "X Coordinate",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "y",
      title: "Y Coordinate",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "speaker",
      title: "Spreker / NPC-naam",
      type: "string",
      description: "bijv., 'Rina - VP Sales'",
    }),
    defineField({
      name: 'phaseType',
      title: 'Fase Type',
      description: 'Apakah fase ini bertujuan meredam emosi atau membedah logika?',
      type: 'string',
      options: {
        list: [
          { title: 'Pacing', value: 'Pacing' },
          { title: 'Leading', value: 'Leading' },
        ],
      },
      initialValue: 'Pacing',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "botPrompt",
      title: "Bot-prompt",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "replies",
      title: "Reacties",
      type: "array",
      of: [{ type: "reply" }],
      validation: (rule) =>
        rule.custom((replies: any) => {
          if (!replies || replies.length !== 3) {
            return 'U moet precies 3 reacties opgeven.'
          }
          const categories = replies.map((r: any) => r.valueType?._ref).filter(Boolean)
          const uniqueCategories = new Set(categories)
          if (uniqueCategories.size !== 3) {
            return 'Elke reactie moet een unieke Categorie / Patroontype hebben (geen duplicaten).'
          }
          return true
        }),
    }),
  ],
});
