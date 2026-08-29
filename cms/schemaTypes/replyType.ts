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
      name: "valueType",
      title: "Category / Pattern Type",
      type: "reference",
      to: [{ type: "valueType" }],
      options: {
        filter: ({ document, parentPath }: any) => {
          const stagesIndex = parentPath.findIndex((p: any) => p === 'stages')
          const repliesIndex = parentPath.findIndex((p: any) => p === 'replies')
          
          if (stagesIndex !== -1 && repliesIndex !== -1) {
            const stageKey = parentPath[stagesIndex + 1]?._key
            const replyKey = parentPath[repliesIndex + 1]?._key
            
            const stages = (document?.stages as any[]) || []
            const stage = stages.find((s: any) => s._key === stageKey)
            
            if (stage && stage.replies) {
              const otherRefs = stage.replies
                .filter((r: any) => r._key !== replyKey && r.valueType?._ref)
                .map((r: any) => r.valueType._ref)
                
              if (otherRefs.length > 0) {
                return {
                  filter: '!(_id in $otherRefs)',
                  params: { otherRefs }
                }
              }
            }
          }
          return { filter: '' }
        }
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
