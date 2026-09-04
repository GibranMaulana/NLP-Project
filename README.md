# Beleef NLP — De Leiderschaps-Taalspiegel (The Executive Language Mirror)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Sanity](https://img.shields.io/badge/Sanity-v3-red?style=flat-square&logo=sanity)](https://www.sanity.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescript.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

> **Case Brief:** Het NLP Instituut (Elke Zabel, Netherlands)  
> **Concept:** *Bikin Manager Merasakan Pola Bahasanya, Bukan Cuma Diajarin.*

---

## 📑 Executive Decision Notes

Read the strategic design choices, core problem analysis, pedagogical rationale, and commercial impact in detail:

- 🇳🇱 **[Bekijk de Nederlandstalige Decision Note (DECISION_NOTE.md)](DECISION_NOTE.md)**
- 🇬🇧 **[Read the English Decision Note (DECISION_NOTE_EN.md)](DECISION_NOTE_EN.md)**

---

## 🎯 Project Overview & Philosophy

Traditional NLP (Neuro-Linguistic Programming) training often suffers from a fundamental flaw: **it is taught as an academic lecture**. Managers memorize taxonomy tables (*Meta Model, Deletions, Distortions, Generalizations*) and complete multiple-choice quizzes that produce a "test persona" (picking what sounds right rather than how they actually speak).

**Beleef NLP** replaces quizzes with an **"Uncomfortable Mirror"**:
1. **Zero-Quiz Design:** No scores, no countdown timers, and no "Right vs. Wrong" labels.
2. **High-Stakes Crisis Simulation:** Realistic conversations with team leads and executives during critical project bottlenecks.
3. **Meta Model Matrix:** Every response option embodies a core NLP Meta Model questioning pattern:
   - **Deletion Challenge (Weglating):** Uncovering missing critical information (*"What exactly are people frustrated about?"*).
   - **Distortion Challenge (Vervorming):** Questioning assumptions and mind-reading claims (*"What makes you think everyone feels that way?"*).
   - **Generalization Challenge (Generalisatie):** Challenging universal quantifiers (*"Who specifically do you mean by 'everyone'?"*).
4. **7-Combination Diagnostic Engine:** Concludes with an executive reflection matrix (Dominant patterns, Hybrid 2-way ties, or Balanced 3-way profiles) revealing subconscious leadership blindspots, followed by a direct CTA to Het NLP Instituut programs.

---

## 🏗️ Architecture & Tech Stack

```
NLP-Project/
├── frontend/                   # Next.js 16 (App Router + Turbopack)
│   ├── app/
│   │   ├── page.tsx            # Platform Overview & Batch Catalog
│   │   ├── b/[batchId]/        # Batch Scenario Selection Catalog
│   │   │   └── [slug]/         # Scenario Experience
│   │   │       ├── page.tsx    # Prologue & Interactive Chat Flow
│   │   │       └── diagnosis/  # 7-Combination Harsh Truth Reflection
│   │   ├── components/         # Modular React UI Components
│   │   │   ├── PlayChatBox.tsx # Fixed-Header/Footer App Chat Engine
│   │   │   ├── ScenarioPrologue.tsx # Cinematic Narrative Entry
│   │   │   ├── DiagnosisResult.tsx # Reflection & Dynamic Business CTA
│   │   │   └── LanguageToggle.tsx # Client-Side NL/EN Localization
│   │   ├── globals.css         # Typography, Shimmers, Keyframe Animations
│   │   └── layout.tsx          # Root Layout & Preconnect Optimizations
│   └── lib/
│       ├── queries.ts          # Optimized GROQ Queries
│       ├── sanity.ts           # Sanity Edge CDN Client
│       └── types.ts            # TypeScript Interfaces
│
├── cms/                        # Sanity Studio v3 (Headless CMS)
│   ├── schemaTypes/
│   │   ├── batchType.ts        # Scenarios Grouping & Batching
│   │   ├── scenarioType.ts     # Linear Stages & Diagnoses Relations
│   │   ├── stageType.ts        # Bot Prompts & User Meta Model Replies
│   │   ├── diagnosisType.ts    # Punchy Headlines & Harsh Truth Copy
│   │   ├── valueType.ts        # Meta Model Taxonomy Definitions
│   │   └── businessLinkType.ts # Dynamic Business/Course URLs
│   └── sanity.config.ts        # Sanity Studio Workspace Configuration
│
└── graphify-out/               # Knowledge Graph & Codebase Topology
```

---

## ✨ Key Features & UX Innovations

### 1. 🎬 Cinematic Narrative Prologue
- Immersive dark aesthetic (`#111116`) with radial atmospheric glow and editorial serif typography (*Playfair Display*).
- Timed line-by-line fade-up narrative build-up.
- Symmetrically aligned top navigation bar with `[← Terug naar Batch]` on the top-left and `[ NL | EN ]` on the top-right.

### 2. 💬 Pinned App-Like Chat Simulator with Dynamic Branching
- **Fixed Profile Header:** Sticky top navbar featuring character SVG avatar, online status, reset button, and language switcher.
- **Independent Smooth Scroll:** Message history scrolls naturally and auto-scrolls to the bottom on every reply without whole-page jumping.
- **Fixed Response Panel:** Interactive choices (`1`, `2`, `3`) remain pinned at the bottom of the viewport for effortless mobile and desktop interaction.
- **Clean Dialogue:** Removes extraneous taxonomy tags from user bubbles to mimic authentic workplace chat messaging.
- **Dynamic Branching (NEW):** User choice now determines next stage—not linear progression. Reply field `nextStage` references target stage key.
- **Consequence System (NEW):** Choices reshape story trajectory; different paths lead to different outcomes.
- **Tension Meter (NEW):** Real-time consequence feedback via tension gauge (0-3 scale) in header, updating based on reply `tensionEffect`.
- **System Insights (NEW):** After user picks reply, "💡 Refleksi Reframing" message displays aha moment before NPC response.
- **Choice History (NEW):** All user choices tracked in `sessionStorage`; journey displayed in final diagnosis for personalization.
- **Async Step Queue (NEW):** Sequenced message reveals (system feedback → NPC reaction → next prompt) with configurable delays (3s default).

### 3. 🧠 7-Combination Diagnostic Algorithm
- Calculates user question distribution across **Deletion**, **Distortion**, and **Generalization**.
- Maps choices to 7 unique outcome states:
  - 3 Dominant Single Patterns (*The Deep Driller, The Assumption Challenger, The Precision Framer*)
  - 3 Hybrid 2-Way Ties (*The Pragmatic Realist, The Structural Questioner, The Transformational Strategist*)
  - 1 Balanced 3-Way Tie (*The Holistic Inquirer*)
- Includes dynamic fallback resolution if CMS content is incomplete.
- **Personal Results (NEW):** Diagnosis now tied to actual journey—displays choice timeline with quotes before upsell.

### 4. ⚡ Blazing Fast Performance
- **Sanity Edge CDN:** `useCdn: true` for sub-30ms global data retrieval.
- **Server Request Deduplication:** React `cache()` prevents redundant queries across metadata and page components.
- **Concurrent Fetching:** `Promise.all()` parallelizes data fetching across batches and business links.
- **Zero Hydration Warning:** Strict `suppressHydrationWarning` and `display: "swap"` font rendering.

### 5. 🔗 Dynamic Sanity Business Link
- The **"Ontdek Opleidingen / Discover Courses"** CTA on the reflection screen dynamically pulls its destination URL from the `business` document in Sanity CMS (`businessLinkType.ts`), allowing non-technical marketing managers to update course links anytime without redeploying code.

### 6. 🎨 CMS Visual Branch Editor (NEW)
- Sanity Studio **Branch Editor** tab visualizes entire story as interactive node graph.
- Drag-connect stages, set branching paths, manage tension thresholds, and preview outcomes all in one view.
- No need to edit JSON or field-by-field—branch design is now visual and iterative.
- See section [CMS Branching Editor Workflow](#-cms-branching-editor-workflow) for details.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or pnpm

### 1. Clone Repository
```bash
git clone https://github.com/GibranMaulana/NLP-Project.git
cd NLP-Project
```

### 2. Checkout Feature Branch (Optional - Latest Branching Features)
For the latest **dynamic branching, tension meter, system feedback, and choice history** features, check out `fe-branching`:
```bash
git checkout fe-branching
```
Otherwise, stay on `main` for stable baseline.

### 3. CMS Setup (Sanity Studio)
```bash
cd cms
npm install
npm run dev
```
The Sanity Studio will run at `http://localhost:3333` (or `http://localhost:3000` depending on port availability).

Access the **Branch Editor** tab to visually design scenario branching paths.

### 4. Frontend Setup (Next.js)
```bash
cd ../frontend
npm install
```

Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=v8udsf47
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Start the development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000` (or `http://localhost:3001`).

---

## 📚 Documentation & Change Tracking

- **[REVISI.md](REVISI.md)** — Detailed mapping of brief feedback issues → fe-branching solutions (A-F sections covering branching, real-time feedback, story context, personalized results, schema extensions, and async flow).
- **[DECISION_NOTE.md](DECISION_NOTE.md)** — Dutch strategic decision notes (pedagogy, architecture, UX philosophy).
- **[DECISION_NOTE_EN.md](DECISION_NOTE_EN.md)** — English strategic decision notes.

---

## 🎨 CMS Branching Editor Workflow

The **Branch Editor** tab in Sanity Studio provides a visual interface for designing branching scenarios without code:

### Access Branch Editor
1. Open Sanity Studio at `http://localhost:3333`
2. Edit a scenario
3. Click **"Branch Editor"** tab (alongside Structure, Vision, Releases)

### Key Editing Workflow

**Stage Nodes:**
- Each box represents a conversation turn (`stage`)
- Shows NPC dialog, color badge (red=crisis, blue=neutral, green=safe), and reply options
- Click **"+ New Stage Node"** to add, double-click to edit

**Set Reply Branching:**
- Click reply option (A, B, C) to configure:
  - **text:** Player choice text
  - **valueType:** Pattern (Deletion/Distortion/Generalization)
  - **systemFeedback:** Aha moment message (displays in chat after choice)
  - **nextStage:** Target stage (drag-connect or dropdown)
  - **tensionEffect:** Impact [-1 defuse, 0 neutral, +1 escalate, +2 crisis]
  - **npcReaction:** Optional bot response before next stage

**Visualize Paths:**
- Lines auto-draw between stages
- Red = high tension, Blue = safe
- Hover paths to highlight trajectory

**Terminal Outcomes:**
- Bottom panel lists all possible endpoints
- Assign personality archetypes/diagnoses to each outcome
- Click **"Manage Diagnoses"** to configure results screen

**Publish & Deploy:**
- Click **"Publish"** → changes live on frontend immediately
- Frontend fetches new `nextStage`, `systemFeedback`, `tensionEffect` values from CMS

### Example: Crisis Scenario
```
Stage 0 (Crisis Alert)
├─ Reply A: "Gather facts" → Stage 2 (Analysis) | tensionEffect: -1 | feedback: "Wise first step"
├─ Reply B: "Blame engineer" → Stage 3 (Confrontation) | tensionEffect: +2 | feedback: "Assumption alert"
└─ Reply C: "Wait for PM" → Stage 1 (Huddle) | tensionEffect: 0 | feedback: "Safe but risky if delayed"

[Paths merge to single diagnosis node with choice timeline]
```

---

## ✍️ Content Management in Sanity Studio

Trainers and admins at **Het NLP Instituut** can author new scenarios directly from the Sanity Studio:

1. **Batches (`batch`):** Group related scenarios into leadership tracks or training cohorts.
2. **Scenarios (`scenario`):** Set scenario title, slug, narrative prologue, dialogue stages, and associate diagnoses.
3. **Dialogue Stages (`stage`):** Create the conversation step, speaker name, NPC dialogue prompt, and 3 user response choices (each referencing a Meta Model `valueType`).
4. **Diagnoses (`diagnosis`):** Configure the harsh truth reflection headline, detailed diagnostic paragraphs, and trigger condition (`dominant`, `hybrid`, `balanced`).
5. **Business Settings (`business`):** Set the target URL for the "Discover Courses" button on the final diagnosis screen.

---

## 🔍 Graphify Codebase Topology

This repository is integrated with **Graphify** to maintain a persistent knowledge graph of architecture and cross-file dependencies.

- **Rebuild Graph:**
  ```bash
  graphify update .
  ```
- **Visual Graph Explorer:** Open `graphify-out/graph.html` in any web browser.
- **Audit Report:** Read `graphify-out/GRAPH_REPORT.md` for God nodes, community clustering, and architectural insights.

---

## 👥 Contributors & License

- **Client:** Het NLP Instituut (Netherlands)
- **Project Lead & Development:** NLP Project Team
- **License:** Proprietary / Confidential — Developed for Het NLP Instituut Case.
