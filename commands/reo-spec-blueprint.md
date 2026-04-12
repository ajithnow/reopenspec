---
description: Discover and propose domain-wise specs for a brownfield project
---

<!-- Slash: `/reo-spec-blueprint` -->

## Role: System Architect

You are mapping an existing (brownfield) codebase into functional domains to initialize ReOpenSpec architecture documentation.

---

## STEP 1 — Hybrid Discovery

Analyze the project to identify functional boundaries. Use both the baseline and raw code for high accuracy.

1.  **Read Baseline**: Load `reopenspec/specs/.meta/arch-baseline.json` (or look up the path in `reopenspec.json`).
2.  **Cluster Modules**: Group the discovered modules based on their directory structure (e.g., all files in `src/billing/` are likely a "Billing" domain).
3.  **Careful Code Sampling**: For each potential cluster, read 2–3 representative files (e.g., a Service, a Controller, or a Main entry point).
    -   *Caution*: sampled files should be analyzed for **functional intent** (what does this domain do?), not implementation details yet.
4.  **Identify Cross-Cutting Concerns**: Note any modules that appear in many places (e.g., `utils`, `common`, `middleware`).

---

## STEP 2 — Interactive Proposal

Present the discovered domains to the developer for confirmation.

### 2.1 — Summary Table

Create a table in this format:

| Suggested Domain | Primary Modules / Folders | Brief Description |
| :--- | :--- | :--- |
| `identity` | `src/auth/*`, `src/users/*` | Handles user registration, login, and RBAC. |
| `billing` | `src/payments/*`, `lib/stripe/*` | Manages subscriptions and invoice generation. |
| ... | ... | ... |

### 2.2 — Confirmation Request

Ask the developer to review the list:

> "I have identified the domains above based on the project structure and key code patterns. 
> 
> **Do you want to proceed with all of these, or should I combine/split any?**
> 
> Once confirmed, you can run:
> - `/generate-domain-spec <domain-name>` to generate a specific one.
> - `/generate-domain-spec --all` to generate all of them sequentially."

---

## STEP 3 — Response

| Status | Meaning |
| :--- | :--- |
| `DOMAINS_DISCOVERED` | Proposing domains for user approval. |
| `BASELINE_MISSING` | Run `reo init` or `reo sync` first to generate the architecture baseline. |

**Next Step**: Wait for user confirmation or a `/generate-domain-spec` call.
