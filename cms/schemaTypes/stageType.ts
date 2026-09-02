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
      description: 'Apakah fase ini bertujuan meredam emosi (Pacing) atau membedah logika (Leading)?',
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
      description: "Pilihan respons pemain (maksimal 3 per fase).",
      type: "array",
      of: [{ type: "reply" }],
      validation: (rule) =>
        rule.max(3).custom((replies: any) => {
          if (!replies || replies.length === 0) return true
          if (replies.length > 3) {
            return 'U mag maximaal 3 reacties opgeven per fase.'
          }
          const categories = replies.map((r: any) => r.valueType?._ref).filter(Boolean)
          const uniqueCategories = new Set(categories)
          if (uniqueCategories.size !== categories.length) {
            return 'Elke reactie moet een unieke Categorie / Patroontype hebben (geen duplicaten).'
          }
          return true
        }),
    }),
  ],
});
