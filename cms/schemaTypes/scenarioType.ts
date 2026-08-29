import { defineField, defineType } from "sanity";

export const scenario = defineType({
  name: "scenario",
  title: "Scenario",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "prologue",
      title: "Prologue",
      description: "Introductory story or context for this scenario",
      type: "reference",
      to: [{ type: "prologue" }],
    }),
    defineField({
      name: "startInteraction",
      title: "Starting Interaction",
      description: "The first interaction node when playing this scenario",
      type: "reference",
      to: [{ type: "interaction" }],
    }),
    defineField({
      name: "interactions",
      title: "Interactions",
      description: "All interaction nodes belonging to this scenario",
      type: "array",
      of: [{ type: "reference", to: [{ type: "interaction" }] }],
    }),
    defineField({
      name: "reflections",
      title: "Reflections",
      description: "Reflection after completing the scenario",
      type: "array",
      of: [{ type: "reference", to: [{ type: "reflection" }] }],
    }),
  ],
});