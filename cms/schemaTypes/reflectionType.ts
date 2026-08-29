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
    defineField({
      name: "resultType",
      title: "Resulting Pattern Type",
      description: "Which type outcome does this reflection page belong to?",
      type: "string",
      options: {
        list: [
          { title: "Distortion Type (Tipe Distorsi)", value: "distortion" },
          { title: "Generalization Type (Tipe Generalisasi)", value: "generalization" },
          { title: "Deletion Type (Tipe Delesi)", value: "deletion" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
