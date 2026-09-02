import { defineField, defineType } from "sanity";

export const reply = defineType({
  name: "reply",
  title: "Reactie",
  type: "object",
  fieldsets: [
    { name: 'main', title: '1. Teks Pilihan Jawaban' },
    { name: 'mechanic', title: '2. Efek Mekanik Game' },
    { name: 'insight', title: '3. Refleksi & Pembelajaran' },
  ],
  fields: [
    defineField({
      name: "text",
      title: "Reactietekst (Kalimat Pilihan User)",
      type: "string",
      fieldset: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "valueType",
      title: "Categorie / Patroontype (Meta Model)",
      type: "reference",
      fieldset: 'main',
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

    // --- FIELD BARU 1: EFEK TENSI ---
    defineField({
      name: "tensionEffect",
      title: "Tension Effect (Perubahan Ketegangan)",
      description: "Pilih dampak jawaban ini: -1 (Menenangkan), 0 (Netral), +1 (Memicu emosi / salah taktik).",
      type: "number",
      fieldset: 'mechanic',
      initialValue: 0,
      validation: (rule) => rule.required(),
    }),

    // --- FIELD BARU 2: SYSTEM FEEDBACK ---
    defineField({
      name: "systemFeedback",
      title: "System Feedback (Pesan Refleksi Singkat)",
      description: "Pesan insight yang muncul di layar pemain setelah memilih opsi ini (contoh: 'Bagus! Kamu memvalidasi perasaannya tanpa menyalahkan.').",
      type: "text",
      rows: 2,
      fieldset: 'insight',
      validation: (rule) => rule.required(),
    }),

    // --- FIELD BARU 3: NPC REACTION ---
    defineField({
      name: "npcReaction",
      title: "NPC Reaction (Celetukan Spontan Karakter)",
      description: "Reaksi spontan NPC sesaat setelah user memilih jawaban ini sebelum masuk ke babak berikutnya (contoh: 'Hah?! Malah nuduh saya lagi?!').",
      type: "string",
      fieldset: 'mechanic',
    }),
  ],
});
