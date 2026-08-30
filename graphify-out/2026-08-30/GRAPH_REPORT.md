# Graph Report - NLP-Project  (2026-08-30)

## Corpus Check
- 39 files · ~6,338 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 241 nodes · 285 edges · 24 communities (16 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b58dd0f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- compilerOptions
- app/play/page.tsx
- frontend/package.json
- compilerOptions
- cms/package.json
- index.ts
- NLP Project Development Guide
- dependencies
- scenario/[slug]/page.tsx
- layout.tsx
- frontend/README.md
- loading.tsx
- cms/README.md
- AGENTS.md
- frontend/eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- LanguageToggle.tsx
- GoogleTranslate.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `compilerOptions` - 12 edges
3. `sanity` - 8 edges
4. `NLP Project Development Guide` - 8 edges
5. `include` - 7 edges
6. `scripts` - 6 edges
7. `PlayScenario` - 5 edges
8. `sanityClient` - 5 edges
9. `scripts` - 5 edges
10. `prettier` - 5 edges

## Surprising Connections (you probably didn't know these)
- `NLP Project Development Guide` --references--> `CMS (Sanity Studio)`  [EXTRACTED]
  README.md → cms/README.md
- `NLP Project Development Guide` --references--> `Frontend (Next.js)`  [EXTRACTED]
  README.md → frontend/README.md
- `exclude` --extends--> `node_modules`  [EXTRACTED]
  frontend/tsconfig.json → cms/tsconfig.json
- `lib` --extends--> `dom.iterable`  [EXTRACTED]
  frontend/tsconfig.json → cms/tsconfig.json
- `Frontend (Next.js)` --references--> `Next.js Agent Rules`  [INFERRED]
  frontend/README.md → frontend/AGENTS.md

## Import Cycles
- None detected.

## Communities (24 total, 8 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.09
Nodes (25): devDependencies, eslint, prettier, @sanity/eslint-config-studio, @types/react, typescript, eslint, eslint-config-next (+17 more)

### Community 1 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowJs, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, module, moduleDetection (+16 more)

### Community 2 - "app/play/page.tsx"
Cohesion: 0.10
Nodes (29): Message, PlayChatBox(), Props, StoredChatState, generateMetadata(), getPlayScenario(), PageProps, PlayPage() (+21 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.11
Nodes (17): dependencies, next, @portabletext/react, react, @sanity/client, name, private, scripts (+9 more)

### Community 4 - "compilerOptions"
Cohesion: 0.09
Nodes (22): lib, dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental (+14 more)

### Community 5 - "cms/package.json"
Cohesion: 0.12
Nodes (16): license, main, name, prettier, bracketSpacing, printWidth, semi, singleQuote (+8 more)

### Community 6 - "index.ts"
Cohesion: 0.19
Nodes (9): keywords, diagnosis, schemaTypes, postType, reply, scenario, stage, valueType (+1 more)

### Community 7 - "NLP Project Development Guide"
Cohesion: 0.12
Nodes (19): CMS (Sanity Studio), Next.js Agent Rules, Frontend (Next.js), Claude Configuration, Graphify CLI, Graphify Knowledge Graph, CMS (Sanity Studio), code:bash (cd cms) (+11 more)

### Community 8 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, react, react-dom, sanity, @sanity/vision, styled-components, react, react-dom (+3 more)

### Community 9 - "scenario/[slug]/page.tsx"
Cohesion: 0.22
Nodes (10): ScenarioNotFound(), prologueComponents, Props, ScenarioPrologue(), generateMetadata(), getScenario(), PageProps, revalidate (+2 more)

### Community 11 - "layout.tsx"
Cohesion: 0.40
Nodes (3): inter, metadata, playfair

### Community 12 - "frontend/README.md"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **109 isolated node(s):** `Message`, `StoredChatState`, `Props`, `revalidate`, `PageProps` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `cms/package.json`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `frontend/package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `cms/package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `Message`, `StoredChatState`, `Props` to the rest of the system?**
  _109 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08666666666666667 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `app/play/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10158730158730159 - nodes in this community are weakly interconnected._