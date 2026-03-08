## 1. Specification and Design Initialization

- [x] 1.1 Create OpenSpec change "overhaul-spec-driven-design"
- [x] 1.2 Write initial proposal for the overhaul
- [x] 1.3 Create detailed specs for Business, Assets, Modules, and Submodules
- [x] 1.4 Draft the technical design document

## 2. Codebase Audit and Remediation Planning

- [x] 2.1 Audit `src/app/swap/page.tsx` against Token Swap specs
- [x] 2.2 Audit `src/app/launch/page.tsx` against Self-Launch specs
- [x] 2.3 Audit `src/app/shielded/page.tsx` against Shielded Asset specs
- [x] 2.4 Audit `src/lib/utils.ts` for standardized amount formatting

## 3. Remediation Implementation

- [x] 3.1 Standardize Token Metadata and Amount Formatting in `src/lib/utils.ts`
- [x] 3.2 Align Swap Page logic with DEX Router and Factory requirements
- [x] 3.3 Ensure consistent transaction feedback on the Launch page
- [x] 3.4 Verify Shielded Asset page fetches correct private balances

## 4. Final Review and Archiving

- [x] 4.1 Run full suite of UI and Contract tests (`pnpm test`)
- [x] 4.2 Validate the final OpenSpec state (`openspec validate`)
- [x] 4.3 Archive the change to establish the baseline (`openspec archive`)
