import { defineField, defineType } from "sanity";

export const reply = defineType({
  name: "reply",
  title: "Reply",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Reply Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "feedback",
      title: "Feedback / Explanation",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "nextInteraction",
      title: "Next Interaction",
      description: "The interaction node that this reply leads to",
      type: "reference",
      to: [{ type: "interaction" }],
    }),
  ],
});
