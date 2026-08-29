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
    defineField({
      name: "reflection",
      title: "Triggered Reflection",
      description: "Specific reflection triggered when choosing this reply (for branching outcomes)",
      type: "reference",
      to: [{ type: "reflection" }],
    }),
    defineField({
      name: "patternType",
      title: "Pattern Type (Assessment Score)",
      description: "Which type does choosing this reply count towards?",
      type: "string",
      options: {
        list: [
          { title: "Distortion", value: "distortion" },
          { title: "Generalization", value: "generalization" },
          { title: "Deletion", value: "deletion" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
