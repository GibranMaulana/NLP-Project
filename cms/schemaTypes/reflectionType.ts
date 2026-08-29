import { defineField, defineType } from "sanity";

export const reflection = defineType({
  name: "reflection",
  title: "Reflection",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title / Topic",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "question",
      title: "Reflection Question",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guide",
      title: "Guiding Feedback / Key Takeaway",
      type: "text",
      rows: 4,
    }),
  ],
});
