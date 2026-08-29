# NLP Project Development Guide

This repository contains the full stack for the NLP Project, comprising a modern Next.js `frontend` and a Sanity `cms` backend.

## Project Structure

- **/frontend**: Next.js React application (using Tailwind CSS).
- **/cms**: Sanity Studio CMS backend for content management.
- **/graphify-out**: Contains the knowledge graph generated for this project.

## Development Setup

### CMS (Sanity Studio)
1. Navigate to the `cms` directory: 
   ```bash
   cd cms
   ```
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Start the development server: 
   ```bash
   npm run dev
   ```
4. The studio will be accessible at http://localhost:3333

### Frontend (Next.js)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will be accessible at http://localhost:3000

## Graphify IDE Integration for the Team

We use **Graphify** to maintain a queryable knowledge graph of this codebase. This helps AI assistants understand our decoupled architecture and project context better. 

### Setting Up Graphify

For team members setting up the project for the first time, you can generate your own local graph and integrate it with your IDE:

1. Make sure you have the Graphify CLI installed.
2. Run the full graph generation pipeline in the project root (or use the slash command if available in your IDE):
   ```bash
   graphify
   ```
3. **Run the Graphify Hook**:
   To ensure the graph stays up to date automatically as you commit code changes, run the following command to install the git hooks:
   ```bash
   graphify hook install
   ```
4. **IDE Integration**:
   The project is pre-configured with a Model Context Protocol (MCP) server for Antigravity. The configuration is located at `.agents/mcp_config.json`. Once you generate the graph, your AI agent will automatically detect the MCP server and have direct access to the graph tools.
5. **Interactive Visualization**:
   You can visually explore the graph by opening `graphify-out/graph.html` in any web browser.
