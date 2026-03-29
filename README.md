# ReOpenSpec

**Spec-driven development with a deterministic code snapshot.** ReOpenSpec is a small CLI (`reo`) that scans your repo into `arch-baseline.json`, compares each feature’s `api-contracts.json` to that baseline (drift), and injects short IDE rules so agents read those files instead of guessing from RAG alone.

It sits in the same problem space as [OpenSpec](https://github.com/Fission-AI/OpenSpec) (specs in git, AI-assisted workflows) and adds **AST-grounded structure + drift**. Narrative docs like `architecture.md` stay **author- and agent-written in the IDE**; `reo` assists with facts and structured checks.

## Repository layout (`docs` / `specs` / `changes`)

ReOpenSpec assumes (and `reo init` creates) three cooperating areas at the project root:

| Path | Role |
|------|------|
| **`docs/`** | Architecture narratives, ADRs, runbooks, team conventions — context that is **not** the live behavioral contract. |
| **`specs/`** | Domain behavior, scenarios, and **`api-contracts.json`** — the **source of truth**, cross-checked against code via baseline + drift. |
| **`changes/active/`** | In-flight work: one folder per story, task, or bug (e.g. `task-azure-1234-make-login`, `bug-jira-4421-timeout`) after **`/reo-plan`** — plan, design, tasks, **`delta.md`** vs `specs/`. |
| **`changes/completed/`** | Done work: same slug as in `active/`, moved here with a **`YYYY-MM-DD-`** date prefix when **`/reo-completed`** runs (e.g. `2026-02-06-task-azure-1234-make-login`). |

See **[`docs/reopenspec-model.md`](docs/reopenspec-model.md)** for the full architectural model (deltas, archive, and how this differs from a generic OpenSpec clone).

## Requirements

- **Node.js 20+**

## Install

```bash
npm install -g reopenspec
```

Check: `reo --help`

From a clone of this repo:

```bash
npm install && npm run build
node bin/run.js --help
```

## Quick start

1. In your project root:

   ```bash
   reo init
   ```

   This creates **`docs/`**, **`changes/active/`**, **`changes/completed/`**, **`specs/`** and **`specs/.meta/`**, writes `reopenspec.json` if missing, runs a scan, injects Cursor rules (or `.ai-context/AGENTS.md` as a fallback), copies **slash-command templates** to `.cursor/commands/`, and adds **`reopenspec.project.yaml`** when missing. Use **`reo init --skip-workflow`** if you only want baseline + config without those files.

2. **Traceable feature flow (IDE)** follows a true 5-step lifecycle:
   - **`reo init`**: Sets up folders, ignores your local IDE profile (`.reopenspec.user.yaml`), and copies IDE workflows.
   - **`/reo-blueprint`**: Generates architecture specs and rules native to your IDE choice (Cursor, Roo, Windsurf).
   - **`/reo-plan`**: Connects via Project Management MCPs (Azure/Jira), tracks dependencies, and provisions a traced scaffold under **`changes/active/`** (e.g. `changes/active/story-azure-authflow-setup/`, `changes/active/bug-azure-5678-null-ref/`) driven by a strict `change.yaml`.
   - **`/reo-proceed-plan`**: Reads the change folder and implements the feature.
   - **`/reo-completed`** (human-run after checking proceed-plan work): the agent **proposes** updates to **`specs/`**; you **confirm** before any spec write, then **confirm again** before moving the folder to **`changes/completed/YYYY-MM-DD-.../`** (see **`commands/reo-completed.md`**).
   
   See [`commands/README.md`](commands/README.md) for full context.

3. Add or scaffold main-line specs (optional if you only use **`changes/active/`** folders):

   ```bash
   reo spec new my-feature
   ```

4. Point contracts at real exports in `specs/<feature>/api-contracts.json` (`mapsTo`: file path, symbol, kind).

5. Refresh baseline + drift:

   ```bash
   reo sync
   ```

   Outputs default to `specs/.meta/arch-baseline.json` and `specs/.meta/drift-report.json` (configurable in `reopenspec.json`).

## Commands

| Command                           | Purpose                                                                                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `reo init`                        | First-time: dirs, config, scan, inject IDE snippets, copy slash commands to `.cursor/commands/`, add `reopenspec.project.yaml` if missing |
| `reo init --skip-workflow`        | Same as above but without copying slash commands or adding `reopenspec.project.yaml`                                                      |
| `reo sync`                        | Full scan + drift report                                                                                                                  |
| `reo scan`                        | Baseline only                                                                                                                             |
| `reo drift` / `reo diff`          | Drift vs `specs/*/api-contracts.json`                                                                                                     |
| `reo spec new <slug>`             | Scaffold feature folder + `.spec-meta.json`                                                                                               |
| `reo inject`                      | Re-apply injected rules                                                                                                                   |
| `reo config`                      | Show or create `reopenspec.json`                                                                                                          |
| `reo status`                      | Config paths + baseline/drift summary                                                                                                     |
| `reo hooks install` / `uninstall` | Git pre-commit hook (`reo sync`)                                                                                                          |

Run `reo <command> --help` for flags.

## Languages

- **TypeScript / TSX** — via [ast-grep](https://ast-grep.github.io/) (`@ast-grep/napi`): exports and imports.
- **Dart** — heuristic scan (imports + top-level declarations); `build/` and `.dart_tool/` are ignored.

## Configuration

`reopenspec.json` at the repo root (or `specs/.meta/reopenspec.json`) can set `baselinePath`, `driftReportPath`, `specsDir`, and `strictUncovered`.

## VS Code

A minimal extension lives under `editors/vscode/` (config editor + run sync). Build it with `npm run vscode:compile` from the repo.

## Docs in this repo

- [`docs/reopenspec-model.md`](docs/reopenspec-model.md) — **docs / specs / changes** model, deltas, and archive
- [`commands/README.md`](commands/README.md) — optional Cursor slash-command templates (`/reo-*`) aligned with `specs/` and `changes/`

## License

MIT — see [LICENSE](LICENSE).
