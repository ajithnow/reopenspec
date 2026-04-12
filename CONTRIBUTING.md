# Contributing to ReOpenSpec

First off, thank you for considering contributing to ReOpenSpec! It's people like you that make open-source software such a great community to learn, inspire, and create.

ReOpenSpec is focused on creating a standard, traceable workflow for AI coding agents to prevent context pollution and architecture hallucinations. By contributing, you're helping build the future of agentic coding.

## 🚀 Getting Started

ReOpenSpec is a Node.js CLI tool built with [oclif](https://oclif.io/) and uses `@ast-grep/napi` for AST parsing.

### 1. Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher (comes with Node.js)

### 2. Local Setup
1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the TypeScript code:
   ```bash
   npm run build
   ```
4. Link the package locally so you can use the `reo` command anywhere while testing:
   ```bash
   npm link
   ```

## 🧠 Code Architecture Overview

Understanding the layout will help you know where to make your changes:

- **`src/commands/`**: Contains all the CLI commands (e.g., `reo init`, `reo sync`). This uses the standard `oclif` architecture.
- **`src/lib/`**: Core logic including configuration resolution, drift detection, IDE injection, and the workflow engine.
- **`src/lib/parsers/`**: Language-specific adapters. This is where we parse different languages (TypeScript uses AST, others use heuristics).
- **`templates/`**: Base scaffolding templates like `reopenspec.project.yaml` and skill integrations.
- **`rules/`**: The dynamic agent `.mdc` and `.md` rules that get injected during `reo init`. They are categorized into `generic/` and `specific/` stacks.
- **`commands/`**: The slash command templates (e.g., `reo-blueprint.md`, `reo-plan.md`) that guide the AI agents.

## 🛠️ How to Contribute

### Adding or Updating Language Parsers
If you want ReOpenSpec to natively support analyzing a new backend/frontend language:
1. Create a new adapter in `src/lib/parsers/` implementing the `ParserAdapter` interface.
2. If using AST is possible, look at `@ast-grep/napi` integration. Otherwise, implement a robust Regex/Heuristic parser.
3. Update `src/lib/baseline.ts` to register your new adapter.
4. Update `src/lib/detect-profile.ts` so `reo init` can auto-detect the new stack.

### Refining AI Prompts & Rules
Improving the AI workflows is a constant process:
- Modifying IDE rules: Look in the `rules/` directory.
- Modifying Workflow Commands: Look in the `commands/` directory. Please make sure commands remain deterministic and tech-agnostic when possible.

### Submitting a Pull Request
1. **Branch off `main`**: Use a descriptive branch name (e.g., `feat/add-ruby-parser` or `fix/cursor-injection-path`).
2. **Make your changes**: Write clean, readable code.
3. **Build and Test manually**: ReOpenSpec operates heavily on the filesystem. Test your changes locally on a dummy project using the globally linked `reo` command.
4. **Commit messages**: Use clear, concise commit messages.
5. **Open the PR**: Provide a clear description of what the PR does and why. If it resolves an open issue, link to it (e.g., "Fixes #12").

## 🐛 Reporting Bugs

If you find a bug, please create an issue on GitHub. Include:
- Your OS and Node version.
- The `reo` command that failed.
- The stack trace (if any) or expected vs. actual behavior.
- Which IDE the agent is running in (if the issue is related to rule injection or slash commands).

## 💡 Suggesting Enhancements

Have an idea to make ReOpenSpec better? Open an issue! We are especially interested in:
- Connecting to new work-item trackers.
- Supporting more IDEs.
- Reducing agent prompt token usage while maintaining high accuracy.

---
Thank you for helping us tame the AI coding agents!
