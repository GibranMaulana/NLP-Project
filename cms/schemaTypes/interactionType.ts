import { defineField, defineType } from "sanity";

export const interaction = defineType({
  name: "interaction",
  title: "Interaction",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Interaction Title / Node ID",
      type: "string",
      description: "e.g., 'Step 1: First Meeting' or 'interaction_01'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "speaker",
      title: "Speaker / NPC Name",
      type: "string",
    }),
    defineField({
      name: "prompt",
      title: "Prompt / Dialogue",
      type: "text",
      rows: 4,
      description: "The dialogue or situation presented to the user",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "replies",
      title: "Replies / Choices",
      description: "Options provided to the user for this interaction",
      type: "array",
      of: [{ type: "reply" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
