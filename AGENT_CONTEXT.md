# Conxian_UI — Agent Context Dump (Save/Resume State)

Date: Monday, 2025-12-29
Repo: `Conxian_UI`

## Objective (Tier0 Alignment)

Deliver P0 UI polish to reach Aave/Uniswap/Coinbase-grade product quality while **keeping the existing color palette unchanged**.

P0 scope:

- Replace raster branding with the new flat SVG mark (favicon + sidebar/header).
- Remove design-token drift (`bg-paper`, `text-light`, hardcoded gray/white classes).
- Ensure all inputs/buttons use canonical UI components (`Input`, `Button`).
- Establish a consistent header baseline (page title + network/environment indicator + wallet control).

Non-goals for this pass:

- No palette changes (values must remain the same).
- No P1/P2 features.

## Decisions (Locked)

- Final logo mark: `public/conxian-mark-b.svg`
- Theme: unify **all routes** (including dev/ops tooling pages) to the same light Tier0 theme using the existing palette (no separate dark/pro theme).

## Source-of-Truth Theme Tokens (Tailwind)

From `tailwind.config.ts`:

- `primary.DEFAULT`: `#2E403B`
- `primary.dark`: `#1A2623`
- `primary.foreground`: `#FFFFFF`
- `accent.DEFAULT`: `#D4A017`
- `background.DEFAULT`: `#F5F5F5`
- `background.paper`: `#E0E0E0`
- `text.DEFAULT` / `text.primary`: `#333333`
- `text.secondary`: `#666666`
- `text.muted`: `#999999`

Canonical usage patterns:

- Surfaces: `bg-background`, `bg-background-paper`
- Copy: `text-text`, `text-text-primary`, `text-text/80`
- Accents/borders: `border-accent/20`
- Primary CTA: `bg-primary text-primary-foreground`

## Repo Map (Entry Points)

- `src/app/layout.tsx`
  - Global shell: `Sidebar` + `Header` + `Providers`
  - Currently hardcodes favicon via `<link rel="icon" href="/logo.jpg" />`.
- `src/app/providers.tsx`
  - Wraps app in `WalletProvider` and also renders a `ToastContainer`.
- `src/app/globals.css`
  - Hard-sets body background/text to palette values (matches Tailwind config).
- `src/lib/wallet.tsx`
  - WalletProvider using `@stacks/connect` `showConnect`.
  - `appDetails.icon` currently points to `/favicon.ico`.
  - Note: `ToastContainer` is also rendered here (in addition to `src/app/providers.tsx`).
- `src/components/Header.tsx`
  - Sticky top bar; currently only renders `ConnectWallet`.
- `src/components/Sidebar.tsx`
  - Primary nav shell; currently uses invalid `text-light` tokens.

## Route Inventory (App Router)

User-facing flows:

- `/` (Dashboard)
- `/swap`
- `/launch`
- `/invest`
- `/add-liquidity`
- `/positions`
- `/shielded`

Developer / ops tooling pages (must also be Earthy Corporate Finance (Green/Gold); currently heavy gray-token drift):

- `/tokens`
- `/contracts`
- `/tx`
- `/router`
- `/pools`
- `/network`
- `/overview`

## Branding Assets (Public)

Current files in `public/`:

- `logo.jpg` (legacy raster)
- `conxian-mark-a.svg` (new flat mark; filled shield + gold outline; not selected)
- `conxian-mark-b.svg` (new flat mark; outlined shield; FINAL)

### Current wiring (needs update)

- `src/app/layout.tsx`
  - Favicon currently: `<link rel="icon" href="/logo.jpg" />`
- `src/app/favicon.ico`
  - App Router favicon asset (served at `/favicon.ico`).
- `src/lib/wallet.tsx`
  - `appDetails.icon` currently: `'/favicon.ico'` (currently resolves to `src/app/favicon.ico`).

P0 intent:

- Replace favicon with `/conxian-mark-b.svg`.
- Align wallet connect app icon with `/conxian-mark-b.svg`.

## Design-Token Drift — Known Hotspots

This section is intentionally specific so we can resume quickly tomorrow.

### 1) `bg-paper` (invalid / drift)

Replace with: `bg-background-paper`

Occurrences (from grep):

- `src/app/invest/page.tsx`
  - Input uses `bg-paper`
- `src/app/positions/page.tsx`
  - `<Card ... className="bg-paper">`
- `src/app/shielded/page.tsx`
  - wallet list items `className="... bg-paper ..."`
- `src/app/launch/page.tsx`
  - leaderboard row items `... rounded bg-paper`

### 2) `text-light` (invalid / drift)

Replace with valid theme tokens, usually:

- On `bg-primary`: `text-primary-foreground`
- On light surfaces: `text-text` / `text-text-primary`

Occurrences (from grep):

- `src/components/Sidebar.tsx`
  - Branding text + nav link styles rely on `text-light` variants
- `src/app/invest/page.tsx`
  - Invest button uses `text-light`
- `src/app/add-liquidity/page.tsx`
  - Action buttons use `text-light`

### 3) Hardcoded gray/white UI styling (drift)

These are not aligned with the Conxian theme tokens yet:

- `src/components/ConnectWallet.tsx`
  - Uses `border-gray-*`, `hover:bg-gray-*` on a raw `<button>`
  - P0 intent: use canonical `Button`.
- `src/components/EnvStatus.tsx`
  - Uses `bg-gray-900`, `border-gray-800`, `text-gray-400`, etc.
  - P0 intent: cTier0 light theme tokens.
- `src/components/ui/Toast.tsx`
  - Uses `bg-gray-800 text-white` and gray close button.
- `src/components/ui/Badge.tsx`
  - Default/secondary/outline variants are gray-based.
- `src/components/ui/Tabs.tsx`
  - Tabs list and triggers use gray + dark variants.
- `src/components/ui/Progress.tsx`
  - Track/indicator uses gray + dark variants.
- `src/components/ui/TokenSelect.tsx`
  - Uses `text-white` and `hover:bg-gray-700`.
- `src/components/ui/StatusIndicator.tsx`
  - Text uses `text-gray-400` (indicator dots are green/yellow/red).
- `src/components/ui/StatCard.tsx`
  - Value uses `text-white`.
- `src/components/ui/Card.tsx`
  - `CardDescription` uses `text-gray-500`.

Additional drift discovered in full repo scan:

- `src/app/overview/page.tsx`
  - Uses `text-white`, `text-gray-400`.
- `src/components/ui/SystemStatus.tsx`
  - Uses `text-white`, `text-gray-400`, `text-gray-500`.
- `src/components/ui/CoreContracts.tsx`
  - Uses `text-gray-500`.
- `src/app/network/page.tsx`, `src/app/pools/page.tsx`, `src/app/router/page.tsx`, `src/app/tx/page.tsx`, `src/app/contracts/page.tsx`, `src/app/tokens/page.tsx`
  - Extensive use of `bg-gray-*`, `border-gray-*`, `text-gray-*`, and `ring-blue-*`.

## Invalid / Nonexistent Tailwind Classes Found

- `bg-primary-DEFAULT` (in `src/app/swap/page.tsx`)
  - Should be `bg-primary`.
- `text-neutral-medium` (in `src/app/pools/page.tsx`)
  - Not present in `tailwind.config.ts` (`neutral.light` exists; `neutral.medium` does not).
- Shadcn-style tokens used without definitions:
  - `border-input` (Button outline variant)
  - `focus-visible:ring-ring` (Button focus ring)
  - These likely resolve to defaults (or no-op) and should be mapped to Conxian tokens (e.g. `border-accent/20`, `focus-visible:ring-accent`).

## Canonical UI Components (Use These Everywhere)

- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/Progress.tsx`

Notes:

- `Input` already uses `bg-background-paper` + theme focus ring.
- Some pages still use raw `<button>` and custom input classes.

## Header Baseline (P0 Target)

Current:

- `src/components/Header.tsx` is a simple sticky bar with `ConnectWallet`.

P0 target:

- Consistent baseline across pages:
  - Left: page title (route-aware)
  - Right: network/env indicator + wallet connect

Network/env indicator inputs:

- `src/lib/config.ts` provides Core API URL + inferred network.
- `EnvStatus` exists but styling is currently off-theme.

## Visual Regression / Screenshots

Playwright is already set up:

- `playwright.config.ts`
  - base URL: `http://localhost:3001`
  - webServer command: `npm run dev -- -p 3001`
- `tests/screenshots.spec.ts`
  - Generates screenshots into `docs/images/`:
    - `homepage.png`
    - `guide_02_swap_page.png`
    - `guide_03_swap_form_filled.png`
    - `add_liquidity_page.png`
    - `positions_page.png`
    - `shielded_page.png`
    - `launch_page.png`

## Dependencies (Quick Reference)

From `package.json`:

- Next: `^15.5.9`
- React: `19.2.0`
- Stacks libs:
  - `@stacks/connect`: `8.1.9`
  - `@stacks/transactions`: `7.2.0`
  - `@stacks/network`: `7.2.0`

## Resume Checklist (Tomorrow)

1) **Brand wiring**
   - Final mark: `conxian-mark-b.svg`.
   - Update favicon in `src/app/layout.tsx` to new SVG.
   - Update `src/lib/wallet.tsx` `appDetails.icon` to `/conxian-mark-b.svg`.
   - Update sidebar (and optionally header) to show mark + wordmark.

2) **Token drift cleanup**
   - Replace `bg-paper` -> `bg-background-paper`.
   - Replace `text-light` -> `text-primary-foreground` (on primary) / theme tokens elsewhere.
   - Replace invalid `bg-primary-DEFAULT` -> `bg-primary`.
   - Replace invalid `text-neutral-medium` -> `text-text-secondary` (or `text-text/80`).
   - Replace `bg-gray|text-gray|border-gray|ring-blue` usage across dev/ops pages with theme tokens.

3) **Component unification**
   - Update `ConnectWallet` to use canonical `Button`.
   - Ensure Invest/Add Liquidity actions use canonical `Button`.
   - Ensure any remaining ad-hoc `<input>` uses `Input`.
   - Ensure `ToastContainer` is rendered exactly once (currently duplicated in `Providers` + `WalletProvider`, and also rendered in `src/app/invest/page.tsx`).

4) **Header baseline**
   - Add route-aware page title.
   - Add a compact network/env indicator (either new component or restyled `EnvStatus`).

5) **Restyle remaining gray/white components**
   - `Toast`, `Badge`, `Tabs`, `Progress`, `TokenSelect`, `StatusIndicator`, `StatCard`, `CardDescription`.

6) **Verify**
   - Run dev server and visually inspect key routes.
   - Re-run Playwright screenshot suite and compare.

## Useful “Find Drift” Queries

Suggested searches:

- `bg-paper`
- `text-light`
- `primary-DEFAULT`
- `neutral-medium`
- `border-input|ring-ring|accent-foreground|ring-blue`
- `ToastContainer`
- `bg-gray|text-gray|border-gray`
- `text-white`

## Current State Summary

- New SVG marks exist in `public/`.
- P0 polish changes are **not yet applied**; multiple drift points remain.
- Playwright screenshot harness exists and is ready for validation once UI changes land.
