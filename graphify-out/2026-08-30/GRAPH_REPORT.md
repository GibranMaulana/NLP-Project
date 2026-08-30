# Graph Report - NLP-Project  (2026-08-30)

## Corpus Check
- 32 files · ~3,356 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 202 nodes · 213 edges · 23 communities (18 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `066a3ce3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- cms/package.json
- compilerOptions
- frontend/package.json
- sanity
- devDependencies
- NLP Project Development Guide
- backup/index.ts
- devDependencies
- include
- layout.tsx
- postcss.config.mjs
- frontend/eslint.config.mjs
- next.config.ts
- CMS (Sanity Studio)
- frontend/README.md
- cms/README.md
- AGENTS.md
- scripts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `sanity` - 15 edges
3. `compilerOptions` - 12 edges
4. `NLP Project Development Guide` - 8 edges
5. `include` - 7 edges
6. `scripts` - 6 edges
7. `prettier` - 5 edges
8. `scripts` - 5 edges
9. `lib` - 4 edges
10. `CMS (Sanity Studio)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `NLP Project Development Guide` --references--> `CMS (Sanity Studio)`  [EXTRACTED]
  README.md → cms/README.md
- `NLP Project Development Guide` --references--> `Frontend (Next.js)`  [EXTRACTED]
  README.md → frontend/README.md
- `Frontend (Next.js)` --references--> `Next.js Agent Rules`  [INFERRED]
  frontend/README.md → frontend/AGENTS.md
- `Claude Configuration` --references--> `Next.js Agent Rules`  [EXTRACTED]
  frontend/CLAUDE.md → frontend/AGENTS.md

## Import Cycles
- None detected.

## Communities (23 total, 5 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "cms/package.json"
Cohesion: 0.09
Nodes (22): dependencies, react, react-dom, sanity, @sanity/vision, styled-components, react, react-dom (+14 more)

### Community 2 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.12
Nodes (15): dependencies, next, react, react-dom, react, react-dom, name, private (+7 more)

### Community 4 - "sanity"
Cohesion: 0.21
Nodes (9): publishBatchWithScenariosAction(), batch, diagnosis, schemaTypes, reply, scenario, stage, valueType (+1 more)

### Community 5 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+9 more)

### Community 6 - "NLP Project Development Guide"
Cohesion: 0.17
Nodes (12): CMS (Sanity Studio), Next.js Agent Rules, Frontend (Next.js), Claude Configuration, Graphify CLI, Graphify Knowledge Graph, code:bash (graphify), code:bash (graphify hook install) (+4 more)

### Community 7 - "backup/index.ts"
Cohesion: 0.21
Nodes (7): batch, diagnosis, schemaTypes, reply, scenario, stage, valueType

### Community 8 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, prettier, @sanity/eslint-config-studio, @types/react, typescript, eslint, @types/react (+3 more)

### Community 9 - "include"
Cohesion: 0.20
Nodes (9): exclude, include, node_modules, **/*.ts, **/*.tsx, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts (+1 more)

### Community 10 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 16 - "CMS (Sanity Studio)"
Cohesion: 0.22
Nodes (9): CMS (Sanity Studio), code:bash (cd cms), code:bash (npm install), code:bash (npm run dev), code:bash (cd frontend), code:bash (npm install), code:bash (npm run dev), Development Setup (+1 more)

### Community 17 - "frontend/README.md"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 22 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, deploy, deploy-graphql, dev, start

## Knowledge Gaps
- **105 isolated node(s):** `schemaTypes`, `allowJs`, `esModuleInterop`, `incremental`, `isolatedModules` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sanity` connect `sanity` to `cms/package.json`, `backup/index.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `keywords` connect `cms/package.json` to `sanity`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `schemaTypes`, `allowJs`, `esModuleInterop` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `cms/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._