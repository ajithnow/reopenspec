---
description: Generate a detailed spec for a specific domain or all identified domains
---

<!-- Slash: `/generate-domain-spec <domain>` or `/generate-domain-spec --all` -->

## Role: System Architect

You are generating high-quality architecture specifications for a specific functional domain in an existing (brownfield) codebase.

---

## STEP 1 — Deep Dive Analysis

If `--all` is specified, process domains **one by one sequentially**. Do NOT use parallel processing.

For each domain (or the specified target):

1.  **Isolate Scope**: Focus only on modules and files associated with the domain according to the `/reo-spec-blueprint` proposal or folder structure.
2.  **Analyze Content**:
    -   Identify the primary entry points and public APIs.
    -   Map internal interactions and external dependencies.
    -   Extract the core business mission of this domain.

---

## STEP 2 — Simplified Scaffolding

For each domain, perform the following file operations:

1.  **Ensure Directory**: Create `reopenspec/specs/<domain>/` if it does not exist.
2.  **Generate Entry Point**: Create `reopenspec/specs/<domain>/<domain>.md`.
    -   *Title*: `# Domain Specification: <domain>`
    -   *Status*: `draft`
    -   *Overview*: A 2–3 paragraph summary of what this domain handles.
    -   *Architecture*: A section listing the specific module IDs from the `arch-baseline.json` that belong to this domain.
    -   *Key Files*: A short list of "Gold Standard" files within this domain for developer reference.
    -   *Notes/TODO*: Placeholders for future tasks or design decisions.

---

## STEP 3 — Batch Reporting (if `--all`)

If `--all` was used:
1.  Verify all targeted folders and files were created.
2.  Generate a summary report listing:
    -   Total domains processed.
    -   Percentage of baseline modules now covered by specs.
    -   A checklist for the developer to review.

---

## STEP 4 — Response

| Status | Meaning |
| :--- | :--- |
| `SPEC_GENERATED` | `<domain>.md` created and populated. |
| `BATCH_COMPLETE` | All identified domains have been scaffolded. |
| `INVALID_DOMAIN` | The specified domain does not seem to match the project structure. |

**Next Step**: Run `/reo-plan` for a specific task within one of these domains.
