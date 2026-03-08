## Context

The Conxian UI is a complex Next.js application interacting with multiple Stacks smart contracts. Currently, requirements and architectural decisions are scattered across READMEs, AGENTS.md, and individual page implementations. This design aims to centralize these into a spec-driven framework using OpenSpec, ensuring a clear "source of truth" for what the system does and how it's built.

## Goals / Non-Goals

**Goals:**
- Centralize all functional requirements into `openspec/specs/`.
- Document the mapping between business logic and technical submodules.
- Provide a clear design document that explains the modular architecture.
- Identify and document remediation tasks for current implementation drift.

**Non-Goals:**
- This design does not propose a complete rewrite of the existing frontend.
- It does not involve changing the underlying smart contract logic on the Stacks blockchain.
- It does not introduce new UI themes or brand assets (stays aligned with Tier0 polish).

## Decisions

- **Modular Spec Structure**: We will use a hierarchical spec structure:
  - **Business Flows**: High-level user journeys (e.g., Swap, Launch).
  - **Asset Management**: Cross-cutting requirements for token handling.
  - **System Modules**: Functional blocks mapped to smart contract sets (e.g., DEX, Vault).
  - **Technical Submodules**: Low-level implementation details (e.g., API, Wallet).
  - *Rationale*: This hierarchy allows for clear separation of concerns and easier navigation of the requirements.

- **Centralized Asset Registry**: Define a canonical `Tokens` array and `formatAmount`/`parseAmount` utilities in `src/lib/utils.ts`.
  - *Rationale*: Prevents decimal errors and ensures UI consistency for token displays.

- **Wait-for-Transaction UX**: All business flows must implement a standardized "transaction feedback" pattern with explorers links and status indicators.
  - *Rationale*: Critical for user trust in decentralized applications.

## Risks / Trade-offs

- **[Risk] Spec-Code Desynchronization** → **Mitigation**: Use OpenSpec to validate and archive changes, and run automated audits (Playwright) after changes.
- **[Risk] Overhead of Documentation** → **Mitigation**: Keep specs concise and focus on normative requirements (SHALL/MUST) that directly map to test cases.

## Migration Plan

1. Initialize OpenSpec and define initial proposal, specs, and design (Current Phase).
2. Audit the current codebase against these artifacts to identify remediation tasks.
3. Apply code changes to align with the specs.
4. Verify alignment using `openspec validate` and existing test suites.
5. Archive the change to update the main project specs.
