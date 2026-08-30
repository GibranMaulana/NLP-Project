# Graph Report - nlp-project  (2026-08-29)

## Corpus Check
- 26 files · ~3,231 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 153 nodes · 144 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6fb7b01c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `compilerOptions` - 12 edges
3. `scripts` - 6 edges
4. `prettier` - 6 edges
5. `scripts` - 5 edges
6. `NLP Project Development Guide` - 4 edges
7. `CMS (Sanity Studio)` - 4 edges
8. `Frontend (Next.js)` - 4 edges
9. `NLP Project Development Guide` - 4 edges
10. `Development Setup` - 3 edges

## Surprising Connections (you probably didn't know these)
- `NLP Project Development Guide` --references--> `CMS (Sanity Studio)`  [EXTRACTED]
  README.md → cms/README.md
- `NLP Project Development Guide` --references--> `Frontend (Next.js)`  [EXTRACTED]
  README.md → frontend/README.md
- `Frontend (Next.js)` --references--> `Next.js Agent Rules`  [INFERRED]
  frontend/README.md → frontend/AGENTS.md
- `CMS (Sanity Studio)` --references--> `Sanity Studio Runtime Index`  [INFERRED]
  cms/README.md → cms/.sanity/runtime/index.html
- `Claude Configuration` --references--> `Next.js Agent Rules`  [EXTRACTED]
  frontend/CLAUDE.md → frontend/AGENTS.md

## Communities (21 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, prettier, @sanity/eslint-config-studio, @types/react, typescript, keywords, license (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, lib, module (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (12): dependencies, next, react, react-dom, name, private, scripts, build (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (6): diagnosis, schemaTypes, reply, scenario, stage, valueType

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (10): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (8): CMS (Sanity Studio), Next.js Agent Rules, Frontend (Next.js), Claude Configuration, Graphify CLI, Graphify Knowledge Graph, NLP Project Development Guide, Sanity Studio Runtime Index

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (6): dependencies, react, react-dom, sanity, @sanity/vision, styled-components

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (6): scripts, build, deploy, deploy-graphql, dev, start

### Community 9 - "Community 9"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (15): CMS (Sanity Studio), code:bash (cd cms), code:bash (npm install), code:bash (npm run dev), code:bash (cd frontend), code:bash (npm install), code:bash (npm run dev), code:bash (graphify) (+7 more)

### Community 17 - "Community 17"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **95 isolated node(s):** `target`, `lib`, `allowJs`, `skipLibCheck`, `strict` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 5` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `@types/react` connect `Community 1` to `Community 5`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `target`, `lib`, `allowJs` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 16` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._