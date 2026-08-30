# Graph Report - NLP-Project  (2026-08-29)

## Corpus Check
- 24 files · ~2,408 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 171 nodes · 166 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bafcd280`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- compilerOptions
- cms/package.json
- index.ts
- devDependencies
- frontend/package.json
- dependencies
- devDependencies
- include
- NLP Project Development Guide
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
3. `sanity` - 8 edges
4. `include` - 7 edges
5. `scripts` - 6 edges
6. `prettier` - 5 edges
7. `scripts` - 5 edges
8. `lib` - 4 edges
9. `lib` - 4 edges
10. `NLP Project Development Guide` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (21 total, 5 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "cms/package.json"
Cohesion: 0.12
Nodes (16): license, main, name, prettier, bracketSpacing, printWidth, semi, singleQuote (+8 more)

### Community 3 - "index.ts"
Cohesion: 0.20
Nodes (9): keywords, diagnosis, schemaTypes, postType, reply, scenario, stage, valueType (+1 more)

### Community 4 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+9 more)

### Community 5 - "frontend/package.json"
Cohesion: 0.12
Nodes (15): dependencies, next, react, react-dom, react, react-dom, name, private (+7 more)

### Community 6 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, react, react-dom, sanity, @sanity/vision, styled-components, react, react-dom (+3 more)

### Community 7 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, prettier, @sanity/eslint-config-studio, @types/react, typescript, eslint, @types/react (+3 more)

### Community 8 - "include"
Cohesion: 0.20
Nodes (9): exclude, include, node_modules, **/*.ts, **/*.tsx, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts (+1 more)

### Community 9 - "NLP Project Development Guide"
Cohesion: 0.25
Nodes (7): CMS (Sanity Studio), Development Setup, Frontend (Next.js), Graphify IDE Integration for the Team, NLP Project Development Guide, Project Structure, Setting Up Graphify

### Community 10 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 11 - "frontend/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **98 isolated node(s):** `name`, `private`, `version`, `main`, `license` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `index.ts` to `cms/package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `cms/package.json`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `cms/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._