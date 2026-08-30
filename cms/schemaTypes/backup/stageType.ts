import { defineField, defineType } from "sanity";

export const stage = defineType({
  name: "stage",
  title: "Stage",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Stage Title",
      type: "string",
      description: "e.g., 'Babak 1: Jebakan Generalisasi'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "speaker",
      title: "Speaker / NPC Name",
      type: "string",
      description: "e.g., 'Rina - VP Sales'",
    }),
    defineField({
      name: "botPrompt",
      title: "Bot Prompt",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "replies",
      title: "Replies",
      type: "array",
      of: [{ type: "reply" }],
      validation: (rule) =>
        rule.custom((replies: any) => {
          if (!replies || replies.length !== 3) {
            return 'You must provide exactly 3 replies.'
          }
          const categories = replies.map((r: any) => r.valueType?._ref).filter(Boolean)
          const uniqueCategories = new Set(categories)
          if (uniqueCategories.size !== 3) {
            return 'Each reply must have a unique Category / Pattern Type (no duplicates).'
          }
          return true
        }),
    }),
  ],
});
