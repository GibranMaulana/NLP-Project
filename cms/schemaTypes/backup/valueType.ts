import { defineField, defineType } from "sanity";

export const valueType = defineType({
  name: "valueType",
  title: "Value Type / Pattern",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g. 'Meta Challenge (Tepat)'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value / ID",
      type: "string",
      description: "e.g. 'meta_challenge'",
      validation: (rule) => rule.required(),
    }),
  ],
});
