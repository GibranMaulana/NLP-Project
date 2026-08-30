import { defineField, defineType } from "sanity";

export const business = defineType({
  name: "business",
  title: "Bedrijf",
  type: "document",
  fields: [
    defineField({
      name: "titel",
      title: "Bedrijfsnaam",
      type: "string",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "businessLink",
      title: "Bedrijfslink",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https", "ftp", "mailto", "tel"] }).required()
    }),
  ],
});