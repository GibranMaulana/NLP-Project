import { defineField, defineType } from "sanity";

export const diagnosis = defineType({
  name: "diagnosis",
  title: "Diagnosis",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal Title (For CMS only)",
      description: "e.g., 'Terjebak Empati - Level 1'",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Punchy Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "valueType",
      title: "Value Type / Pattern",
      description: "Which pattern does this diagnosis apply to?",
      type: "reference",
      to: [{ type: "valueType" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "harshTruth",
      title: "The Harsh Truth",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
});
