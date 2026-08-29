# Graph Report - nlp-project  (2026-08-29)

## Corpus Check
- 20 files · ~2,538 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 128 nodes · 117 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6c12722`
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
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `compilerOptions` - 12 edges
3. `scripts` - 6 edges
4. `prettier` - 6 edges
5. `scripts` - 5 edges
6. `NLP Project Development Guide` - 4 edges
7. `CMS (Sanity Studio)` - 4 edges
8. `Frontend (Next.js)` - 4 edges
9. `Sanity Runtime Index` - 4 edges
10. `Development Setup` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Sanity Content Studio` --conceptually_related_to--> `Sanity Runtime Index`  [INFERRED]
  cms/README.md → cms/.sanity/runtime/index.html
- `Next.js Agent Rules` --references--> `Next.js Application`  [INFERRED]
  frontend/AGENTS.md → frontend/README.md
- `Claude Instructions` --references--> `Next.js Agent Rules`  [EXTRACTED]
  frontend/CLAUDE.md → frontend/AGENTS.md

## Communities (17 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @sanity/eslint-config-studio, @types/react, typescript, keywords, license, main (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, lib, module (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (12): dependencies, next, react, react-dom, name, private, scripts, build (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (7): devDependencies, eslint, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, typescript

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (6): dependencies, react, react-dom, sanity, @sanity/vision, styled-components

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (6): scripts, build, deploy, deploy-graphql, dev, start

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (6): Sanity Clean Content Studio README, Sanity Content Studio, Sanity Runtime App Entry, Sanity Runtime Index, Sanity Bridge SDK, __sanityErrorChannel

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 9 - "Community 9"
Cohesion: 0.50
Nodes (4): Next.js Agent Rules, Claude Instructions, Next.js Application, Frontend Next.js README

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (15): CMS (Sanity Studio), code:bash (cd cms), code:bash (npm install), code:bash (npm run dev), code:bash (cd frontend), code:bash (npm install), code:bash (npm run dev), code:bash (graphify) (+7 more)

## Knowledge Gaps
- **88 isolated node(s):** `Project Structure`, `code:bash (cd cms)`, `code:bash (npm install)`, `code:bash (npm run dev)`, `code:bash (cd frontend)` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 4` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `@types/react` connect `Community 1` to `Community 4`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `Project Structure`, `code:bash (cd cms)`, `code:bash (npm install)` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 16` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._