import { defineField, defineType } from "sanity";

export const business = defineType({
  name: "business",
  title: "Business",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Bussiness Title",
      type: "string",
    }),
    defineField({
      name: "businessLink",
      title: "Link Business",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https", "ftp", "mailto", "tel"] }).required()
    }),
  ],
});