# Graph Report - NLP-Project  (2026-08-29)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 177 nodes · 182 edges · 22 communities (17 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bafcd280`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- cms/package.json
- index.ts
- compilerOptions
- dependencies
- compilerOptions
- NLP Project Development Guide
- frontend/package.json
- include
- lib
- CMS (Sanity Studio)
- layout.tsx
- frontend/README.md
- cms/README.md
- AGENTS.md
- frontend/eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `compilerOptions` - 12 edges
3. `sanity` - 9 edges
4. `NLP Project Development Guide` - 8 edges
5. `include` - 7 edges
6. `scripts` - 6 edges
7. `prettier` - 5 edges
8. `scripts` - 5 edges
9. `CMS (Sanity Studio)` - 4 edges
10. `Frontend (Next.js)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `exclude` --extends--> `node_modules`  [EXTRACTED]
  frontend/tsconfig.json → cms/tsconfig.json
- `NLP Project Development Guide` --references--> `CMS (Sanity Studio)`  [EXTRACTED]
  README.md → cms/README.md
- `NLP Project Development Guide` --references--> `Frontend (Next.js)`  [EXTRACTED]
  README.md → frontend/README.md
- `lib` --extends--> `dom.iterable`  [EXTRACTED]
  frontend/tsconfig.json → cms/tsconfig.json
- `Frontend (Next.js)` --references--> `Next.js Agent Rules`  [INFERRED]
  frontend/README.md → frontend/AGENTS.md

## Import Cycles
- None detected.

## Communities (22 total, 5 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.09
Nodes (25): devDependencies, eslint, prettier, @sanity/eslint-config-studio, @types/react, typescript, eslint, @types/react (+17 more)

### Community 1 - "cms/package.json"
Cohesion: 0.12
Nodes (16): license, main, name, prettier, bracketSpacing, printWidth, semi, singleQuote (+8 more)

### Community 2 - "index.ts"
Cohesion: 0.20
Nodes (9): keywords, diagnosis, schemaTypes, postType, reply, scenario, stage, valueType (+1 more)

### Community 3 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowJs, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, module, moduleDetection (+8 more)

### Community 4 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, react, react-dom, sanity, @sanity/vision, styled-components, react, react-dom (+8 more)

### Community 5 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 6 - "NLP Project Development Guide"
Cohesion: 0.17
Nodes (12): CMS (Sanity Studio), Next.js Agent Rules, Frontend (Next.js), Claude Configuration, Graphify CLI, Graphify Knowledge Graph, code:bash (graphify), code:bash (graphify hook install) (+4 more)

### Community 7 - "frontend/package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 8 - "include"
Cohesion: 0.22
Nodes (8): exclude, include, **/*.ts, **/*.tsx, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts

### Community 9 - "lib"
Cohesion: 0.29
Nodes (7): lib, dom, dom.iterable, esnext, lib, dom, esnext

### Community 10 - "CMS (Sanity Studio)"
Cohesion: 0.38
Nodes (7): CMS (Sanity Studio), code:bash (cd cms), code:bash (npm install), code:bash (npm run dev), code:bash (cd frontend), Development Setup, Frontend (Next.js)

### Community 11 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 12 - "frontend/README.md"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **88 isolated node(s):** `eslint-config-next`, `prettier`, `@sanity/eslint-config-studio`, `tailwindcss`, `@tailwindcss/postcss` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `cms/package.json`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `frontend/package.json`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `sanity` connect `index.ts` to `dependencies`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `eslint-config-next`, `prettier`, `@sanity/eslint-config-studio` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08666666666666667 - nodes in this community are weakly interconnected._
- **Should `cms/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._