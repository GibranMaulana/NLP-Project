import { defineField, defineType } from "sanity";

export const diagnosis = defineType({
  name: "diagnosis",
  title: "Diagnose",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Interne titel (Alleen voor CMS)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Pakkende kop",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "conditionType",
      title: "Waardetoestand (Regeltype)",
      type: "string",
      options: {
        list: [
          { title: "Dominant", value: "dominant" },
          { title: "Gelijkstand 2 Waarden", value: "tie_2" },
          { title: "Alle drie gelijk", value: "tie_3" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "valueTypes",
      title: "Waardetypen / Patronen",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "valueType" }],
          options: {
            filter: ({ document, parentPath }: any) => {
              const valueTypesIndex = parentPath.findIndex((p: any) => p === "valueTypes");
              if (valueTypesIndex !== -1) {
                const currentKey = parentPath[valueTypesIndex + 1]?._key;
                const valueTypes = (document?.valueTypes as any[]) || [];
                const otherRefs = valueTypes
                  .filter((v: any) => v._key !== currentKey && v._ref)
                  .map((v: any) => v._ref);

                if (otherRefs.length > 0) {
                  return {
                    filter: "!(_id in $otherRefs)",
                    params: { otherRefs },
                  };
                }
              }
              return { filter: "" };
            },
          },
        },
      ],

      validation: (rule) =>
        rule.custom((valueTypes: any[] | undefined, context: any) => {
          const conditionType = (context.document as any)?.conditionType;
          if (!conditionType) {
            return "Kies eerst een Waardetoestand.";
          }
          if (!valueTypes || valueTypes.length === 0) {
            return "Selecteer ten minste 1 Waardetype / Patroon.";
          }

          const refs = valueTypes.map((v: any) => v._ref).filter(Boolean);
          const uniqueRefs = new Set(refs);
          if (uniqueRefs.size !== valueTypes.length) {
            return "Geen dubbele Waardetypen toegestaan.";
          }

          if (conditionType === "dominant") {
            if (valueTypes.length !== 1) {
              return "Voor 'Dominant' moet u precies 1 Waardetype selecteren.";
            }
          } else if (conditionType === "tie_2") {
            if (valueTypes.length !== 2) {
              return "Voor 'Gelijkstand 2 Waarden' moet u precies 2 Waardetypen selecteren.";
            }
          } else if (conditionType === "tie_3") {
            if (valueTypes.length !== 3) {
              return "Voor 'Alle drie gelijk' moet u precies 3 Waardetypen selecteren.";
            }
          }

          return true;
        }),
    }),
    defineField({
      name: "harshTruth",
      title: "De harde waarheid",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
});


