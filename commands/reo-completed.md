---
description: Complete a change — human-run after proceed-plan; agent proposes spec sync; user must confirm before writing specs/ or archiving
argument-hint: path to active change folder (e.g., @changes/active/story-azure-authflow-setup)
---

ROLE: Lead Engineer (Documentation & Cleanup)

This command is the **final step** of the ReOpenSpec traceable workflow. It is **run by the human** after they have **checked** that implementation from **`/reo-proceed-plan`** is complete (tasks done, behavior matches intent).

**The agent does not silently merge into `specs/`.** It **proposes** what should change in the canonical specs; the **user must confirm** before any write to **`specs/`**. Then ask **again** before moving the folder to **`changes/completed/`** (or confirm both in one reply if the user prefers — default: **two confirmations**: specs first, archive second).

### Strict Context Guard
To prevent context pollution, do NOT read the entire codebase. Only read the targeted change files and the **`specs/`** files you need to propose edits for.

---

## Preconditions (human)

- The human has verified that work in **`changes/active/<slug>/`** is **done** (e.g. **`tasks.md`** reflects reality, **`implementation.md`** is accurate).
- The human invoked **`/reo-completed`** with the correct **`@changes/active/<slug>`** (or path).

---

## Flow

### STEP 1 — Read change envelope (read-only)

Load only these files from **`changes/active/<slug>/`**:

- `change.yaml` (metadata), if present
- `delta.md` (what was intended)
- `implementation.md` (what was actually built)

Do **not** modify any file in this step.

---

### STEP 2 — Locate target specs (read-only)

From **`delta.md`** and **`implementation.md`**, identify **which** files under **`specs/`** must be updated (e.g. `specs/auth/api-contracts.json`, `specs/auth/overview.md`).

Read those files only as needed to draft a proposal.

---

### STEP 3 — Propose spec sync (no writes yet)

Present a clear **proposal** to the user:

- **Bullet list** or **short diff-style summary** of every change you intend to make under **`specs/`** (additions, edits, contract entries).
- Call out **drift / `reo sync`** implications if relevant (e.g. new exports to document in **`api-contracts.json`**).

**Do not write** to **`specs/`** yet.

---

### STEP 4 — BLOCKING: User confirms spec sync

Ask the user to **explicitly confirm** before you apply anything, for example:

> Reply with **`confirm specs`** or **`yes, sync specs`** to apply the proposed updates to `specs/`.

If the user **asks for changes**, revise the proposal and repeat STEP 3–4 until they confirm.

**Until confirmation:** Status `SPEC_SYNC_PENDING` — **no** writes under **`specs/`**.

---

### STEP 5 — Apply spec updates (after confirmation)

Only after the user’s confirmation in STEP 4:

- Apply the agreed updates to **`specs/`** (markdown + **`api-contracts.json`** as needed).
- Keep **`specs/`** as the canonical behavioral source of truth.

---

### STEP 6 — BLOCKING: User confirms archive

Before moving the change folder, **ask again**:

> Specs are updated. Reply with **`confirm archive`** or **`yes, move to completed`** to move **`changes/active/<slug>/`** → **`changes/completed/<YYYY-MM-DD>-<slug>/`**.

Use **`YYYY-MM-DD`** (or the team’s agreed date format) for the prefix. The **`<slug>`** matches the active folder name.

**Until confirmation:** do **not** move or rename **`changes/active/<slug>/`**.

---

### STEP 7 — Archive (after confirmation)

Only after STEP 6 confirmation:

- Move **`changes/active/<slug>/`** → **`changes/completed/<YYYY-MM-DD>-<slug>/`** (terminal command or workspace tools).

Example: `changes/active/task-azure-1234-make-login/` → `changes/completed/2026-02-06-task-azure-1234-make-login/`

---

### STEP 8 — Status output

- Status: `CHANGE_COMPLETED`
- Details: Which **`specs/`** files were updated; final **`changes/completed/...`** path.

---

## One-shot option (if user requests)

If the user explicitly says they want **one** confirmation for both actions, you may ask once:

> Reply **`confirm specs and archive`** to apply the proposed `specs/` updates and then move the folder to `changes/completed/`.

Still **do not** write or move until they reply with that confirmation.
