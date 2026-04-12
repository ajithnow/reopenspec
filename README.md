# 🚀 ReOpenSpec

**Stop your AI agents from hallucinating architecture.**

ReOpenSpec is an agentic workflow engine that grounds your AI coding assistants (like Cursor, Windsurf, Roo, and Cline) in reality. It scans your codebase, builds a deterministic map of your architecture, and injects exactly the right rules at exactly the right time. 

---

## 🤯 Did You Know? (The Interesting Facts)

*   **Fact #1: AI Agents suffer from "Context Pollution".** If you dump your entire project history and dozens of architectural decision records (ADRs) into an AI's prompt, it gets confused and hallucinates connections. ReOpenSpec solves this by strictly archiving completed work and only feeding the agent the *active* specs it needs right now.
*   **Fact #2: It actually reads your code's mind (AST).** Unlike tools that just perform dumb text-searches, ReOpenSpec uses **AST (Abstract Syntax Tree)** parsing (via `ast-grep`) for TypeScript. It *knows* exactly what a module exports and imports, building a mathematical graph of your application in `arch-baseline.json`.
*   **Fact #3: It is a Chameleon.** Run `reo init` and it sniffs out your environment. Are you writing PHP with React in Windsurf? Or C# with Vue in Cursor? ReOpenSpec auto-detects your primary stack and your preferred IDE, injecting specifically tailored `.mdc` rules so your agent behaves perfectly for *your* exact setup.
*   **Fact #4: It catches architectural "Drift".** Your AI agent promised to update the `PaymentService` interface, but did it really? ReOpenSpec compares your rigorously documented `api-contracts.json` against the live code baseline to catch architectural drift instantly.

---

## 🏗️ The 3-Tier Architecture Philosophy

ReOpenSpec forces a heavily structured, traceable workflow on your repository:

| Where it lives | What it is | Agent's Relationship |
|------|------|------|
| **`reopenspec/docs/`** | Human narratives, ADRs, runbooks, and team guidelines. | High-level context. This is **not** the live behavioral contract. |
| **`reopenspec/specs/`** | Domain behaviors, scenarios, and **`api-contracts.json`**. | **Source of Truth.** The AI must rigorously adhere to this. |
| **`reopenspec/changes/`** | In-flight work (`active/`) and archived work (`completed/`). | The AI's scratchpad. Completed work is archived to keep main memory clean! |

*(See [`reopenspec/docs/reopenspec-model.md`](reopenspec/docs/reopenspec-model.md) for the deep dive).*

---

## ⚡ Quick Start

### 1. Install
Require Node.js 20+.
```bash
npm install -g reopenspec
```

### 2. Bootstrapping Magic
In your project root, run:
```bash
reo init
```
*What just happened?* ReOpenSpec auto-detected your language, your frameworks, and your IDE. It created the 3-tier folder structure, mapped your codebase into an `arch-baseline.json`, and injected targeted semantic agent rules.

### 3. The Traceable Feature Flow
ReOpenSpec enforces predictability for AI agents:
1. **`reo init`**: Setup environment and detect the stack.
2. **`/reo-spec-blueprint`**: Discover and scaffold domain-wise architecture specs for brownfield projects.
3. **`/reo-plan`**: Connect via MCPs (Jira/Azure/Figma), pull a story or bug, parse dependencies, and provision a strict `change.yaml` scaffold under the `active/` folder.
4. **`/reo-proceed-plan`**: Execute the implementation in isolated, tracable steps based on the plan.
5. **`/reo-completed`**: You review, the AI proposes updates to `reopenspec/specs/`, and safely archives the work into `changes/completed/YYYY-MM-DD/` to lock the spec and erase short-term memory pollution.

---

## 🛠️ Command Reference

| Command | Purpose |
| :--- | :--- |
| `reo init` | First-time boilerplate: directories, config, baseline scan, dynamic IDE profile detection, and contextual rule injection. |
| `reo init --skip-workflow` | Core initialization only. Scans baseline and creates config without injecting `.mdc` rules or templates. |
| `reo sync` | Full workspace scan + structural drift report computation against active contracts. |
| `reo scan` | Generate and write `arch-baseline.json` on demand. |
| `reo drift` / `reo diff` | Check codebase drift solely against `reopenspec/specs/*/api-contracts.json`. |
| `reo doctor` | Validate workspace health (checks config, directories, and spec contract references). |
| `reo inject` | Hard force re-apply of the latest dynamic categorized IDE rules. |

*(Run `reo <command> --help` for flags. Pro-tip: Use `--verbose` on `reo scan` or `reo sync` for detailed node-extraction logs).*

---

## 🌍 Language Support

ReOpenSpec organically traverses multi-language workspaces using a unified Parser Adapter pattern:

- **TypeScript / TSX** — True AST parsing for exports and imports via `@ast-grep/napi`.
- **C# / .NET** — Heuristic scan (namespaces, classes, interfaces, records, functions, and `using` module specs).
- **Python** — Heuristic scan (classes, `def` functions, and aliased imports).
- **PHP** — Heuristic scan (namespaces, classes, interfaces, traits, functions, and `use` aliases).
- **Dart / Flutter** — Heuristic scan (imports + top-level declarations); ignores build tools automatically.

---

## 📄 License

MIT — see [LICENSE](LICENSE). Go build smarter things.
