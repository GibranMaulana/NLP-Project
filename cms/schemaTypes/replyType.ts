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
      name: "nextStage",
      title: "Volgende Fase / Sambungan (Next Stage Key)",
      type: "string",
      fieldset: "mechanic",
      description: "Key babak atau node refleksi yang dituju oleh pilihan jawaban ini. Terhubung otomatis saat menarik garis panah di Branch Editor.",
    }),
    defineField({
      name: "valueType",
      title: "Categorie / Patroontype (Meta Model)",
      type: "reference",
      fieldset: 'main',
      to: [{ type: "valueType" }],
      validation: (rule) => rule.required(),
    }),

    // --- FIELD BARU 1: EFEK TENSI ---
    defineField({
      name: "tensionEffect",
      title: "Tension Effect (Perubahan Ketegangan)",
      description: "Pilih dampak jawaban ini: -2, -1, 0, +1, +2.",
      type: "number",
      fieldset: 'mechanic',
      options: {
        list: [
          { title: "-2 (Sangat Menenangkan)", value: -2 },
          { title: "-1 (Menenangkan)", value: -1 },
          { title: "0 (Netral)", value: 0 },
          { title: "+1 (Memicu Emosi)", value: 1 },
          { title: "+2 (Sangat Memicu Emosi)", value: 2 },
        ],
      },
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
