# Revisi Beleef NLP — Perubahan dari Brief Feedback

Dokumen ini menjelaskan masalah yang teridentifikasi dari brief feedback dan perbaikan yang sudah diimplementasikan ke dalam `fe-branching`.

---

## Masalah Teridentifikasi vs Perbaikan

### A. Kritis — Mekanik & Consequence

#### ❌ Masalah Sebelumnya
- **Zero branching**: `PlayChatBox.tsx` line 167 — `const nextIndex = currentStageIndex + 1`. Pilihan user tidak mengubah apa pun setelahnya. Semua path linear.
- **No consequence**: Reply dipilih, tapi stage berikutnya always sama. Tidak ada efek nyata dari pilihan.

#### ✅ Perbaikan (fe-branching)
- **Dynamic branching**: Reply sekarang punya `nextStage` field yang menunjuk ke stage spesifik berikutnya (bukan otomatis +1).
- **Consequence system**: Pilihan user mengubah trajectory percakapan. Branching points ditentukan oleh reply yang dipilih.
- **Implementation**: 
  - `PlayChatBox.tsx`: Handler `handleSelectReply` sekarang lookup next stage via `reply.nextStage` (keywsnya)
  - CMS schema (`replyType.ts`): Tiap reply punya field `nextStage` untuk branching target
  - Query (`queries.ts`): Fetch `nextStage` dari setiap reply

**Code snippet (branching logic)**:
```typescript
// Before: Linear only
const nextIndex = currentStageIndex + 1;

// After: Dynamic based on choice
let targetStageIndex = -1;
if (reply.nextStage) {
  targetStageIndex = stages.findIndex((s) => s._key === reply.nextStage);
}
const nextIndex = targetStageIndex !== -1 ? targetStageIndex : currentStageIndex + 1;
```

---

### B. Penting — Real-time Pattern Feedback

#### ❌ Masalah Sebelumnya
- **Pattern ditally invisible**: User pilih reply dengan pattern type, tapi tidak tahu sedang accumulate apa.
- **Feedback hanya di akhir**: Pattern counts hanya muncul di `DiagnosisResult.tsx` setelah chat selesai.
- **No live reaction**: Tidak ada visual yang menunjukkan user sedang membuat pola apa saat bermain.

#### ✅ Perbaikan (fe-branching)
- **Tension meter live**: Header menampilkan tension gauge real-time (0-3 scale dengan color gradient).
- **Pattern tracking visual**: Sistem bisa di-extend untuk menampilkan pattern distribution meter (disiapkan foundation).
- **System feedback**: Setiap reply bisa punya `systemFeedback` (aha moment) yang ditampilkan setelah user pilih — di-render sebagai "💡 Refleksi Reframing" message.
- **Implementation**:
  - `PlayChatBox.tsx`: Tension meter di header; system feedback queue di async step executor
  - Message type baru: `sender: "system"` dengan `feedbackType: "insight"` untuk visual distinction
  - CMS schema (`replyType.ts`): `systemFeedback` field untuk insight per reply

**Code snippet (system feedback render)**:
```typescript
// Step 1: System Feedback (Aha Moment)
if (reply.systemFeedback) {
  steps.push(() => {
    return new Promise((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        const insightMsg: Message = {
          sender: "system",
          speakerName: "System",
          text: reply.systemFeedback!,
          feedbackType: "insight",
        };
        setMessages((prev) => [...prev, insightMsg]);
        setTimeout(resolve, gapPause);
      }, bubbleDelay);
    });
  });
}
```

---

### C. Story Context — Prologue Stays Live

#### ❌ Masalah Sebelumnya
- **Prologue cutscene**: `ScenarioPrologue` ditampilkan, user tekan "Continue", masuk `PlayChatBox` — konteks stakes hilang.
- **No context integration**: Crisis/deadline dari prologue tidak pernah direferensi lagi saat chat berjalan.
- **Story disconnected**: Prologue jadi intro saja, bukan lapisan naratif yang menyertai gameplay.

#### ✅ Perbaikan (fe-branching)
- **Tension as proxy for stakes**: Tension meter (0-3) acting sebagai proxy untuk "crisis pressure". Semakin tinggi = semakin urgent.
- **Crisis context available**: `mainQuest` field dari scenario di-pass ke `PlayChatBox` dan displayed di quest goal banner.
- **Early termination on max tension**: Kalau tension reach max (threshold defined di CMS), conversation bisa terminated early dengan crisis ending (walkaround scenario).
- **Implementation**:
  - Types: `PlayScenario` punya `mainQuest`, `initialTension`, `maxTension`, `maxTensionDialogue`, `maxTensionTargetStage`
  - Queries: Fetch fields ini dari CMS
  - PlayChatBox: Display `mainQuest` di quest banner; tension meter color changes as stakes escalate

**Code snippet (crisis detection)**:
```typescript
// Tension threshold check
if (newTension >= maxTension) {
  // Picu crisis ending — bisa langsung ke diagnosis atau termination scene
  setIsCompleted(true);
  setIsEarlyTerminated(true);
  router.push(`/b/${batchId}/${scenario.slug}/diagnosis`);
}
```

---

### D. Personal Results — Tied to Actual Choices

#### ❌ Masalah Sebelumnya
- **Generic diagnosis**: `DiagnosisResult.tsx` matches pattern count ke archetype template, tapi tidak referensi choices yang dibuat user.
- **Result same for everyone**: Orang berbeda yang main scenario sama, but pick different choices, hasilnya bisa identical.
- **No personalization**: Hasil diagnosis generik per pattern type, tidak tied to journey yang diambil.

#### ✅ Perbaikan (fe-branching)
- **Choice history tracking**: `PlayChatBox` sekarang track `chosenReplies` — array of {stageTitle, replyText, patternTitle, systemFeedback, tensionEffect}.
- **Journey in results**: `DiagnosisResult` fetch choice history dari sessionStorage, display "Rekapitulasi Alur Keputusan" section dengan numbered journey.
- **Personalized outcome**: Diagnosis hasil masih match pattern count, tapi sekarang plus actual quotes dari pilihan user.
- **Implementation**:
  - PlayChatBox: `StoredChatState` punya `chosenReplies` array
  - DiagnosisResult: Display choice timeline sebelum upsell
  - Session storage: Persist `chosenReplies` untuk recovery session

**Code snippet (choice history)**:
```typescript
// Track choice
const choiceDetail: ChosenReplyDetail = {
  stageIndex: currentStageIndex,
  stageTitle: currentStage?.title,
  replyText: reply.text,
  patternTitle: patternTitle,
  systemFeedback: reply.systemFeedback,
  tensionEffect: reply.tensionEffect,
};
setChosenReplies((prev) => [...prev, choiceDetail]);

// Display in results
{chosenReplies.map((choice, idx) => (
  <div key={idx}>
    <span>{idx + 1}</span>
    <p>{choice.replyText}</p>
    <span>{choice.patternTitle}</span>
  </div>
))}
```

---

### E. Schema Extension — Multi-Topic Readiness

#### ❌ Masalah Sebelumnya
- **Only meta model**: ValueType hanya track Deletion/Distortion/Generalization. Chunking & open/closed language belum di-schema.
- **No topic categorization**: Tidak ada field untuk membedakan stage/reply mana yang fokus chunking vs meta model.
- **Scope incomplete**: Brief minta 3 topik, implementasi cuma 1.

#### ✅ Perbaikan (fe-branching)
- **Topic field added**: ValueType schema punya optional `topic` field (meta_model | chunking | language_openness).
- **Stage topic focus**: Stage punya optional `topicFocus` field untuk menandai fokus topik phase.
- **Schema extension**: CMS schema siap untuk expand ke 3 topik tanpa breaking existing.
- **Implementation** (foundation):
  - `valueType.ts`: Definisi field `topic` dengan dropdown list 3 opsi
  - `stageType.ts`: Definisi field `topicFocus` untuk categorize phase
  - `types.ts`: Update interface ValueType & Stage
  - `queries.ts`: Fetch `topic` & `topicFocus` dari CMS

**Note**: Saat ini hanya meta model yang ada data di CMS. Dua topik lain siap di-add ketika ada konten.

---

### F. Gameplay Flow — Async Queue System

#### ❌ Masalah Sebelumnya
- **Abrupt transitions**: User pilih, langsung next stage muncul. Tidak ada transisi untuk feedback/reflection.
- **No delay handling**: Semua messages instant atau hardcoded delay yang sama.
- **Skip pause user control**: Tidak ada way untuk user speed up atau skip delay.

#### ✅ Perbaikan (fe-branching)
- **Async step queue**: Setiap action (system feedback, NPC reaction, next prompt) adalah step dalam queue, dijalankan berurutan.
- **Configurable delays**: `bubbleDelay` (3 detik per message) dan `gapPause` dapat dikonfigur.
- **Skip delay toggle**: User bisa toggle "Fast Mode" untuk instant display (testing/replaying).
- **Implementation**:
  - `PlayChatBox`: `handleSelectReply` build array of promises (steps), execute async sequentially
  - State: `skipDelay` toggle di header
  - Timing: 900ms typing indicator + 3s delay per message (configurable via `bubbleDelay`)

**Code snippet (step queue)**:
```typescript
const steps: (() => Promise<void>)[] = [];

// Build steps
if (reply.systemFeedback) {
  steps.push(async () => { /* show insight */ });
}
if (reply.npcReaction) {
  steps.push(async () => { /* show reaction */ });
}
steps.push(async () => { /* show next stage */ });

// Execute sequentially
(async () => {
  for (const step of steps) {
    await step();
  }
})();
```

---

## Status Summary

| Aspek | Sebelumnya | Sekarang | Status |
|---|---|---|---|
| **Branching** | Linear (+1 only) | Dynamic (nextStage mapping) | ✅ Fixed |
| **Consequence** | No effect on story | Pilihan changes trajectory | ✅ Fixed |
| **Real-time feedback** | Invisible tally | Tension meter + system feedback | ✅ Partial (foundation ready) |
| **Story context** | Lost after prologue | Tension as proxy, quest banner | ✅ Improved |
| **Personalized results** | Generic template | Personal journey + choices | ✅ Fixed |
| **Multi-topic schema** | Meta model only | Schema ready for 3 topics | ✅ Ready (no data yet) |
| **Async flow** | Abrupt transitions | Sequenced steps + skip toggle | ✅ Fixed |
| **CMS integration** | Basic | Extended fields per brief | ✅ Aligned |

---

## Next Steps for Full Implementation

### Short-term (Data entry in CMS)
1. **Fill `systemFeedback`** for all replies in existing scenarios
2. **Set `nextStage`** values for branching paths (currently linear fallback)
3. **Test scenarios** with branching + feedback flow

### Medium-term (Content expansion)
1. **Add chunking & language scenarios** using extended schema
2. **Create multi-topic batch** for comprehensive training
3. **Document scenario design pattern** for future content

### Long-term (Features D)
1. Two-person mode (peer discussion)
2. Shareable summary (export choice journey + diagnosis)
3. Analytics dashboard (aggregate pattern trends)

---

## CMS Branching Editor — Visual Workflow

Sanity Studio punya **Branch Editor** tab untuk visualisasi branching story. Editor ini menampilkan semua stages sebagai nodes, dengan lines menunjukkan possible paths berdasarkan replies & tension.

### Akses Branch Editor

1. **Buka Sanity Studio**
   ```bash
   cd cms
   npm run dev
   # Akses http://localhost:3333
   ```

2. **Edit Scenario** → Tab "Branch Editor"
   - Contoh: "Krisis Deadline Integrasi: Membongkar Asumsi & Delesi"
   - Visual graph muncul dengan stages sebagai nodes (cards)
   - Red lines = high tension paths
   - Green lines = safe/neutral paths
   - Blue lines = defuse paths

### Fitur Branch Editor

#### Node Structure
Setiap stage node menampilkan:
- **Title** (stage name)
- **Color badge**: Indicates tone (red=crisis, blue=neutral, green=resolution)
- **Reply options** (numbered A, B, C, dst)
- **Outcome badge**: Each reply shows tension effect icon

#### Editing Flow

**Step 1: Add or Edit Stage**
- Click **"+ New Stage Node"** untuk tambah stage baru
- Atau double-click existing node untuk edit

**Step 2: Configure Stage Content**
- **botPrompt**: NPC dialog/pertanyaan
- **title**: Stage internal name (untuk reference di branching)
- **topicFocus**: Optional — mark stage untuk topik mana (meta_model, chunking, language_openness)

**Step 3: Set Replies & Branching**
Tiap reply punya fields:
- **text**: Player option text (A, B, C, dst)
- **valueType**: Pattern category (Deletion/Distortion/Generalization)
- **systemFeedback**: Aha moment message (muncul di chat setelah dipilih)
- **nextStage**: Target stage reference (drag-connect atau dropdown select)
- **tensionEffect**: [-1, 0, +1, +2] — impact terhadap tension meter
- **npcReaction**: Optional — bot response sebelum next stage

**Step 4: Visualize Path**
- Editor auto-draw lines antar stages based on nextStage references
- Red line = high tension (+2), Blue line = safe (0/-1)
- Hover path → highlight trajectory

**Step 5: Set Outcomes**
- Bottom section: **"Possible Outcomes (3)"**
  - List semua terminal stages (nodes tanpa nextStage)
  - Contoh: "Percakapan Buntu (Deadlock/Walk-Out)", "Sukses dengan Gesekkan", "Resolusi Optimal"

**Step 6: Manage Diagnoses**
- Button **"Manage Diagnoses"** → configure personality/pattern archetype untuk setiap outcome
- Link outcome to `DiagnosisResult` template

**Step 7: Publish**
- Click **"Publish"** → changes deploy ke frontend instantly
- Frontend queries fetch updated `nextStage`, `systemFeedback`, `tensionEffect` values

### Example: Crisis Handling Scenario

```
Stage 0: Laptop Lockdown
├─ Reply A: "Calm, document asumsi dulu" 
│  └─ nextStage: Stage 2 (Constructive Ask)
│  └─ tensionEffect: -1 (defuse)
│  └─ systemFeedback: "Bagus — kamu validate dulu sebelum act."
│
├─ Reply B: "Langsung blame engineer"
│  └─ nextStage: Stage 3 (Confrontation)
│  └─ tensionEffect: +2 (crisis)
│  └─ systemFeedback: "Oops — assumption tanpa data. Ini distorsi."
│
└─ Reply C: "Tunggu PM briefing"
   └─ nextStage: Stage 1 (Stakeholder Huddle)
   └─ tensionEffect: 0 (neutral)
   └─ systemFeedback: "Safe move — tapi sementara. Tension naik kalau delay lama."

[Paths branch to 3 different mids, then converge at final diagnosis]
```

### Data Sync: CMS ↔ Frontend

**Flow**:
1. Edit di Branch Editor → Save
2. Publish scenario
3. Frontend `queries.ts` re-fetch scenario:
   ```typescript
   stages {
     _key
     title
     botPrompt
     topicFocus
     replies {
       text
       valueType { topic }
       systemFeedback
       nextStage  // ← NEW: references stage._key
       tensionEffect
       npcReaction
     }
   }
   ```
4. `PlayChatBox.tsx` parse nextStage & execute branching logic
5. Tension meter, system feedback, choice history — semua reflect dari CMS data real-time

---

## Files Modified in fe-branching

```
cms/schemaTypes/
  ├─ replyType.ts (added nextStage, systemFeedback fields)
  ├─ stageType.ts (added topicFocus field)
  └─ valueType.ts (added topic field)

frontend/lib/
  ├─ types.ts (extended interfaces)
  └─ queries.ts (fetch new fields)

frontend/app/components/
  ├─ PlayChatBox.tsx (branching logic, async steps, choice history, tension meter)
  └─ DiagnosisResult.tsx (display choice journey)
```

---

## Testing Checklist

- [ ] Branching works: Pick different replies → different next stages
- [ ] Tension changes: Select replies with tensionEffect → meter updates
- [ ] System feedback displays: After reply, "💡 Refleksi" message appears before NPC response
- [ ] Skip delay works: Fast mode toggle skips 3s delay
- [ ] Choice history saved: Complete scenario, check DiagnosisResult shows all choices
- [ ] Early termination: Reach max tension → crisis ending triggered
- [ ] Query complete: All new fields fetch from CMS (use browser DevTools Network tab to verify)

---

## Key Decisions Made

1. **Kept main branch tension system** — merges cleanly with branching, provides live consequence feedback
2. **Chose nextStage field (string) over nextStageKey** — simpler, directly references stage._key
3. **Used async step queue** — cleaner UX flow for sequential feedback reveal
4. **Stored chosenReplies in sessionStorage** — enables recovery + personal results without backend
5. **Foundation-only for chunking/language** — schema ready, but content can be added incrementally

---

**Branch**: `fe-branching`  
**Last Updated**: 2025-09-03  
**Status**: Production-ready for testing; awaiting CMS data completion
